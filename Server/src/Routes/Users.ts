import {Router} from "express";
import User from "../models/User";
import {isLogged, hasRole} from "./Auth";
import {Types} from "mongoose";

//Export the router
export default (): Router => {
    const app = Router();

    //GET endpoint to retrieve a user by id or email
    app.get('/user/:id', isLogged, hasRole('Cashier'), async (req, res) => {
        //Get the user ID or email from the request parameters
        const id = req.params.id;
        //Regular expression to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let user;

        //Check if the ID is a valid MongoDB object ID and if it is find the user by ID
        if (Types.ObjectId.isValid(id)) {
            user = await User.findById(req.params.id)
        }
        //Check if the ID is a valid email and if it is find the user by the email
        else if (emailRegex.test(id)) {
            user = await User.findOne({email: id});
        } else {
            return res.status(400).send("Invalid user id or email");
        }

        //Return the user object in the response
        return res.status(200).send(user);
    })

    //GET endpoint to retrieve all users
    app.get('/user', isLogged, hasRole("Cashier"), async (req, res) => {
        try{
            //retrieve alla users from the database excluding their passwords from the response
            const users = await User.find({},'-password');
            res.send(users);
        }catch(err){
            res.status(500).send("Internal server error. Something went wrong.")
        }
    })

    return app;

}