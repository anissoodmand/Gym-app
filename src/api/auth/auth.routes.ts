import express, { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser , logoutUser} from './auth.controller';
import User from '../user/user.model';

const router = express.Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  registerUser(req, res).catch(next);
});

router.post('/login' , loginUser);

router.post('/logout' ,logoutUser)
export default router;