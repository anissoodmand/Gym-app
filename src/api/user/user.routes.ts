import express, { Request, Response, NextFunction } from 'express';
import {getMe} from "./user.controller";
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = express.Router();

router.get('/me' , authenticateToken , getMe);
export default router;