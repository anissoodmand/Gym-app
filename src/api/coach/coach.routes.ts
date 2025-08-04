import express, { Request, Response, NextFunction } from 'express';
import{createCoach} from './coach.controller';

const router = express.Router();
router.post('/createCoach' , createCoach);

export default router;