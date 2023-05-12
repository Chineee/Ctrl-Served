"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DrinkQueueSchema = new mongoose_1.default.Schema({
    order: { type: mongoose_1.default.SchemaTypes, required: true },
    dish: { type: mongoose_1.default.SchemaTypes, required: true },
    productionTime: { type: Number, required: true, min: 0 },
    begin: { type: Boolean, required: true },
    end: { type: Boolean, required: true },
});
const DrinkQueue = mongoose_1.default.model("DrinkQueue", DrinkQueueSchema);
exports.default = DrinkQueue;
//# sourceMappingURL=DrinkQueue.js.map