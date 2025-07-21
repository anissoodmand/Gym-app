import express, { Request, Response, NextFunction } from 'express';
import {createClassSchedule , getAllClasses,getClassInfoById ,updateClass ,deleteClass} from '../controllers/classSchedule.controller';

const router= express.Router();
router.post('/create-schedule' , createClassSchedule);
router.get('/allClasses',getAllClasses);
router.get('/:id' , getClassInfoById);
router.put('/:id' ,updateClass);
router.delete('/:id' , deleteClass);

export default router;