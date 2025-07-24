import express, { Request, Response, NextFunction } from 'express';
import { enrollInClass ,enrollUserMonthly } from '../controllers/enroll.controller';

const router = express.Router();
router.post('/enroll' , enrollInClass);
router.post('/enroll/monthly' , enrollUserMonthly);
export default router;