import mongoose from "mongoose"

const DrinkQueueSchema = new mongoose.Schema({
    order: {type: mongoose.SchemaTypes.ObjectId, required: true},
    dish: {type: mongoose.SchemaTypes.ObjectId, required: true},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    orderNumber: {type: Number, required: true},
    makerId: {type: String}
});

const DrinkQueue = mongoose.model("DrinkQueue", DrinkQueueSchema);
export default DrinkQueue;