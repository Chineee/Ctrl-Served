import passport from "passport";
import User from "./models/User"
import {BasicStrategy} from "passport-http";
import bcrypt from "bcrypt";

//Function to verify the correctness of the password
export const verifyPassword = async (plainPassword, hashedPassword) =>{
    return await bcrypt.compare(plainPassword, hashedPassword);
}

//Define a new BasicStrategy from passport-http module
passport.use(new BasicStrategy(async (email, password, done) => {
    //Find the user with the given email
    const currentUser = await User.findOne({email: email});

    //If no user is found or the user's password is incorrect return an error
    if(!currentUser || !verifyPassword(password, currentUser.password)){
        return done(null, false, {message: "Incorrect email or password"})
    }

    done(null, currentUser);
}));

//Serialize the user object into the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//Deserialize the user object from the session
passport.deserializeUser(async function(id, done) {
    //find the user with the give id
    const user = await User.findById(id);
    //Create a new object with a subset of the user's data
    const desUser : Express.User = {id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role}
    done(null, desUser);
});

//Export the passport module
export default passport;