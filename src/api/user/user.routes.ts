import express, { Request, Response, NextFunction } from 'express';
import {getMe ,getAllUsers ,getUserInfoById, deleteUser ,createUserByAdmin} from "./user.controller";
import { authenticateToken } from '../../middlewares/auth.middleware';

const router = express.Router();

router.post('/create' ,createUserByAdmin)
router.get('/me' , authenticateToken , getMe);
router.get('/allUsers' ,getAllUsers);
router.get('/:id' ,getUserInfoById);
router.delete('/:id', deleteUser);

export default router;