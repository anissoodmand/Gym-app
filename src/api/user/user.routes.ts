import express, { Request, Response, NextFunction } from 'express';
import {getMe ,getAllUsers ,getUserInfoById,getUserAdminView, deleteUser ,updateUser,createUserByAdmin} from "./user.controller";
import { authenticateToken } from '../../middlewares/auth.middleware';
import { hasRole } from '../../middlewares/checkRoles';

const router = express.Router();

router.post('/create', hasRole("admin") ,createUserByAdmin)
router.get('/me' , authenticateToken , getMe);
router.get('/allUsers' ,getAllUsers);
router.get('/view/:userId' ,getUserAdminView);
router.get('/:id' ,getUserInfoById);
router.put('/:id',authenticateToken, hasRole("admin", "coach") ,updateUser)
router.delete('/:id', deleteUser);

export default router;