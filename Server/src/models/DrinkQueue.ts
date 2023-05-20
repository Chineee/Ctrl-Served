import mongoose from "mongoose";
import {IMenu} from "./Menus";

export interface IDrinkQueue {
    readonly _id: mongoose.Schema.Types.ObjectId, // ID of the drink as a string
    order: mongoose.Schema.Types.ObjectId,  // Order which the drink is a part of as an ObjectId
    dish: IMenu, // Drink as an IMenu object
    begin: boolean, // If the drink's preparation has started as a boolean
    end: boolean, // If the drink's preparation has ended as a boolean
    orderNumber: number, // Order number as a number
    makerId: string, // ID of the bartender who made the drink
};

// Create a new mongoose model based on the schema and export it
const DrinkQueueSchema = new mongoose.Schema({
    order: {type: mongoose.SchemaTypes.ObjectId, required: true},
    dish: {type: mongoose.SchemaTypes.ObjectId, required: true},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    orderNumber: {type: Number, required: true},
    makerId: {type: String}
});

// Create a new mongoose model based on the schema and export it
const DrinkQueue = mongoose.model("DrinkQueue", DrinkQueueSchema);
export default DrinkQueue;