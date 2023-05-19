import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import auth from './Routes/Auth';
import passport from "./passport-config"
import session from "express-session";
import {IUser} from "./models/User"
import user from "./Routes/Users"
import order from "./Routes/Waiters/Orders"
import table from "./Routes/Waiters/Tables"
import menu from "./Routes/Menu"
import foodQueue from "./Routes/FoodQueue"
import drinkQueue from "./Routes/DrinkQueue"

//Load environment variables from .env file
dotenv.config({path:__dirname+"/../.env"})

//Create express app
const app = express()

//Assign PORT to an environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false); //Disabling strict query mode in Mongoose
mongoose.connect(process.env.MONGO_URL);    //Connecting to the MongoDB database

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
app.use('/api/user', user());
//Mounting order routes for waiters
app.use('/api/order', order());
//Mounting table routes for waiters
app.use('/api/table', table());
//Mounting menu routes
app.use('/api/menu', menu());
//Mounting food queue routes for cooks
app.use('/api/foodQueue', foodQueue());
//Mounting drink queue routes for bartenders
app.use('/api/drinkQueue', drinkQueue());

//Starting the server and listening on the specific port
app.listen(PORT, () => {
    console.log("Server listening in http://localhost:"+PORT);
})