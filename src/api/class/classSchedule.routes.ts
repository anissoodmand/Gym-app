import express, { Request, Response, NextFunction } from 'express';
import {createClassSchedule } from './classSchedule.controller';

const router= express.Router();
router.post('/create-schedule' , createClassSchedule);

export default router;