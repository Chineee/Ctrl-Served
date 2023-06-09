import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    readonly _id: mongoose.Schema.Types.ObjectId; // ID of the user as a string
    name: string; // First name of the user as a string
    surname: string; // Lat name of the user as a string
    email: string; // Email of the user as a string
    role: 'Cashier' | 'Waiter' | 'Cook'| 'Bartender' | 'Admin'; // Role of the user as a string, limited to specific options
    password: string; // Password of the user as a string
    counter: number,
    verifyPassword: (plainPassword: string) => Promise<boolean>; // Method to verify the user's password
};

// Create a new mongoose schema for users
const UsersSchema =  new mongoose.Schema(
    {
        name: {type: String, required: true},
        surname: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        counter: {type: Number},
        role: {type: String, enum: ['Cashier', 'Waiter', 'Cook', 'Bartender', 'Admin'], required: true }
    },
    {
        methods: { // Method to verify the user's password
            async verifyPassword(plainPassword: string) : Promise<boolean> {
                if (!this.password) return false;
                return await bcrypt.compare(plainPassword, this.password);
            }
        }
    },
);

// Middleware function to hash the password before saving it in the database
UsersSchema.pre('save', async function (next) {
    // Check if the password field has been modified
    if(!this.isModified('password')) return next()
    // If the password has been modified,hash the password using bcrypt
    try{
        const salt = await bcrypt.genSalt(10); // Generate a salt for the password hashing
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Create a new mongoose model based on the schema and export it
const Users : mongoose.Model<IUser> = mongoose.model<IUser>("Users", UsersSchema);
export default Users;


