import {Router} from "express";
import User from "../models/User";
import {isLogged, hasRole} from "./Auth";
import mongoose, {Types} from "mongoose";

export async function getUser(id) {

    //Regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //Check if the ID is a valid MongoDB object ID and if it is find the user by ID
    if (Types.ObjectId.isValid(id)) return User.findById(id);

    //Check if the ID is a valid email and if it is find the user by the email
    else if (emailRegex.test(id)) return User.findOne({email: id});

    return null;
}

//Export the router
export default (): Router => {
    const app = Router();

    //GET endpoint to retrieve a user by id or email
    app.get('/:id', isLogged, hasRole('Admin'), async (req, res) => {
        let user = await getUser(req.params.id);
        if (user === null) res.status(400).send("Invalid user id or email");

        //Return the user object in the response
        return res.status(200).send(user);
    });

    //GET endpoint to retrieve all users
    app.get('/', isLogged, hasRole('Admin'), async (req, res) => {
        try{
            //retrieve alla users from the database excluding their passwords from the response
            const users = await User.find(req.query, '-password');
            return res.send(users);
        }catch(err){
            return res.status(500).send("Internal server error. Something went wrong.")
        }
    });

    app.post('/:id', isLogged, async (req, res) => {
        const user = await getUser(req.params.id);

        if (user === null) return res.status(400).send("User doesn't exist");
        else if (user.email !== req.user.email && req.user.role !== 'Admin') return res.status(400).send("You do not have permission");

        if (req.body.new_name !== undefined) user.name = req.body.new_name;
        if (req.body.new_surname !== undefined) user.surname = req.body.new_surname;
        if (req.body.new_password !== undefined) user.password = req.body.new_password;
        if (req.body.new_role !== undefined && req.user.role === 'Admin') user.role = req.body.new_role;
        if (req.body.new_email !== undefined) user.email = req.body.new_email;

        await user.save();

        return res.status(200).send("User modified correctly");
    });

    app.delete('/:id', isLogged, hasRole('Admin'), async (req, res) => {
        const user = await getUser(req.params.id);

        if(user === null) return res.status(400).send("User doesn't exist");
        try{
            await user.deleteOne();
        } catch (err) {
            return res.status(400).send("Somethign went wrong")
        }
        return res.status(200).send("User deleted successfully");
    });

    return app;

}