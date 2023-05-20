import mongoose from 'mongoose';

// Create a new mongoose schema for orders
const OrdersSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    waiterId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"Users"}, // It is the ObjectId of the waiter who created it
    dish: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"Menu"}, // It is the ObjectId of the dish that has been ordered
    price: {type: Number, required: true, min: 0},
    type: {type: String, enum: ['Foods', 'Drinks'], required: true},
    orderNumber: {type: Number, required: true},
    ready: {type: Boolean, required: true}
});

// Create a new mongoose model based on the schema and export it
const Orders = mongoose.model("Orders", OrdersSchema);
export default Orders;