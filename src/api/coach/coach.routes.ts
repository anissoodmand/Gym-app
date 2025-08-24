import express, { Request, Response, NextFunction } from 'express';
import{createCoach ,sessionAttendance,session2Attendance ,updateCoach} from './coach.controller';

const router = express.Router();
router.post('/createCoach' , createCoach);
router.post('/attendance', session2Attendance);
router.put("/:id" ,updateCoach)

export default router;