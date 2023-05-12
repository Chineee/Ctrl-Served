"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReceiptsSchema = new mongoose_1.default.Schema({
    table: { type: Number, required: true },
    orderId: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
    dishes: { type: Array, required: true }
});
const Receipts = mongoose_1.default.model("Receipts", ReceiptsSchema);
exports.default = Receipts;
//# sourceMappingURL=Receipts.js.map