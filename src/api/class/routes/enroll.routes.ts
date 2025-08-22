import express, { Request, Response, NextFunction } from 'express';
import { enrollInClass,classUsers ,enrollUserMonthly,cancelUserMonthlyEnrollment } from '../controllers/enroll.controller';

const router = express.Router();
router.post('/enroll' , enrollInClass);
router.post('/monthly' , enrollUserMonthly);
router.post('/monthly/cancel' ,cancelUserMonthlyEnrollment);
router.get('/active/:scheduleId', classUsers);
export default router;