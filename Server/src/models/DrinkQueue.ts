import mongoose from "mongoose"

const DrinkQueueSchema = new mongoose.Schema({
    order: {type: mongoose.SchemaTypes, required: true},
    dish: {type: mongoose.SchemaTypes, required: true},
    productionTime: {type: Number, required: true, min: 0},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
});

const DrinkQueue = mongoose.model("DrinkQueue", DrinkQueueSchema);
export default DrinkQueue;