import {Router} from "express";
import {hasRole, isLogged} from "./Auth";
import Joi from "joi";
import DrinkQueue from "../models/DrinkQueue";

export const DrinkQueueSchemaValidation = Joi.object().keys({
    dish: Joi.string().required(),
    order: Joi.string().required(),
})

export default (): Router => {
    const app = Router();

    app.get('/', isLogged, hasRole("Bartender", "Cashier"), async (req, res)=> {
        try{
            const drinks = await DrinkQueue.find(req.query)
            return res.status(200).send(drinks);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    app.get('/:id', isLogged, hasRole("Bartender", "Cashier"), async (req, res)=> {
        try{
            const drink = await DrinkQueue.findById(req.params.id);
            return res.status(200).send(drink);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    app.post("/:id", isLogged, hasRole('Bartender'), async (req, res) => {
        const drink = await DrinkQueue.findById(req.params.id);

        if(req.body.new_begin !== null) drink.begin = req.body.new_begin;
        if(req.body.new_end !== null) drink.end = req.body.new_end;

        try{
            drink.save();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Drink modified successfully");
    });

    //since they will be deleted when the receipt is calculated the role should be cashier right?
    app.delete("/:id", isLogged, hasRole('Cashier'), async (req, res) => {
        const drink = await DrinkQueue.findById(req.params.id);

        try{
            await drink.deleteOne();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Drink deleted successfully");
    })

    return app;
}