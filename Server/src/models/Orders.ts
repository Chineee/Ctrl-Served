import mongoose from 'mongoose'

//Create a new mongoose schema for orders, defining the fields tableNumber, price and ready_count as required number fields, dish_array as a required array and waiter as a required objectId
const OrdersSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    waiterId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"users"},
    dish: {type: mongoose.Schema.Types.ObjectId, required: true},
    price: {type: Number, required: true, min: 0},
    ready: {type: Boolean, required: true},
    type: {type: String, enum: ['Foods', 'Drinks'], required: true},
    orderNumber: {type: Number, required: true}
});

//Create a new mongoose model based on the schema and export it
const Orders = mongoose.model("Orders", OrdersSchema);
export default Orders;