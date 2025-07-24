import express, { Request, Response, NextFunction } from 'express';
import { enrollInClass ,enrollUserMonthly,cancelUserMonthlyEnrollment } from '../controllers/enroll.controller';

const router = express.Router();
router.post('/enroll' , enrollInClass);
router.post('/monthly' , enrollUserMonthly);
router.post('/monthly/cancel' ,cancelUserMonthlyEnrollment);
export default router;