import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import auth from './Routes/Auth';
import passport from "./passport-config"
import User from "./models/User"
import session from "express-session";
import {IUser} from "./models/User"
import user from "./Routes/Users"
import order from "./Routes/Waiters/Orders"

//Load environment variables from .env file
dotenv.config({path:__dirname+"/../.env"})

//Create express app
const app = express()
//Assign PORT to an environment variable or 5000
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

//Defining global interface for Express User
declare global {
    namespace Express {
        export interface User extends IUser{}
    }
}

//Parse the request body as JSON
app.use(express.json());
//Configuring express session by setting the secret for the session, preventing the saving of uninitialized and unchanged sessions
app.use(session({
    secret:'chiave',
    saveUninitialized: false,
    resave: false,
}));

//Initialize passport and enabling passport session
app.use(passport.initialize());
app.use(passport.session());

//Mounting authentication routes
app.use('/api', auth());
//Mounting user routes
app.use('/api', user());
app.use('/api/order', order());

//Starting the server
app.listen(PORT, () => {
    console.log("Server listening in http://localhost:"+PORT);
})