import express, { Request, Response, NextFunction } from 'express';
import {createClassSchedule , getAllClasses,getClassInfoById} from './classSchedule.controller';

const router= express.Router();
router.post('/create-schedule' , createClassSchedule);
router.get('/allClasses',getAllClasses);
router.get('/:id' , getClassInfoById);

export default router;