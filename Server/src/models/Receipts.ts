import mongoose from 'mongoose'

// Create a new mongoose schema for receipts
const ReceiptsSchema = new mongoose.Schema({
    table: {type: Number, required: true},
    orderId: {type: mongoose.SchemaTypes.ObjectId, required: true}, // It is the ObjectId of the order considered for the receipt
    dishes: {type: Array, required: true}
})

// Create a new mongoose model based on the schema and export it
const Receipts = mongoose.model("Receipts", ReceiptsSchema);
export default Receipts;
