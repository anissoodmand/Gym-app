import express, { Request, Response, NextFunction } from 'express';
import{createCoach ,sessionAttendance ,updateCoach} from './coach.controller';

const router = express.Router();
router.post('/createCoach' , createCoach);
router.post('/attendance', sessionAttendance);
router.put("/:id" ,updateCoach)

export default router;