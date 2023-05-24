import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import Receipts from "../../models/Receipts";
import Orders from "../../models/Orders";
import Tables from "../../models/Tables";

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

        if ((await Tables.findOne({tableNumber: req.body.tableNumber})).occupied === false) return res.status(400).send("Table isn't occupied")

        const dishes = await Orders.find({tableNumber: req.body.tableNumber}).populate('dish');
        const dishesId = [];
        let price = 0;
        for(let i = 0; i < dishes.length; i++) {
            if (dishes[i].ready === false) return res.status(400).send("Orders haven't been finished yet")
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
            tableNumber: req.body.tableNumber,
            dishes: dishesId,
            date: formattedDate,
            hour: formattedTime,
            price: price.toFixed(2)
        });

        try {
            await receipt.save();
            // await Orders.deleteMany({tableNumber: req.body.tableNumber});
            //TODO SALVA CHE IL CAMERIERE HA SALVATO TOT ORDINI
            await Tables.findOneAndUpdate({tableNumber: req.body.tableNumber}, {occupied:false, customers:0, waiterId: null})
            //todo notify waiter che il dispositivo ha changato tavolo free
            return res.status(200).send(receipt);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    app.get('/', isLogged, hasRole("Cashier"), async (req, res) => {
        const receipts = await Receipts.find(req.query).populate("dishes");
        return res.status(200).send(receipts);
    });

    app.get('/:id', isLogged, hasRole("Cashier"), async (req, res)=>{
        try {
            const receipt = await Receipts.findById(req.params.id).populate("dishes", "-productionTime -type -__v -_id");
            return res.status(200).send(receipt);
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    return app;
};