import mongoose from 'mongoose'

const UsersSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['Cashier', 'Waiter', 'Cook', 'Bartender'], required: true}
});

const Users = mongoose.model("Users", UsersSchema);
export default Users;