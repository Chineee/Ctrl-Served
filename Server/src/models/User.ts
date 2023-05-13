import mongoose from 'mongoose'

//Create a new mongoose schema for users, defining the fields name, surname, email, password and role as required strings and allowing role to be one of the specified values
const UsersSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['Cashier', 'Waiter', 'Cook', 'Bartender'], required: true}
});

//Create a new mongoose model based on the schema and export it
const Users = mongoose.model("Users", UsersSchema);
export default Users;