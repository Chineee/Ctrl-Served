"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const Auth_1 = __importDefault(require("./Routes/Auth"));
dotenv_1.default.config({ path: __dirname + "/../.env" });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.connect(process.env.MONGO_URL);
app.use(express_1.default.json());
app.use('/api', (0, Auth_1.default)());
app.listen(PORT, () => {
    console.log("Server listening in http://localhost:" + PORT);
});
//# sourceMappingURL=server.js.map