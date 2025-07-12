import express from 'express';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
import authRoutes from './api/auth/auth.routes';
import userRoutes from './api/user/user.routes';
import cors from 'cors';
import { TestModel } from './test';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express(); //*********************** 
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://local-gym-ahvaz.netlify.app/'
];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));


app.use('/api/auth' , authRoutes); //*********************** 
app.use('/api/user' , userRoutes);


connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> console.log(`🚀 server running on port ${PORT}`))