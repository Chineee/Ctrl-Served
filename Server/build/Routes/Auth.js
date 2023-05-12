"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemaValidation = void 0;
const express_1 = require("express");
const joi_1 = __importDefault(require("joi"));
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserSchemaValidation = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().required().email(),
    surname: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string().valid('Cashier', 'Waiter', 'Cook', 'Bartender')
});
exports.default = () => {
    const app = (0, express_1.Router)();
    app.put('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { error } = exports.UserSchemaValidation.validate(req.body);
        if (error)
            return res.status(400).send(error.details[0].message);
        const emailExists = yield User_1.default.findOne({ email: req.body.email });
        if (emailExists)
            return res.status(400).send("This email is already linked to a user");
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const user = new User_1.default({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role,
        });
        try {
            yield user.save();
            res.send("User correctly added to the database");
        }
        catch (err) {
            res.status(400).send(err);
        }
    }));
    return app;
};
//# sourceMappingURL=Auth.js.map