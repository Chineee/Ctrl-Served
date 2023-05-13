import mongoose from 'mongoose'

//Create a new mongoose schema, defining the fields dishName and dishType as required strings and dishPrice and dishProductionTime as required numbers
const MenuSchema = new mongoose.Schema({
    dishName: {type: String, required: true},
    dishPrice: {type: Number, required: true},
    dishProductionTime: {type: Number, required: true},
    dishType: {type: String, enum: ['Food', 'Drink'], required: true}
});

//Create a new mongoose model based on the schema and export it
const Menu = mongoose.model("Menu", MenuSchema)
export default Menu;