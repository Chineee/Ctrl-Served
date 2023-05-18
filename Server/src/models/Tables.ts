import mongoose from 'mongoose'

//Create a new mongoose schema for tables, defining the fields tableNumber, seats and costumers as required numbers, with costumers <= seats and occupied as required boolean
const TablesSchema = new mongoose.Schema({
    waiterId: {type: String, required: true, ref: 'users'},
    tableNumber: {type: Number, required: true, unique:true},
    occupied: {type: Boolean, required: true},
    seats: {type: Number, required: true},
    customers: {type: Number, required: true, validate: {
        validator: function(v) {
            return v.customers <= v.seats;
        }
    }}
})

//Create a new mongoose model based on the schema and export it
const Tables = mongoose.model("Tables", TablesSchema);
export default Tables;