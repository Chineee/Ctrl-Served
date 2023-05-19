import mongoose from 'mongoose'
import {IMenu} from "./Menus";

export interface IFoodQueue {
    readonly _id: mongoose.Schema.Types.ObjectId, // ID of the dish as a string
    order: mongoose.Schema.Types.ObjectId,  // Order which the dish is a part of as an ObjectId
    dish: IMenu, // Dish as an IMenu object
    begin: boolean, // If the dish's preparation has started as a boolean
    end: boolean, // If the dish's preparation has ended as a boolean
    orderNumber: number, // Order number as a number
    makerId: string, // ID of the cook who made the dish
}

// Create a new mongoose schema for the food queue elements
const FoodQueueSchema = new mongoose.Schema({
    order: {type: mongoose.Schema.Types.ObjectId, required: true},
    dish: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Menu"},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    orderNumber: {type: Number, required: true},
    makerId: {type: String}
});

// Create a new mongoose model based on the schema and export it
const FoodQueue : mongoose.Model<IFoodQueue> = mongoose.model<IFoodQueue>("FoodQueue", FoodQueueSchema);
export default FoodQueue;