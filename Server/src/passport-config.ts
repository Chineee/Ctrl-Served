import passport from "passport";
import User from "./models/User"
// import {Strategy} from "passport-local"
import {BasicStrategy} from "passport-http";


passport.use(new BasicStrategy(async (email, password, done) => {
    // console.log("ok?????");
    const currentUser = await User.findOne({email: email});
    // console.log(currentUser);
    done(null, currentUser);
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    const user = await User.findById(id);
    const desUser : Express.User = {id: user.id, name: user.name, surname: user.surname, email: user.email, role: user.role}
    done(null, desUser);
});

export default passport;