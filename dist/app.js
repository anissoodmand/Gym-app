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
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./api/auth/auth.routes"));
const cors_1 = __importDefault(require("cors"));
const test_1 = require("./test");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const allowedOrigins = [
    'http://localhost:5000',
    'http://localhost:5173',
    'https://p-a-gym.netlify.app'
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use('/api/auth', auth_routes_1.default);
app.get('/test-db', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const test = yield new test_1.TestModel({ name: 'Railway Test' }).save();
        res.json({ message: 'Saved!', test });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
}));
(0, database_1.connectDB)();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 server running on port ${PORT}`));
