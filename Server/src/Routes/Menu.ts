import {Router} from "express";
import {hasRole, isLogged} from "./Auth";
import Joi from "joi";
import Menu from "../models/Menus";

export const MenuSchemaValidation({
    dishName: Joi.string().required(),
    dishPrice: Joi.number().required(),
    dishProductionTime: Joi.number().required(),
    dishType: Joi.string().required().valid('Foods', 'Drinks')
})

export default (): Router => {
    const app = Router();

    app.put('/', isLogged, hasRole('Admin'), async (req, res) => {
        const {error} = MenuSchemaValidation.validate(req.body);
        if (error) return res.status(400).send("Invalid input");

        const menuDish = new Menu({
            dishName: req.body.dishName,
            dishPrice: req.body.dishPrice,
            dishProductionTime: req.body.dishProductionTime,
            dishType: req.body.dishType
        })

        try{
            await menuDish.save();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Menu dish added successfully");
    });

    app.post("/:id", isLogged, hasRole('Admin'), async (req, res) => {
        const menuDish = await Menu.findById(req.params.id);

        if(req.body.new_dishName !== null) menuDish.dishName = req.body.new_dishName;
        if(req.body.new_dishPrice !== null && req.body.new_dishPrice > 0) menuDish.dishPrice = req.body.new_dishPrice;
        if(req.body.new_dishProductionTime !== null && req.body.new_dishProductionTime >= 0) menuDish.dishProductionTime = req.body.new_dishProductionTime;
        if(req.body.new_dishType !== null) menuDish.dishType = req.body.new_dishType;

        try{
            menuDish.save();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Menu dish modified successfully");
    });

    //TODO: implement get

    app.delete("/:id", isLogged, hasRole('Admin'), async (req,res) => {
        const menuDish = await Menu.findById(req.params.id);

        try{
            await menuDish.deleteOne();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Menu dish deleted successfully");
    });

    return app;
}