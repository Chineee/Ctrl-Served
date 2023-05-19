import {Router} from "express";
import {hasRole, isLogged} from "./Auth";
import Joi from "joi";
import FoodQueue from "../models/FoodQueue";
import Orders from "../models/Orders";

// Define a schema for food queue input validation using Joi
export const FoodQueueSchemaValidation = Joi.object().keys({
    dish: Joi.string().required(),
    order: Joi.string().required(),
})

// Export router
export default (): Router => {
    const app = Router();

    // GET endpoint to retrieve food in queue based on the query parameters passed
    app.get('/', isLogged, hasRole("Cook", "Cashier"), async (req, res)=> {
        try{
            const foods = await FoodQueue.find(req.query);
            return res.status(200).send(foods);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve food in queue by its ID
    app.get('/:id', isLogged, hasRole("Cook", "Cashier"), async (req, res)=> {
        try{
            const food = await FoodQueue.findById(req.params.id).populate("dish");

            return res.status(200).send(food);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // POST endpoint to modify an existing food in queue
    app.post("/:id", isLogged, hasRole('Cook'), async (req, res) => {
        const food = await FoodQueue.findById(req.params.id);
        if(food === null) return res.status(400).send("Food in queue doesn't exist");

        if (food.begin && food.end) return res.status(200).send("Already finished");

        if (!food.begin) {
            food.begin = true;
            food.makerId = req.user._id.toString();
        }
        else {
            food.end = true;
            const order = await Orders.findById(food.order);
            order.ready = true;
            await order.save();
            //TODO controlla se tutti i piatti di un ordine sono finiti
            const completeOrder = await Orders.find({orderNumber: food.orderNumber, ready: false})
            console.log(completeOrder);
            if (completeOrder.length === 0) {
                //todo notify waiter tutto finito
                console.log("TUTTO FINITOOOOOOOOOOOOOO")
            }
        }

        // Save the changes to the food in the queue in the database
        try{
            await food.save()
            return res.status(200).send("Food modified correctly");
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete food in the queue by its ID
    app.delete("/:id", isLogged, hasRole('Cook'), async (req, res) => {
        const food = await FoodQueue.findById(req.params.id);
        if (food === null) return res.status(400).send("Food in queue doesn't exist");

        try{
            await food.deleteOne();
            return res.status(200).send("Food deleted successfully");
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}