import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import Receipts from "../../models/Receipts";
import Orders from "../../models/Orders";
import Tables from "../../models/Tables";
import {Types} from "mongoose";
import Users from "../../models/User";
import getIoInstance from "../../socketio-config";


// Define a schema for receipt input validation using Joi
export const ReceiptSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
})

// Export the router
export default () : Router => {
    const app = Router();

    // PUT endpoint to add a new receipt
    app.post('/', isLogged, hasRole("Cashier"), async (req, res) => {
        // Validate the input data using the defined schema
        const {error} = ReceiptSchemaValidation.validate(req.body);
        if (error) return res.status(400).send(error);

        const table = await Tables.findOne({tableNumber: req.body.tableNumber});
        if (!table.occupied) return res.status(400).send({status: 400, error: true, errorMessage: "Table isn't occupied"})

        const dishes = await Orders.find({tableNumber: table.tableNumber}).populate('dish');
        const dishesId = [];
        let price = 0;
        //NB WE USE ORDER NUMBER SET TO -1 IF WAITER HAS DELIVERED DISH ORDER NUMBER TO THAT TABLE
        // ordernumber is made by more dishes, when a waiter delivere an entire order number, all dishes which have that order number
        //will have order number set to -1, then when receipt has been made, order will be deleted
        for(let i = 0; i < dishes.length; i++) {
            if (dishes[i].ready === false || dishes[i].orderNumber !== -1) return res.status(400).send({error: true, status: 400, errorMessage:"Dishes haven't been finished"})
            price += dishes[i].price;
            dishesId.push(dishes[i].dish._id);
        }

        const currentDate = new Date();

        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Europe/Rome',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        };

        const formatter = new Intl.DateTimeFormat('it-IT', options);
        const formattedDateTime = formatter.format(currentDate);

        const [formattedDate, formattedTime] = formattedDateTime.split(', ');

        // Save the new receipt in thed database
        const receipt = new Receipts({
            tableNumber: table.tableNumber,
            dishes: dishesId,
            date: formattedDate,
            hour: formattedTime,
            price: price.toFixed(2),
            waiterId: table.waiterId
        });

        try {
            await receipt.save();
            await Orders.deleteMany({tableNumber: req.body.tableNumber});
            const oldTable = await Tables.findOneAndUpdate({tableNumber: table.tableNumber}, {occupied:false, customers:0, waiterId: null})
            getIoInstance().emit('receipt_created');
            await Users.findOneAndUpdate({_id:req.user._id}, {$inc:{"counter.tableServed": 1, "counter.customersServed": oldTable.customers}});
            const receiptSent = await (await receipt.populate("dishes")).populate("waiterId", "-passwored -role -email -__v");
            return res.status(200).send(receiptSent);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    app.get('/', isLogged, hasRole("Cashier"), async (req, res) => {
        const receipts = await Receipts.find(req.query).populate('dishes', '-__v').populate("waiterId", "-password -role -email -__v");
        return res.status(200).send(receipts);
    });

    app.get('/:id', isLogged, hasRole("Cashier"), async (req, res)=>{
        try {
            const receipt = await Receipts.findById(req.params.id).populate("dishes", "-productionTime -type -__v -_id").populate("waiterId", "-password -email -__v");
            return res.status(200).send(receipt);
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    return app;
};