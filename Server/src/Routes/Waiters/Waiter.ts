import {Router} from 'express';
import {hasRole, isLogged} from "../Auth";
import Tables from "../../models/Tables";
import Orders from "../../models/Orders";

export default () : Router => {
    const app = Router();

    // GET endpoint to retrieve all orders associated with a specific waiter
    app.get('/:id/orders', isLogged, hasRole("Waiter", "Cashier"), async (req, res) => {
        const orders = await Orders.find({waiterId: req.params.id}).populate("dish");
        return res.status(200).send(orders);
    })

    // GET endpoint to retrieve all tables associated with a specific waiter
    app.get('/:id/tables', isLogged, hasRole("Waiter", "Cashier"), async (req, res)=>{
        const tables = await Tables.find({waiterId: req.params.id});
        return res.status(200).send(tables)
    })

    return app;
}