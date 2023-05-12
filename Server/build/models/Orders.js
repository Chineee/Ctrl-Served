"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrdersSchema = new mongoose_1.default.Schema({
    tableNumber: { type: Number, required: true },
    waiter: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
    dish_array: { type: Array, required: true },
    price: { type: Number, required: true, min: 0 },
    ready_count: { type: Number, required: true, min: 0 }
});
const Orders = mongoose_1.default.model("Orders", OrdersSchema);
exports.default = Orders;
//# sourceMappingURL=Orders.js.map