import mongoose from 'mongoose';
import {IUser} from "./User";

export interface ITable {
    readonly _id : mongoose.Schema.Types.ObjectId
    waiterId: null | string | IUser
    tableNumber: number,
    occupied: boolean,
    seats: number,
    customers: number,
}

// Create a new mongoose schema for tables
const TablesSchema = new mongoose.Schema({
    // waiterId: {type: String, required: function() { this.waiterId !== null || typeof this.waiterId !== 'string'}, ref: 'Users'}, // It can either be an actual waiterId or null
    waiterId: {type: mongoose.Schema.Types.Mixed, ref:"Users"},
    tableNumber: {type: Number, required: true, unique:true},
    occupied: {type: Boolean, required: true},
    seats: {type: Number, required: true},
    customers: {type: Number, required: true, validate: {
        validator: function() { // The number of customers has to be equal or lower than the seats number
            console.log(this);
            return this.customers <= this.seats;
        }
    }}
});

// Create a new mongoose model based on the schema and export it
const Tables = mongoose.model<ITable>("Tables", TablesSchema);
export default Tables;