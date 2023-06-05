import {Router} from "express";
import Joi from 'joi'
import User, {IUser} from "../models/User";
import passport from "../passport-config"
import jwt from "jsonwebtoken";
import Users from "../models/User";
import client from "../redis-config"
import {type} from "os";

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
        //todo invece di usare la redis cache, possibile soluzione è quella di usare un refresh token, ogni 10min access token lo aggiorna e controlla se esiste

        // Verify the token and set the user data in the request object
        const decoded : IUser = jwt.verify(token, process.env.SECRET_TOKEN) as IUser;
        //I check in redis cache if user exists
        const userExists : string = await client.get(decoded.email);

        if (userExists === null) {
            //if i cant find value cache is empty, so I must do a query (this might happens only once)
            //if user exists I set redis cache to true, else false
            const user = await User.findOne({email: decoded.email})
            // if (user) await client.set(decoded.email, "true");
            // else await client.set(decoded.email, "false");
            await client.set(decoded.email, user ? "true" : "false");
        }
        //if i found key in redis cache, I see his value, if true user wasn't deleted, else it was (if admin delete user, cache will be set to false)
        //unfortunately, redis returns string, so we cant treat it as a boolean
        else if (userExists === 'false') {
            return res.status(401).send({message: "User doesn't exist anymore", error:true, status:401});
        }

        //be aware that inside JWT Token, password isn't stored
        //we create a new user so we can use function
        //this may not be used, we could directly set req.user = decoded since decoded is "as" IUser
        req.user = new User(decoded);
        next();
    } catch(err) {
        console.log(err);
        return res.status(401).send({status:401, error: true, message:"You must be logged"});
    }
}

// Export the router
export default (): Router  => {
    const app = Router();

    //test route, inside it we do stuff to test other stuff
    app.get('/testone', isLogged, async (req, res) => {
        // const a = await req.user.verifyPassword("ciao");
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
            counter: 0
        });

        // Save the new user in the database
        try {
            await user.save();
            await client.set(req.body.email, "true");
            return res.status(200).send({status: 200, error: false, message: "User correctly added to the database"});
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    app.get('/token', async (req, res) => {
        const token = req.header("refresh-token");
        let accessToken;
        try {
            jwt.verify(token, process.env.SECRET_REFRESH_TOKEN);
            return res.status(200).send(accessToken);
        } catch(err) {
            return res.status(400).send(err);
        }
    });

    // GET endpoint to login a user
    app.get('/login', alreadyLogged, passport.authenticate('basic', {session:false}), async (req, res) => {
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
        const refreshToken = jwt.sign(refreshTokenData, process.env.SECRET_REFRESH_TOKEN, {expiresIn: '7h'})


        //TODO localStorage.setItem('jwtToken', token_signed); save the token in the client-side local storage --> VA FATTO NEL FRONT END

        // Set the token as a response header

        return res.status(200).send({access_token: accessToken, refresh_token: refreshToken});

        // return res.status(200).json({ error: false, errormessage: "", token: token_signed });
    });



    return app;
}


//decoded = jwt.verify(token_signed, process.env.SECRET_TOKEN)
//decoded.exp < Date.now() / 1000