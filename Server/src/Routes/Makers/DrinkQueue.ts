import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import {DrinkQueue} from "../../models/Queue";
import Orders from "../../models/Orders";
import Users from "../../models/User";
import getIoInstance from "../../socketio-config";

// Define a schema for food queue input validation using Joi
export const DrinkQueueSchemaValidation = Joi.object().keys({
    dish: Joi.string().required(),
    order: Joi.string().required(),
})

// Export the router
export default (): Router => {
    const app = Router();

    // GET endpoint to retrieve drink in queue based on the query parameters passed
    app.get('/', isLogged, hasRole("Bartender", "Cashier"), async (req, res)=> {
        try{
            const drinks = await DrinkQueue.find(req.query).populate("dish")
            return res.status(200).send(drinks);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve drink in queue by its ID
    app.get('/:id', isLogged, hasRole("Bartender", "Cashier"), async (req, res)=> {
        try{
            const drink = await DrinkQueue.findById(req.params.id);
            return res.status(200).send(drink);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // put endpoint to modify an existing drink in queue
    app.put("/:id", isLogged, hasRole('Bartender'), async (req, res) => {
        const drink = await DrinkQueue.findById(req.params.id);
        if (drink === null) return res.status(400).send({errorMessage: "Drink in queue doesn't exist", status:400, error:true})

        if (drink.begin && drink.end) return res.status(400).send({errorMessage:"Already finished", status:400, error:true});

        if (!drink.begin) {
            drink.begin = true;
            drink.makerId = req.user._id.toString();
        }
        else {
            drink.end = true;
            const order = await Orders.findById(drink.order);
            order.ready = true;
            await order.save();
            const completeOrder = await Orders.find({orderNumber: drink.orderNumber, ready: false})
            // const completeOrder = await DrinkQueue.find({orderNumber: drink.orderNumber, end: false})
            if (completeOrder.length === 0) {
                getIoInstance().emit('order_finished');
            }
        }

        // Save the changes to the drink in the queue in the database
        try{
            await drink.save();
            if (drink.end) await Users.findOneAndUpdate({email: req.user.email}, {$inc: {counter: 1}});
            getIoInstance().emit('drink_queue_change')
            return res.status(200).send({message:"Drink modified successfully", error:false, status:200});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete food in the queue by its ID
    app.delete("/:id", isLogged, hasRole('Bartender'), async (req, res) => {
        const drink = await DrinkQueue.findById(req.params.id);
        if (drink === null) return res.status(400).send({status:400, error: true, errorMessage: "Drink in queue doesn't exist"});

        try{
            await drink.deleteOne();
            getIoInstance().emit('drink_queue_change')
            return res.status(200).send({status: 200, error:false, message:"Drink deleted successfully"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}