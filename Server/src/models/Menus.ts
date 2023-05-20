import mongoose from 'mongoose';

export interface IMenu {
    readonly _id : mongoose.Schema.Types.ObjectId, // ID of the menu dish as a strin
    name: string, // Name of the dish as a string
    price: number, // Price of the dish as a number
    productionTime: number, // Production time of the dish as a number
    type: 'Food' | 'Drink' // Type of the dish as a string, limited to specific options
};

// Create a new mongoose schema for menu dishes and drinks
const MenuSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    productionTime: {type: Number, required: true},
    type: {type: String, enum: ['Food', 'Drink'], required: true}
});

// Create a new mongoose model based on the schema and export it
const Menu = mongoose.model("Menu", MenuSchema);
export default Menu;