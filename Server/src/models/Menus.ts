import mongoose from 'mongoose'

//Create a new mongoose schema, defining the fields dishName and dishType as required strings and dishPrice and dishProductionTime as required numbers

export interface IMenu {
    readonly _id : mongoose.Schema.Types.ObjectId,
    dishName: string,
    dishPrice: number,
    dishProductionTime: number,
    dishType: string
}

const MenuSchema = new mongoose.Schema({
    dishName: {type: String, required: true},
    dishPrice: {type: Number, required: true},
    dishProductionTime: {type: Number, required: true},
    dishType: {type: String, enum: ['Foods', 'Drinks'], required: true}
});

//Create a new mongoose model based on the schema and export it
const Menu = mongoose.model("Menu", MenuSchema)
export default Menu;