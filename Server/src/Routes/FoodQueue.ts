import {Router} from "express";
import {hasRole, isLogged} from "./Auth";
import Joi from "joi";
import DrinkQueue from "../models/DrinkQueue";
import FoodQueue from "../models/FoodQueue";
import Orders from "../models/Orders";
import mongoose from "mongoose";
import Menus, {IMenu} from "../models/Menus";


export const FoodQueueSchemaValidation = Joi.object().keys({
    dish: Joi.string().required(),
    order: Joi.string().required(),
})

export default (): Router => {
    const app = Router();

    app.get('/', isLogged, hasRole("Cook", "Cashier"), async (req, res)=> {
        try{
            const foods = await FoodQueue.find(req.query);
            return res.status(200).send(foods);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    app.get('/:id', isLogged, hasRole("Cook", "Cashier"), async (req, res)=> {
        try{
            const food = await FoodQueue.findById(req.params.id).populate("dish");

            return res.status(200).send(food);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    app.post("/:id", isLogged, hasRole('Cook'), async (req, res) => {
        const food = await FoodQueue.findById(req.params.id);
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
        try{
            food.save()
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Food modified correctly");
    });

    //since they will be deleted when the receipt is calculated the role should be cashier right?
    app.delete("/:id", isLogged, hasRole('Cook'), async (req, res) => {
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