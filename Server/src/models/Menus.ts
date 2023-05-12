import mongoose from 'mongoose'

const MenuSchema = new mongoose.Schema({
    dishName: {type: String, required: true},
    dishPrice: {type: Number, required: true},
    dishProductionTime: {type: Number, required: true},
    dishType: {type: String, enum: ['Food', 'Drink'], required: true}
});

const Menu = mongoose.model("Menu", MenuSchema)
export default Menu;