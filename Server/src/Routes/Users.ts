import {Router} from "express";
import User from "../models/User";
import {isLogged, hasRole} from "./Auth";
import {Types} from "mongoose";
import waiters from "./Waiters/Waiter"

// Function to retrieve a user by ID or email
export async function getUser(id) {
    // Regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the ID is a valid MongoDB object ID and if it is, find the user by ID
    if (Types.ObjectId.isValid(id)) return User.findById(id, "-password");

    // Check if the ID is a valid email and if it is, find the user by the email
    else if (emailRegex.test(id)) return User.findOne({email: id}, "-password");

    return null;
}

// Export the router
export default (): Router => {
    const app = Router();

    //TODO /users/waiter/(:id)/tables ---> tutti i tavoli gestiti da un cameriere in questo momento
    //TODO /users/waiter/orders --> tutti gli ordini che stanno gestendo ora (maybe filtrarli per ready=false?)
    //TODO /users/cook/foods ---> tutti i piatti fatti da un cuoco ora/che ha iniziato a fare
    //todo /users/bartenders/drinks --> tuttti i drinks fatti dal bartender ora/che ha iniziato a fare
    //TODO IDEA PER GLI ORDINI: QUANDO FINISCONO INVECE DI ELIMINARLI SETTARE ORDER NUMBER A -1


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

    // PUT endpoint to modify user's data
    app.put('/:id', isLogged, async (req, res) => {
        const user = await getUser(req.params.id);
        if (user === null) return res.status(400).send("User doesn't exist");
        else if (user.email !== req.user.email && req.user.role !== 'Admin') return res.status(400).send("You do not have permission");

        // Update the user's data if provided in the request body
        if (req.body.new_name !== undefined) user.name = req.body.new_name;
        if (req.body.new_surname !== undefined) user.surname = req.body.new_surname;
        if (req.body.new_password !== undefined) user.password = req.body.new_password;
        if (req.body.new_role !== undefined && req.user.role === 'Admin') user.role = req.body.new_role;
        if (req.body.new_email !== undefined) user.email = req.body.new_email;

        // Save the changes to the user in the database
        try{
            await user.save();
            return res.status(200).send("User modified correctly");
        } catch (err) {
            return res.status(400).send(err);
        }
    });

    // DELETE endpoint to delete a user by ID
    app.delete('/:id', isLogged, hasRole('Admin'), async (req, res) => {
        const user = await getUser(req.params.id);
        if(user === null) return res.status(400).send("User doesn't exist");

        try{
            await user.deleteOne();
            return res.status(200).send("User deleted successfully");
        } catch (err) {
            return res.status(400).send(err)
        }
    });

    app.use('/waiters', waiters());

    return app;
}