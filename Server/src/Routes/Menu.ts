import {Router} from "express";
import {hasRole, isLogged} from "./Auth";
import Joi from "joi";
import Menu from "../models/Menus";

// Define a schema for menu input validation using Joi
export const MenuSchemaValidation = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    productionTime: Joi.number().required(),
    type: Joi.string().required().valid('Food', 'Drink')
})

// Export the router
export default (): Router => {
    const app = Router();

    // POST endpoint to add a new menu dish or drink
    app.post('/', isLogged, hasRole('Admin'), async (req, res) => {
        // Validate the input data using the defined schema
        const {error} = MenuSchemaValidation.validate(req.body);
        if (error) return res.status(400).send(error);

        // Create a new menu dish instance
        const menuDish = new Menu({
            name: req.body.name,
            price: req.body.price,
            productionTime: req.body.productionTime,
            type: req.body.type
        });

        // Save the new menu dish in the database
        try{
            await menuDish.save();
            return res.status(200).send({status: 200, error: false, message: "The menu dish was added successfully"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // PUT endpoint to modify an existing menu dish
    app.put("/:id", isLogged, hasRole('Admin'), async (req, res) => {
        const menuDish = await Menu.findById(req.params.id);
        if (menuDish === null) return res.status(400).send({status: 400, error: true, errorMessage: "This menu dish doesn't exist"});

        // Update the fields of the menu dish if provided in the request body
        if(req.body.new_name !== null) menuDish.name = req.body.new_name;
        if(req.body.new_price !== null && req.body.new_price > 0) menuDish.price = req.body.new_price;
        if(req.body.new_productionTime !== null && req.body.new_productionTime >= 0) menuDish.productionTime = req.body.new_productionTime;
        if(req.body.new_type !== null) menuDish.type = req.body.new_type;

        // Save the changes to the menu dish in the database
        try{
            await menuDish.save();
            return res.status(200).send({status: 200, error: false, message: "The menu dish was modified successfully"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve a menu dish by ID
    app.get("/:id", isLogged, async (req,res) => {
        try {
            const dish = await Menu.findById(req.params.id);
            return res.status(200).send(dish)
        } catch (err) {
            return res.status(400).send(err);
        }
        
    });

    // GET endpoint to retrieve menu dishes based on the query parameters passed
    app.get('/', isLogged, async (req, res) => {
        try{
            const dishes = await Menu.find(req.query);
            return res.status(200).send(dishes);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete a menu dish by ID
    app.delete("/:id", isLogged, hasRole('Admin'), async (req,res) => {
        const menuDish = await Menu.findById(req.params.id);
        if(menuDish === null) return res.status(400).send({status: 400, error: true, errorMessage: "This menu dish doesn't exist"});

        try{
            await menuDish.deleteOne();
            return res.status(200).send({status: 200, error: false, message: "The menu dish was deleted successfully"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}