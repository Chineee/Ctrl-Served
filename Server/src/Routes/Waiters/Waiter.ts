import {Router} from 'express';
import {hasRole, isLogged} from "../Auth";
import Tables from "../../models/Tables";
import {IUser} from "../../models/User";

export default () : Router => {
    const app = Router();

    //return all the table associated for every waiter
    // app.get('/tables', isLogged, hasRole("Cashier"), async (req, res) => {
    //     const tables = await Tables.find({occupied: true}).populate("waiterId", "-password -__v");
    //     return res.status(200).send(tables);
    // })

    //restituisce tutti i tavoli che sta gestendno un singolo cameriere ora

    app.get('/:id/tables', isLogged, hasRole("Cashier"), async (req, res)=>{
        const tables = await Tables.find({waiterId: req.params.id});
        return res.status(200).send(tables)
    })

    return app;
}