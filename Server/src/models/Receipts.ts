import mongoose from 'mongoose'

//Create a new mongoose schema for receipts, defining the fields table as a required number, orderId as a required object id and dishes as a required array
const ReceiptsSchema = new mongoose.Schema({
    table: {type: Number, required: true},
    orderId: {type: mongoose.SchemaTypes.ObjectId, required: true},
    dishes: {type: Array, required: true}
})

//Create a new mongoose model based on the schema and export it
const Receipts = mongoose.model("Receipts", ReceiptsSchema);
export default Receipts;
