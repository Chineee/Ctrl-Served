import {Router} from "express";
import {hasRole, isLogged} from "../Auth";
import Joi from "joi";
import Tables from "../../models/Tables";
import Orders from "../../models/Orders";

export const TableSchemaValidation = Joi.object().keys({
    tableNumber: Joi.number().required(),
    seats: Joi.number().required(),
})

export default (): Router => {
    const app = Router();

    app.put('/', isLogged, hasRole('Admin'), async (req, res) =>{
        const {error} = TableSchemaValidation.validate(req.body);
        if (error) return res.status(400).send("Invalid input");

        const table = new Tables({
            waiterId: null,
            tableNumber: req.body.tableNumber,
            occupied: false,
            seats: req.body.seats,
            customers: 0,
        });

        try{
            await table.save();
        } catch (err) {
            return res.status(400).send(err)
        }

        return res.status(200).send("Table added successfully");
    });

    app.post("/:id", isLogged, hasRole('Waiter'), async (req, res) => {

        const table = await Tables.findOne({tableNumber: req.params.id});

        if (table == null) return res.status(400).send("Table doesn't exist");

        if (table.waiterId !== null && req.user._id.toString() !== table.waiterId) return res.status(400).send("You are unauthorized")

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

        try{
            await table.save();
        } catch (err) {
            console.log(err)
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send("Table info modified correctly");
    });

    app.get("/", isLogged, hasRole('Waiter'), async (req, res) => {
        let tables;
        try{
             tables = await Tables.find(req.query);
        } catch (err) {
            return res.status(400).send("Something went wrong");
        }

        return res.status(200).send(tables);
    });

    app.get("/:id", isLogged, hasRole('Waiter'), async (req, res) => {
            let table;
            try{
                 table = await Tables.findOne({tableNumber: req.params.id});
            } catch (err) {
                return res.status(400).send("Something went wrong");
            }

            return res.status(200).send(table);
        });

    app.delete("/:id", isLogged, hasRole('Admin'), async (req, res) => {
        const table = await Tables.findOne({tableNumber: req.params.id});

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