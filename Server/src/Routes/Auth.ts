import {Router} from "express";
import Joi from 'joi'
import User from "../models/User";
import bcrypt from "bcrypt";
import passport from "../passport-config"
import jwt from "jsonwebtoken";

//Define a schema for user input validation
export const UserSchemaValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Cashier', 'Waiter', 'Cook', 'Bartender').required()
});

//Middleware function to check if the user has a specific role
export const hasRole = (role: string) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (userRole !== role) return res.status(401).send("You don't have the permission to perform this action")

        next();
    }
}

//Middleware function to check if the user is already logged
export const alreadyLogged = (req, res, next) => {
    const token = req.header("auth-token")
    try{
        //Verify the token and return error if the token is valid
        jwt.verify(token, process.env.SECRET_TOKEN);
        return res.status(401).send("Already logged");
    }catch(err){
        next();
    }
}

//Middleware function to check if the user is logged in
export const isLogged = (req, res, next) => {
    const token = req.header("auth-token");
    try {
        //Verify the token and set the user data in the request object
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch(err) {
        return res.status(401).send("You must be logged");
    }
}

//Export the router
export default (): Router  => {

    const app = Router();

    //PUT endpoint to add a new user
    app.put('/user', isLogged, hasRole("Cashier"), async (req, res) => {
        console.log("USER === " + req.user);
        //validate the input data using the defined schema
        const {error} = UserSchemaValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        //Check if the email already exists in the database
        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) return res.status(400).send("This email is already linked to a user");

        //Hash the password using the function bcrypt
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //Create a new user instance
        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        })

        //Save the new user in the database
        try {
            await user.save();
            res.send("User correctly added to the database");
        } catch(err) {
            res.status(400).send(err);
        }
    });

    //GET endpoint to login a user
    app.get('/login', alreadyLogged, passport.authenticate('basic', {session:false}), async (req, res) => {
        //Create a tokne containing the user data
        var tokendata = {
            name: req.user.name,
            surname: req.user.surname,
            email: req.user.email,
            role: req.user.role
        };

        //Sign the JWT token with a secret key and set it to expire in 7 hours
        const token_signed = jwt.sign(tokendata, process.env.SECRET_TOKEN, { expiresIn: '7h' } );


        //TODO localStorage.setItem('jwtToken', token_signed); save the token in the client-side local storage --> VA FATTO NEL FRONT END

        //set the token as a response header
        return res.header('auth-token', token_signed).send(token_signed);

        // return res.status(200).json({ error: false, errormessage: "", token: token_signed });

    });

    return app;
}


//decoded = jwt.verify(token_signed, process.env.SECRET_TOKEN)
//decoded.exp < Date.now() / 1000