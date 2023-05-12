"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TablesSchema = new mongoose_1.default.Schema({
    tableNumber: { type: Number, required: true },
    occupied: { type: Boolean, required: true },
    seats: { type: Number, required: true },
    customers: { type: Number, required: true, validate: {
            validator: function (v) {
                return v.customers <= v.seats;
            }
        } }
});
const Tables = mongoose_1.default.model("Tables", TablesSchema);
exports.default = Tables;
//# sourceMappingURL=Tables.js.map