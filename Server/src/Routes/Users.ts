import {Router} from "express";
import User from "../models/User";
import {isLogged, hasRole} from "./Auth";
import {Types} from "mongoose";
import waiters from "./Waiters/Waiter"
import client from "../redis-config";
import getIoInstance from "../socketio-config";

// Function to retrieve a user by its ID or email
export async function getUser(id) {
    // Regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the id is a valid MongoDB object ID and if it is, find the user by ID
    if (Types.ObjectId.isValid(id)) return User.findById(id, "-password");

    // Check if the id is a valid email and if it is, find the user using the email
    else if (emailRegex.test(id)) return User.findOne({email: id}, "-password");

    return null;
}

// Export the router
export default (): Router => {
    const app = Router();

        // GET endpoint to retrieve a user by ID or email
    app.get('/:id', isLogged, hasRole('Cashier'), async (req, res) => {
        try {
            const user = await getUser(req.params.id);
            return res.status(200).send(user);
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to retrieve users based on the query parameters passed
    //todo is better to do /api/users/role or /api/users?role=...??
    app.get('/', isLogged, hasRole('Cashier'), async (req, res) => {
        try{
            // Retrieve users from the database excluding their passwords
            const users = await User.find(req.query, '-password');
            return res.status(200).send(users);
        }catch(err){
            return res.status(500).send(err)
        }
    });

    // PUT endpoint to modify user data
    app.put('/:id', isLogged, async (req, res) => {
        const user = await getUser(req.params.id);
        if (user === null) return res.status(400).send({status: 400, error: true, errorMessage: "This user doesn't exist"});
        else if (user.email !== req.user.email && req.user.role !== 'Admin') return res.status(400).send({status: 400, error: true, errorMessage: "You don't have the necessary permissions to do this action"});
        
        let oldEmail = user.email;
        // Update the user data if provided in the request body
        if (req.body.new_name !== undefined) user.name = req.body.new_name;
        if (req.body.new_surname !== undefined) user.surname = req.body.new_surname;
        if (req.body.new_password !== undefined) user.password = req.body.new_password;
        if (req.body.new_role !== undefined && req.user.role === 'Admin') {
            if (req.body.new_role !== user.role) {
                if (req.body.new_role === 'Waiter') user.counter = {};
                else user.counter = 0;
            }
            user.role = req.body.new_role;
        }
        if (req.body.new_email !== undefined) user.email = req.body.new_email;

        // Save the changes to the user in the database
        try{
            await user.save();
            if (req.body.new_email !== undefined && req.body.new_email !== oldEmail) await client.set(oldEmail, "false");
            getIoInstance().emit("user_modified")
            return res.status(200).send({status: 200, error: false, message: "The user was modified correctly"});
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete a user by ID
    app.delete('/:id', isLogged, hasRole('Admin'), async (req, res) => {
        const user = await getUser(req.params.id);
        if(user === null) return res.status(400).send({status: 400, error: true, errorMessage: "This user doesn't exist"});

        try{
            await user.deleteOne();
            await client.set(user.email, "false");
            return res.status(200).send({status: 200, error: false, messsage: "User deleted successfully"});
        } catch (err) {
            return res.status(400).send(err)
        }
    });

    app.use('/waiters', waiters());

    return app;
}