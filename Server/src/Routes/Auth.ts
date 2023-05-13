import {Router} from "express";
import Joi from 'joi'
import User from "../models/User";
import bcrypt from "bcrypt";
import passport from "../passport-config"
import jwt from "jsonwebtoken";

export const UserSchemaValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Cashier', 'Waiter', 'Cook', 'Bartender').required()
});

export const hasRole = (role: string) => {

    return (req, res, next) => {
        const userRole = req.user?.role;
        if (userRole !== role) return res.status(401).send("You don't have the permission to perform this action")

        next();
    }
}


export const alreadyLogged = (req, res, next) => {
    const token = req.header("auth-token")
    try{
        jwt.verify(token, process.env.SECRET_TOKEN);
        return res.status(401).send("Already logged");
    }catch(err){
        next();
    }
}

export const isLogged = (req, res, next) => {
    const token = req.header("auth-token");
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    } catch(err) {
        return res.status(401).send("You must be logged");
    }
}

export default (): Router  => {

    const app = Router();

    app.put('/user', isLogged, hasRole("Cashier"), async (req, res) => {
        console.log("USER === " + req.user);
        const {error} = UserSchemaValidation.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const emailExists = await User.findOne({email: req.body.email});
        if (emailExists) return res.status(400).send("This email is already linked to a user");

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        })

        try {
            await user.save();
            res.send("User correctly added to the database");
        } catch(err) {
            res.status(400).send(err);
        }
    });

    app.get('/login', alreadyLogged, passport.authenticate('basic', {session:false}), async (req, res) => {
        var tokendata = {
            name: req.user.name,
            surname: req.user.surname,
            email: req.user.email,
            role: req.user.role
        };

        const token_signed = jwt.sign(tokendata, process.env.SECRET_TOKEN, { expiresIn: '7h' } );


        //TODO localStorage.setItem('jwtToken', token_signed); save the token in the client-side local storage --> VA FATTO NEL FRONT END

        return res.header('auth-token', token_signed).send(token_signed);

        // return res.status(200).json({ error: false, errormessage: "", token: token_signed });

    });

    return app;
}


//decoded = jwt.verify(token_signed, process.env.SECRET_TOKEN)
//decoded.exp < Date.now() / 1000