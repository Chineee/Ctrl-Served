import mongoose from 'mongoose'

const OrdersSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    waiter: {type: mongoose.SchemaTypes.ObjectId, required: true },
    dish_array: {type: Array, required: true},
    price:{type: Number, required: true, min: 0},
    ready_count:{type: Number, required: true, min: 0}
});

const Orders = mongoose.model("Orders", OrdersSchema);
export default Orders;