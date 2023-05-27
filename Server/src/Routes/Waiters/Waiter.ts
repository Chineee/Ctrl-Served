import {Router} from 'express';
import {hasRole, isLogged} from "../Auth";
import Tables from "../../models/Tables";
import {IUser} from "../../models/User";
import Orders from "../../models/Orders";

export default () : Router => {
    const app = Router();

    //return all the table associated for every waiter
    // app.get('/tables', isLogged, hasRole("Cashier"), async (req, res) => {
    //     const tables = await Tables.find({occupied: true}).populate("waiterId", "-password -__v");
    //     return res.status(200).send(tables);
    // })

    //restituisce tutti i tavoli che sta gestendno un singolo cameriere ora

    app.get('/:id/orders', isLogged, hasRole("Waiter"), async (req, res) => {
        const orders = await Orders.find({waiterId: req.params.id}).populate("dish");
        return res.status(200).send(orders);
    })

    app.get('/:id/tables', isLogged, hasRole("Cashier"), async (req, res)=>{
        const tables = await Tables.find({waiterId: req.params.id});
        return res.status(200).send(tables)
    })

    return app;
}