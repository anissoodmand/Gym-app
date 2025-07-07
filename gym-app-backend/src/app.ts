import express from 'express';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
import authRoutes from './api/auth/auth.routes'


dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth' , authRoutes)
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> console.log(`🚀 server running on port ${PORT}`))