import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import Tables from "../../models/Tables";
import Orders from "../../models/Orders";
import getIoInstance from "../../socketio-config"

// Define a schema for table input validation using Joi
export const TableSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
    seats: Joi.number().required(),
})

// Export the router
export default (): Router => {
    const app = Router();

    // POST endpoint to add a new table
    app.post('/', isLogged, hasRole('Admin'), async (req, res) =>{
        // Validate the input data using the defined schema
        const {error} = TableSchemaValidation.validate(req.body);
        if (error) return res.status(400).send({status: 400, error: true, errorMessage: "Invalid input"});

        // Create a new table instance
        const table = new Tables({
            waiterId: null,
            tableNumber: req.body.tableNumber,
            occupied: false,
            seats: req.body.seats,
            customers: 0,
        });

        // Save the new table in the database
        try {
            await table.save();
            getIoInstance().emit("table_modified")
            return res.status(200).send({status:200, error: false, message:"Table added successfully"});
        } catch (err) {
            return res.status(400).send(err)
        }
    });

    // PUT endpoint to modify an existing table
    app.put("/:id", isLogged, hasRole('Waiter'), async (req, res) => {
        const table = await Tables.findOne({tableNumber: req.params.id});
        if (table === null) return res.status(400).send({status:400, error: true, errorMessage: "The table doesn't exist"});

        if (table.waiterId !== null && req.user._id.toString() !== table.waiterId) return res.status(403).send({error: true, status:400, errorMessage:"You are unauthorized"})

        // Update the fields of the table if provided in the request body
        //TODO: make it so waiterId in models\Tables is an ObjectId
        if(req.body.new_seats !== undefined && req.user.role === 'Admin')  table.seats = req.body.new_seats;
        if(req.body.new_occupied !== undefined && req.body.new_occupied) table.waiterId = req.user._id.toString();
        if(req.body.new_customers !== undefined) table.customers = req.body.new_customers;
        if(req.body.new_occupied !== undefined) {
            if (!req.body.new_occupied) {
                table.waiterId = null;
                table.customers = 0;
            }
            table.occupied = req.body.new_occupied;
        }


        // Save the changes to the table in the database
        try {
            await table.save();
            getIoInstance().emit("table_modified", "table");
            return res.status(200).send({error: false, status:200, message:"The table info was modified correctly"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve tables based on the query parameters passed
    app.get("/", isLogged, hasRole('Waiter', "Cashier"), async (req, res) => {
        try {
            //AV QUERY: occupied free or not free
            const query = req.query.occupied ? {occupied: req.query.occupied} : {};
            const tables = await Tables.find(query).populate("waiterId", "-password -__v, -counter");
            return res.status(200).send(tables);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve all the orders related to a specific table number
    app.get('/:id/orders', isLogged, hasRole("Cashier"), async (req, res) => {
        try {
            const orders = await Orders.find({tableNumber: req.params.id, orderNumber: {$gt: -1}}).populate("dish").populate("waiterId", "-password -__v")
            return res.status(200).send(orders);
        } catch (err) {
            return res.status(400).send(err);
        }
    })

    // GET endpoint to retrieve a table by its ID
    app.get("/:id", isLogged, hasRole('Waiter', "Cashier"), async (req, res) => {
        try {
            const table = await Tables.findOne({tableNumber: req.params.id});
            return res.status(200).send(table);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete a table by its ID
    app.delete("/:id", isLogged, hasRole('Admin'), async (req, res) => {
        const table = await Tables.findById(req.params.id);
        if(table === null) return res.status(400).send({status: 400, error: true, errorMessage: "The table doesn't exist"});

        if(table.occupied)  return res.status(400).send({status: 400, error: true, errorMessage: "The table is still occupied, it cannot be deleted"});

        try{
            await table.deleteOne();
            getIoInstance().emit("table_modified")
            return res.status(200).send({status: 200, error: true, errorMessage: "The table was deleted successfully"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    return app;
}