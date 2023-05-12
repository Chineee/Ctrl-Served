import mongoose from 'mongoose'

const TablesSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    occupied: {type: Boolean, required: true},
    seats: {type: Number, required: true},
    customers: {type: Number, required: true, validate: {
        validator: function(v) {
            return v.customers <= v.seats;
        }
    }}
})

const Tables = mongoose.model("Tables", TablesSchema);
export default Tables;