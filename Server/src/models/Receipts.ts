import mongoose from 'mongoose'

const ReceiptsSchema = new mongoose.Schema({
    table: {type: Number, required: true},
    orderId: {type: mongoose.SchemaTypes.ObjectId, required: true},
    dishes: {type: Array, required: true}
})

const Receipts = mongoose.model("Receipts", ReceiptsSchema);
export default Receipts;
