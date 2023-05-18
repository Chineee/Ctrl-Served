import mongoose from 'mongoose'
import bcrypt from "bcrypt"

export interface IUser {
    //This property holds the ID of the user as a string
    readonly _id: mongoose.Schema.Types.ObjectId;
    //This property holds the first name of the user as a string
    name: string;
    //This property holds the last name of the user as a string
    surname: string;
    //This property holds the email of the user as a string
    email: string;
    //This property holds the role of the user as a string, which is limited to one of the four options presented
    role: 'Cashier' | 'Waiter' | 'Cook'| 'Bartender' | 'Admin';
    //This property holds the password of the user password as a string
    password: string;
    verifyPassword: (plainPassword: string) => Promise<boolean>;
}

//Create a new mongoose schema for users, defining the fields name, surname, email, password and role as required strings and allowing role to be one of the specified values
const UsersSchema =  new mongoose.Schema(
    {
        name: {type: String, required: true},
        surname: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        role: {type: String, enum: ['Cashier', 'Waiter', 'Cook', 'Bartender', 'Admin'], required: true }
    },
    {
        methods: {
            async verifyPassword(plainPassword: string) : Promise<boolean> {
                return await bcrypt.compare(plainPassword, this.password);
            }
        }
    },
);
UsersSchema.pre('save', async function (next) {
    //Check if the password field has been modified
    if(!this.isModified('password')) return next()
    //If the password has been modified,hash the password using bcrypt
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
});

//Create a new mongoose model based on the schema and export it
const Users : mongoose.Model<IUser> = mongoose.model<IUser>("Users", UsersSchema);
export default Users;


