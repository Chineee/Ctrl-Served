import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import auth from './Routes/Auth';
import passport from "passport";
import passportHTTP from 'passport-http'
import User from "./models/User"

dotenv.config({path:__dirname+"/../.env"})

const app = express()
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL);

passport.use( new passportHTTP.BasicStrategy(
    function(email, password, done) {

        console.log("New login attempt from " + email );
        // User.findOne( {email: email} , (err, user)=>{
        //     if( err ) {
        //         return done( {statusCode: 500, error: true, errormessage:err} );
        //     }
        //
        //     if( !user ) {
        //         return done(null,false,{statusCode: 401, error: true, errormessage:"Invalid user"});
        //     }
        //
        //     if( user.validatePassword( password ) ) {
        //         return done(null, user);
        //     }
        //
        //     return done(null,false,{statusCode: 401, error: true, errormessage:"Invalid password"});
        // })
    }
));

app.use(express.json());
app.use('/api', auth());
app.listen(PORT, () => {
    console.log("Server listening in http://localhost:"+PORT);
})