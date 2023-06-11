import passport from "passport";
import User from "./models/User"
import {BasicStrategy} from "passport-http";
import client from "./redis-config";

//Define a new BasicStrategy from passport-http module
passport.use(new BasicStrategy(async (email, password, done) => {
    //Find the user with the given email
    const currentUser = await User.findOne({email: email});
    //If no user is found or the user's password is incorrect, return an error
    if(!currentUser || !await currentUser.verifyPassword(password)){
        done({message:'Email or password incorrect}'}, false);
    }
    else {
        await client.set(currentUser.email, "true")
        done(null, currentUser);
    }
}));

//Serialize the user object into the session
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

//Deserialize the user object from the session
passport.deserializeUser(async function(id, done) {
    try{
        //find the user with the give id
        const user = await User.findById(id);
        //Create a new object with a subset of the user's data
        done(null, user);
    } catch (err){
        done(err);
    }
});

//Export the passport module
export default passport;