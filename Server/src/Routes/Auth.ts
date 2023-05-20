import {Router} from "express";
import Joi from 'joi'
import User from "../models/User";
import passport from "../passport-config"
import jwt from "jsonwebtoken";
import Users from "../models/User";

// Define a schema for user input validation using Joi
export const UserSchemaValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Cashier', 'Waiter', 'Cook', 'Bartender', 'Admin').required()
});

// Middleware function to check if the user has a specific role
export const hasRole = (...role: string[]) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!role.includes(userRole) && userRole !== 'Admin') return res.status(401).send("You don't have the permission to perform this action")

        next();
    }
}

// Middleware function to check if the user is already logged in
export const alreadyLogged = (req, res, next) => {
    const token = req.header("auth-token")
    try{
        // Verify the token and return error if the token is valid
        jwt.verify(token, process.env.SECRET_TOKEN);
        return res.status(401).send("Already logged");
    }catch(err){
        next();
    }
}

// Middleware function to check if the user is logged in
export const isLogged = async (req, res, next) => {
    const token = req.header("auth-token");
    try {
        type JWTUser = {
            email: string;
        }

        // Verify the token and set the user data in the request object
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN) as JWTUser;
        const user = await User.findOne({email: decoded.email})
        if (!user) return res.status(401).send("User doesn't exist anymore");
        req.user = user;
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).send("You must be logged");
    }
}

// Export the router
export default (): Router  => {
    const app = Router();

    // PUT endpoint to add a new user
    app.put('/user', isLogged, hasRole('Admin'), async (req, res) => {

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
        });

        // Save the new user in the database
        try {
            await user.save();
            res.send("User correctly added to the database");
        } catch(err) {
            res.status(400).send(err);
        }
    });

    // GET endpoint to login a user
    app.get('/login', alreadyLogged, passport.authenticate('basic', {session:false}), async (req, res) => {
        console.log("entro")
        //Create a token containing the user data
        var tokendata = {
            name: req.user.name,
            surname: req.user.surname,
            email: req.user.email,
            role: req.user.role
        };

        // Sign the JWT token with a secret key and set it to expire in 8 hours
        const token_signed = jwt.sign(tokendata, process.env.SECRET_TOKEN, { expiresIn: '8h' } );


        //TODO localStorage.setItem('jwtToken', token_signed); save the token in the client-side local storage --> VA FATTO NEL FRONT END

        // Set the token as a response header
        return res.header('auth-token', token_signed).send(token_signed);

        // return res.status(200).json({ error: false, errormessage: "", token: token_signed });
    });

    return app;
}


//decoded = jwt.verify(token_signed, process.env.SECRET_TOKEN)
//decoded.exp < Date.now() / 1000