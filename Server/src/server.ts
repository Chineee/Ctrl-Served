import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import auth from './Routes/Auth';
import passport from "./passport-config"
import User from "./models/User"
import session from "express-session";
import {User as IUser} from "./models/Interface/IUser"
import user from "./Routes/Users"


dotenv.config({path:__dirname+"/../.env"})

const app = express()
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

declare global {
    namespace Express {
        export interface User extends IUser{}
    }
}

app.use(express.json());
app.use(session({
    secret:'chiave',
    saveUninitialized: false,
    resave: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/api', auth());
app.use('/api', user());
app.listen(PORT, () => {
    console.log("Server listening in http://localhost:"+PORT);
})