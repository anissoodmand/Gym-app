import express from 'express';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
import authRoutes from './api/auth/auth.routes'
import cors from 'cors';
import { TestModel } from './test';

dotenv.config();

const app = express(); //*********************** 
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://p-a-gym.netlify.app'
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

app.get('/test-db', async (req, res) => {
  try {
    const test = await new TestModel({ name: 'Railway Test' }).save();
    res.json({ message: 'Saved!', test });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> console.log(`🚀 server running on port ${PORT}`))