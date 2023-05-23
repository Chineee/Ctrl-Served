import mongoose from 'mongoose';
import {IMenu} from "./Menus";

export interface IQueue {
    readonly _id: mongoose.Schema.Types.ObjectId, // ID of the drink as a string
    order: mongoose.Schema.Types.ObjectId,  // Order which the drink is a part of as an ObjectId
    dish: IMenu, // Drink as an IMenu object
    begin: boolean, // If the drink's preparation has started as a boolean
    end: boolean, // If the drink's preparation has ended as a boolean
    orderNumber: number, // Order number as a number
    makerId: string, // ID of the bartender who made the drink
};

// Create a new mongoose schema for the food queue elements
const QueueSchema = new mongoose.Schema({
    order: {type: mongoose.Schema.Types.ObjectId, required: true},
    dish: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Menu"},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    orderNumber: {type: Number, required: true},
    makerId: {type: String}
});

// Create a new mongoose model based on the schema and export it
export const FoodQueue : mongoose.Model<IQueue> = mongoose.model<IQueue>("FoodQueue", QueueSchema);
export const DrinkQueue : mongoose.Model<IQueue> = mongoose.model<IQueue>("DrinkQueue", QueueSchema);

