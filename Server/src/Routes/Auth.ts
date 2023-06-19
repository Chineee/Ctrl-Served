import {Router} from "express";
import Joi from 'joi'
import User, {IUser} from "../models/User";
import passport from "../passport-config"
import jwt from "jsonwebtoken";
import client from "../redis-config"
import Users from "../models/User";
import Tables from "../models/Tables"
import getIoInstance from "../socketio-config";

// Define a schema for user input validation using Joi
export const UserSchemaValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Cashier', 'Waiter', 'Cook', 'Bartender', 'Admin').required()
});

// Middleware function to check if the user's role is in a specific set of roles, if the user has role Admin it will always return true
export const hasRole = (...role: string[]) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!role.includes(userRole) && userRole !== 'Admin') return res.status(403).send({status: 403, error: true, errorMessage: "You don't have the necessary permissions to perform this action"})

        next();
    }
}

// Middleware function to check if the user is already logged in
export const alreadyLogged = (req, res, next) => {
    const token = req.header("auth-token")
    try{
        // Verify the token and return error if the token is valid
        jwt.verify(token, process.env.SECRET_TOKEN);
        return res.status(401).send({status: 401, error: true, errorMessage: "Already logged"});
    }catch(err){
        next();
    }
}

// Middleware function to check if the user is logged in
export const isLogged = async (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];

    try {
        // Verify the token and set the user data in the request object
        const decoded : IUser = jwt.verify(token, process.env.SECRET_TOKEN) as IUser;
        //I check in redis cache if user exists
        const userExists : string = await client.get(decoded.email);

        if (userExists === null) {
            // If the value cannot be found the cache is empty, so a query must be performed (this might happen only once)
            // If the users exists the redis cache is set to true, otherwise it is set to false
            const user = await User.findOne({email: decoded.email})
            // if (user) await client.set(decoded.email, "true");
            // else await client.set(decoded.email, "false");
            await client.set(decoded.email, user ? "true" : "false");
        }
        // If a key is found in the redis cache its value is visible, if that value is true the corresponding user wasn't deleted, otherwise it 
        //was (if one of the admins deletes a user, the value in the redis cache will be set to false)
        //Since redis returns a string the value cannot be treated as a boolean
        else if (userExists === 'false') {
            return res.status(401).send({errorMessage: "User doesn't exist anymore", error:true, status:401});
        }

        // Be aware that inside the JWT Token the user password isn't stored
        // this may not be used, we could directly set req.user = decoded since decoded is "as" IUser
        req.user = new User(decoded);
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).send({status:401, error: true, errorMessage:"You must be logged"});
    }
}

// Export the router
export default (): Router  => {
    const app = Router();

    //test route, inside it we do stuff to test other stuff
    app.get('/testone', isLogged, async (req, res) => {
        // const a = await req.user.verifyPassword("ciao");
        // await Users.findOneAndUpdate({_id:"648045fd07c136c4d861d4db"}, {$inc:{"counter.tablesServed": 1}})
        const b = await Tables.findOneAndUpdate({tableNumber: 5}, {tableNumber:22})
        console.log(b);
        return res.status(200).send("SIUM")
    })

    // POST endpoint to add a new user
    app.post('/users', isLogged, hasRole('Admin'), async (req, res) => {

        // Validate the input data using the defined schema
        const {error} = UserSchemaValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // Check if the email already exists in the database
        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) return res.status(400).send("This email is already linked to a user");

        // Create a new user instance
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            counter: req.body.role === 'Waiter' ? {tablesServed: 0, customersServed: 0, dishesServed: 0} : 0
        });

        // Save the new user in the database
        try {
            await user.save();
            await client.set(req.body.email, "true");
            getIoInstance().emit("new_user");
            return res.status(200).send({status: 200, error: false, message: "User correctly added to the database"});
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to login a user
    app.get('/login', alreadyLogged, passport.authenticate('basic', {session:false}), async (req, res) => {
        console.log("OK")
        //Create a token containing the user data
        const tokenData = {
            _id: req.user._id,
            name: req.user.name,
            surname: req.user.surname,
            email: req.user.email,
            role: req.user.role,
            counter: req.user.counter,
            refreshToken: false
        };

        const refreshTokenData = structuredClone(tokenData);
        refreshTokenData.refreshToken = false;

        //todo sposta expires in da 8h a 10min e chiedi al prof se va bene farlo così per controllare se è un refresh token
        // Sign the JWT token with a secret key and set it to expire in 8 hours
        const accessToken = jwt.sign(tokenData, process.env.SECRET_TOKEN, { expiresIn: '8h' } );

        return res.status(200).send({access_token: accessToken});
    });

    return app;
}
