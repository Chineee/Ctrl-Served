import mongoose from 'mongoose'

//Create a new mongoose schema for orders, defining the fields tableNumber, price and ready_count as required number fields, dish_array as a required array and wiater as a required objectId
const OrdersSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    waiter: {type: mongoose.SchemaTypes.ObjectId, required: true },
    dish_array: {type: Array, required: true},
    price:{type: Number, required: true, min: 0},
    ready_count:{type: Number, required: true, min: 0}
});

//Create a new mongoose model based on the schema and export it
const Orders = mongoose.model("Orders", OrdersSchema);
export default Orders;