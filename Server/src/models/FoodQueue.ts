import mongoose from 'mongoose'

const FoodQueueSchema = new mongoose.Schema({
    order: {type: mongoose.SchemaTypes.ObjectId, required: true},
    dish: {type: mongoose.SchemaTypes.ObjectId, required: true, ref: "menus"},
    productionTime: {type: Number, required: true, min: 0},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    position: {type: Number, required: true},
    orderNumber: {type: Number, required: true}
});

const FoodQueue = mongoose.model("FoodQueue", FoodQueueSchema);
export default FoodQueue;