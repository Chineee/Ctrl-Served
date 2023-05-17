import mongoose from "mongoose"

const DrinkQueueSchema = new mongoose.Schema({
    order: {type: mongoose.SchemaTypes.ObjectId, required: true},
    dish: {type: mongoose.SchemaTypes.ObjectId, required: true},
    productionTime: {type: Number, required: true, min: 0},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    position: {type: Number, required: true}
});

const DrinkQueue = mongoose.model("DrinkQueue", DrinkQueueSchema);
export default DrinkQueue;