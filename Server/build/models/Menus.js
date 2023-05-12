"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MenuSchema = new mongoose_1.default.Schema({
    dishName: { type: String, required: true },
    dishPrice: { type: Number, required: true },
    dishProductionTime: { type: Number, required: true },
    dishType: { type: String, enum: ['Food', 'Drink'], required: true }
});
const Menu = mongoose_1.default.model("Menu", MenuSchema);
exports.default = Menu;
//# sourceMappingURL=Menus.js.map