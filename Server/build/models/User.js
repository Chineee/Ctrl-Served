"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UsersSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Cashier', 'Waiter', 'Cook', 'Bartender'], required: true }
});
const Users = mongoose_1.default.model("Users", UsersSchema);
exports.default = Users;
//# sourceMappingURL=User.js.map