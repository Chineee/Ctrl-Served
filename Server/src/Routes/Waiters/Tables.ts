import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import Tables from "../../models/Tables";

// Define a schema for table input validation using Joi
export const TableSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
    seats: Joi.number().required(),
})

// Export the router
export default (): Router => {
    const app = Router();

    // PUT endpoint to add a new table
    app.put('/', isLogged, hasRole('Admin'), async (req, res) =>{
        // Validate the input data using the defined schema
        const {error} = TableSchemaValidation.validate(req.body);
        if (error) return res.status(400).send("Invalid input");

        // Create a new table instance
        const table = new Tables({
            waiterId: null,
            tableNumber: req.body.tableNumber,
            occupied: false,
            seats: req.body.seats,
            customers: 0,
        });

        // Save the new table in the database
        try{
            await table.save();
            return res.status(200).send("Table added successfully");
        } catch (err) {
            return res.status(400).send(err)
        }
    });

    // POST endpoint to modify an existing table
    app.post("/:id", isLogged, hasRole('Waiter'), async (req, res) => {
        const table = await Tables.findOne({tableNumber: req.params.id});
        if (table === null) return res.status(400).send("Table doesn't exist");

        if (table.waiterId !== null && req.user._id.toString() !== table.waiterId) return res.status(400).send("You are unauthorized")

        // Update the fields of the table if provided in the request body
        //TODO: make it so waiterId in models\Tables is an ObjectId
        if(req.body.new_occupied !== null && req.body.new_occupied) table.waiterId = req.user._id.toString();
        if(req.body.new_customers !== null) table.customers = req.body.new_customers;
        if(req.body.new_occupied !== null) {
            if (req.body.new_occupied == false) {
                table.waiterId = null;
                table.customers = 0;
            }
            table.occupied = req.body.new_occupied;
        }

        // Save the changes to the table in the database
        try{
            await table.save();
            return res.status(200).send("Table info modified correctly");
        } catch (err) {
            console.log(err)
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve tables based on the query parameters passed
    app.get("/", isLogged, hasRole('Waiter'), async (req, res) => {
        try{
            const tables = await Tables.find(req.query);
            return res.status(200).send(tables);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve a table by its ID
    app.get("/:id", isLogged, hasRole('Waiter'), async (req, res) => {
        try{
            const table = await Tables.findOne({tableNumber: req.params.id});
            return res.status(200).send(table);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete a table by its ID
    app.delete("/:id", isLogged, hasRole('Admin'), async (req, res) => {
        const table = await Tables.findOne({tableNumber: req.params.id});
        if(table === null) return res.status(400).send("Table doesn't exist");

        if(table.occupied)  return res.status(400).send("The table is occupied it cannot be deleted");

        try{
            await table.deleteOne();
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Table deleted successfully");
    });

    return app;
}