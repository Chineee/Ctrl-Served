import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Order from "../../models/Orders"
import Joi from "joi";
import Menu from "../../models/Menus";
import orders from "../../models/Orders";
import FoodQueue from "../../models/FoodQueue";
import DrinkQueue from "../../models/DrinkQueue";

export const OrderSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
    waiterId: Joi.string().required(),
    dishDict: Joi.object().pattern(Joi.string(), Joi.number()).required(),
    type: Joi.string().required()
})

export default (): Router => {
    const app = Router();

    app.put('/', isLogged, hasRole("Waiter"), async (req, res) => {
        const {error} = OrderSchemaValidation.validate(req.body);
        if (error) return res.status(400).send("Invalid input");

        let price: number = 0;

        let dishDict = req.body.dishDict;
        for (let key in dishDict) {
            let dish = await Menu.findById(key);
            price += dish.dishPrice*dishDict[key];
        }

        const order = new Order({
            tableNumber: req.body.tableNumber,
            waiterId: req.user._id,
            dishDict: req.body.foodDict,
            price: price,
            readyCount: 0,
            type: req.body.type
        })
        try {
            await order.save();
            return res.status(200).send("Order sent successfully")
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    app.post("/:id", isLogged, hasRole("Waiter"), async (req, res) => {
        const order = await Order.findById(req.params.id);

        if(req.body.new_tableNumber !== null) order.tableNumber = req.body.new_tableNumber;

        let dishesInQueue;

        if(order.type === 'Foods')  dishesInQueue = await FoodQueue.find({order: req.params.id});
        else dishesInQueue = await DrinkQueue.find({order: req.params.id});

        if(req.body.new_dishDict !== null){
            if(order.readyCount !== 0) return res.status(400).send("This order is already in the making you cannot modify it");

            for(const dish of dishesInQueue){
                if(dish.position === 1) return res.status(400).send("This order is already in the making you cannot modify it");
            }
        }

        if(req.body.new_dishDict !== null && req.user._id === order.waiterId){
            order.dishDict = req.body.new_dishDict;
            let price: number = 0;
            let dishDict = order.dishDict;
            for (let key in dishDict) {
                let dish = await Menu.findById(key);
                price += dish.dishPrice*dishDict[key];
            }
            order.price = price;
        }

        try{
            await order.save();
        }catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Order updated correctly");
    })

    return app;
}