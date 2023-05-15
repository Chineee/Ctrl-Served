import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Order from "../../models/Orders"
import Joi from "joi";
import Menu from "../../models/Menus";

export const OrderSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
    waiterId: Joi.string().required(),
    dishDict: Joi.object().pattern(Joi.string(), Joi.number()).required()
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
            dishDict: req.body.dishDict,
            price: price,
            readyCount: 0,
        })
        try {
            await order.save();
            return res.status(200).send("Order sent successfully")
        } catch(err) {
            return res.status(400).send(err);
        }
    });



    return app;
}