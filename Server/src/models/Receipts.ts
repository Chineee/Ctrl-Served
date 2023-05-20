import mongoose from 'mongoose';

// Create a new mongoose schema for receipts
const ReceiptsSchema = new mongoose.Schema({
    tableNumber: {type: Number, required: true},
    dishes: {type: Array, required: true, ref:"Menu"},
    date: {type: String, required: true},
    hour: {type: String, required: true},
    price: {type: String, required: true}
});

// Create a new mongoose model based on the schema and export it
const Receipts = mongoose.model("Receipts", ReceiptsSchema);
export default Receipts;
