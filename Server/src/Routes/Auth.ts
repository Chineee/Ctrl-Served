import {Router} from "express";
import Joi from 'joi'
import User from "../models/User";
import bcrypt from "bcrypt"
import passport from 'passport'

export const UserSchemaValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    surname: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('Cashier', 'Waiter', 'Cook', 'Bartender').required()
});


export default (): Router  => {


    const app = Router();

    app.put('/user', async (req, res) => {
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

    app.get('/login', passport.authenticate('basic', {session:false}), async (req, res) => {
        var tokendata = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            role: req.body.role
        };

        console.log("Login granted. Generating token" );
        // var token_signed = jwt.sign(tokendata, process.env.SECRET_TOKEN, { expiresIn: '1h' } );

        // Note: You can manually check the JWT content at https://jwt.io

        return res.status(200).json({ error: false, errormessage: "", token: 1 });

    });

    return app;
}