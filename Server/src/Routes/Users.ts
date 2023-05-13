import {Router} from "express";
import User from "../models/User";
import {isLogged, hasRole} from "./Auth";
import {Types} from "mongoose";


export default (): Router => {
    const app = Router();

    app.get('/user/:id', isLogged, hasRole('Cashier'), async (req, res) => {
        const id = req.params.id;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;
        if (Types.ObjectId.isValid(id)) {
            user = await User.findById(req.params.id)
        } else if (emailRegex.test(id)) {
            user = await User.findOne({email: id});
        } else {
            return res.status(400).send("Invalid user id or email");
        }
        return res.status(200).send(user);
    })


    app.get('/user', isLogged, hasRole("Cashier"), async (req, res) => {
        try{
            const users = await User.find({},'-password');
            res.send(users);
        }catch(err){
            res.status(500).send("Internal server error. Something went wrong.")
        }
    })

    return app;

}