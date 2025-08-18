import express, { Request, Response, NextFunction } from 'express';
import {getMe ,getAllUsers ,getUserInfoById,getUserAdminView, deleteUser ,updateUser,createUserByAdmin} from "./user.controller";
import { authenticateToken } from '../../middlewares/auth.middleware';
import { isAdmin , isCoachOrAdmin } from '../../middlewares/checkRoles';

const router = express.Router();

router.post('/create' ,createUserByAdmin)
router.get('/me' , authenticateToken , getMe);
router.get('/allUsers' ,getAllUsers);
router.get('/view/:userId',authenticateToken, isCoachOrAdmin ,getUserAdminView);
router.get('/:id' ,getUserInfoById);
router.put('/:id',authenticateToken, isCoachOrAdmin ,updateUser)
router.delete('/:id',authenticateToken, isAdmin, deleteUser);

export default router;