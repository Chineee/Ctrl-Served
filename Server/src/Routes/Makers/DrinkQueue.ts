import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import DrinkQueue from "../../models/DrinkQueue";
import Orders from "../../models/Orders";
import Users from "../../models/User";

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
            const drinks = await DrinkQueue.find(req.query)
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

    // POST endpoint to modify an existing drink in queue
    app.post("/:id", isLogged, hasRole('Bartender'), async (req, res) => {
        const drink = await DrinkQueue.findById(req.params.id);
        if (drink === null) return res.status(400).send("Drink in queue doesn't exist")

        if (drink.begin && drink.end) return res.status(200).send("Already finished");

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
                //todo notify waiter tutto finito
                console.log("TUTTO FINITOOOOOOOOOOOOOO")
            }
        }

        // Save the changes to the drink in the queue in the database
        try{
            await drink.save();
            await Users.findOneAndUpdate({email: req.user.email}, {$inc: {counter: 1}});
            return res.status(200).send("Drink modified successfully");
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete food in the queue by its ID
    app.delete("/:id", isLogged, hasRole('Bartender'), async (req, res) => {
        const drink = await DrinkQueue.findById(req.params.id);
        if (drink === null) return res.status(400).send("Drink in queue doesn't exist")

        try{
            await drink.deleteOne();
            return res.status(200).send("Drink deleted successfully");
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}