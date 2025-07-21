import express, { Request, Response, NextFunction } from 'express';
import { enrollInClass } from '../controllers/enroll.controller';

const router = express.Router();
router.post('/enroll' , enrollInClass)
export default router;