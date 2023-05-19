import mongoose from 'mongoose'
import {IUser} from "./User";
import {IMenu} from "./Menus";


export interface IFoodQueue {
    readonly _id: mongoose.Schema.Types.ObjectId,
    order: mongoose.Schema.Types.ObjectId,
    dish: IMenu,
    begin: boolean,
    end: boolean,
    orderNumber: number,
    makerId: string,
}

const FoodQueueSchema = new mongoose.Schema({
    order: {type: mongoose.Schema.Types.ObjectId, required: true},
    dish: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Menu"},
    begin: {type: Boolean, required: true},
    end: {type: Boolean, required: true},
    orderNumber: {type: Number, required: true},
    makerId: {type: String}
});

const FoodQueue : mongoose.Model<IFoodQueue> = mongoose.model<IFoodQueue>("FoodQueue", FoodQueueSchema);
export default FoodQueue;