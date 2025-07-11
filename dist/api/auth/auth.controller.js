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
exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../user/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "name is required AMO JON"),
    phone: zod_1.z.string().regex(/^09\d{9}$/, "this phone number is invalid"),
    password: zod_1.z.string().min(6, "password should be 6 char and more")
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = registerUserSchema.parse(req.body);
        const { name, phone, password } = validatedData;
        const existingUser = yield user_model_1.default.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ message: 'این شماره قبلاً ثبت شده است' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(validatedData.password, 10);
        const user = yield user_model_1.default.create(Object.assign(Object.assign({}, validatedData), { password: hashedPassword }));
        res.status(201).json({ success: true, message: 'ثبت نام کاربر با موفقیت انجام شد', user });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ message: error.errors[0].message });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'خطای داخلی سرور' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, password } = req.body;
        const user = yield user_model_1.default.findOne({ phone });
        if (!user) {
            res.status(404).json({ success: false, message: "کاربر یافت نشد، لطفا ثبت نام کنید" });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(401).json({ success: false, message: "نام کاربری یا رمزعبور اشتباه است" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24
        });
        console.log("Set-Cookie header:", res.getHeader("Set-Cookie"));
        res.status(200)
            .json({ success: true, message: "به پنل کاربری وارد شدید" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
});
exports.loginUser = loginUser;
