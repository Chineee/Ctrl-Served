"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FoodQueueSchema = new mongoose_1.default.Schema({
    order: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
    dish: { type: mongoose_1.default.SchemaTypes.ObjectId, required: true },
    productionTime: { type: Number, required: true, min: 0 },
    begin: { type: Boolean, required: true },
    end: { type: Boolean, required: true }
});
const FoodQueue = mongoose_1.default.model("FoodQueue", FoodQueueSchema);
exports.default = FoodQueue;
//# sourceMappingURL=FoodQueue.js.map