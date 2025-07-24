"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./api/auth/auth.routes"));
const user_routes_1 = __importDefault(require("./api/user/user.routes"));
const classSchedule_routes_1 = __importDefault(require("./api/class/routes/classSchedule.routes"));
const enroll_routes_1 = __importDefault(require("./api/class/routes/enroll.routes"));
const session_routes_1 = __importDefault(require("./api/class/routes/session.routes"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
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
app.use('/api/user', user_routes_1.default);
app.use('/api/class', classSchedule_routes_1.default);
app.use('/api/class/enrollment', enroll_routes_1.default);
app.use('/api/class/session', session_routes_1.default);
(0, database_1.connectDB)();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 server running on port ${PORT}`));
