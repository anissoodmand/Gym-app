"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
router.post('/register', (req, res, next) => {
    (0, auth_controller_1.registerUser)(req, res).catch(next);
});
router.post('/login', auth_controller_1.loginUser);
exports.default = router;
