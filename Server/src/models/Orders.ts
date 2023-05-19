import mongoose from 'mongoose'

// export interface IOrder{
//     readonly _id: mongoose.Schema.Types.ObjectId,
//     tableNumber: number,
//     waiterId: IUser,
//     dish: IMenu,
//     price:
// }
//Create a new mongoose schema for orders, defining the fields tableNumber, price and ready_count as required number fields, dish_array as a required array and waiter as a required objectId
const OrdersSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    waiterId: {type: mongoose.Schema.Types.ObjectId, required: true, ref:"Users"},
    dish: {type: mongoose.Schema.Types.ObjectId, required: true},
    price: {type: Number, required: true, min: 0},
    ready: {type: Boolean, required: true},
    type: {type: String, enum: ['Foods', 'Drinks'], required: true},
    orderNumber: {type: Number, required: true}
});

//Create a new mongoose model based on the schema and export it
const Orders = mongoose.model("Orders", OrdersSchema);
export default Orders;