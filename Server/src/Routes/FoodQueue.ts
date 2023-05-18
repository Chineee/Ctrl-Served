import {Router} from "express";
import {hasRole, isLogged} from "./Auth";
import Joi from "joi";
import DrinkQueue from "../models/DrinkQueue";
import FoodQueue from "../models/FoodQueue";

export const FoodQueueSchemaValidation = Joi.object().keys({
    dish: Joi.string().required(),
    order: Joi.string().required(),
})

export default (): Router => {
    const app = Router();

    app.post("/:id", isLogged, hasRole('Cook'), async (req, res) => {
        const food = await FoodQueue.findById(req.params.id);

        if(req.body.new_begin !== null) food.begin = req.body.new_begin;
        if(req.body.new_end !== null) food.end = req.body.new_end;

        try{
            food.save()
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Food modified correctly");
    });

    //since they will be deleted when the receipt is calculated the role should be cashier right?
    app.delete("/:id", isLogged, hasRole('Cashier'), async (req, res) => {
        const food = await FoodQueue.findById(req.params.id);

        try{
            await food.deleteOne();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Food deleted successfully");
    });

    return app;
}