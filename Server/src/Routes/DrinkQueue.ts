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

    //dovrebbero essere qui come paths oppure lo gestiamo da ordini?
    app.put('/', isLogged, hasRole('Waiter'), async (req, res)=> {
        const {error} = DrinkQueueSchemaValidation.validate(req.body);

        if (error) return res.status(400).send("Invalid input");

        const drink = new DrinkQueue({
            order: req.body.order,

        })
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