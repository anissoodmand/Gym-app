import express, { Request, Response, NextFunction } from 'express';
import{createCoach ,sessionAttendance} from './coach.controller';

const router = express.Router();
router.post('/createCoach' , createCoach);
router.post('/attendance', sessionAttendance);

export default router;