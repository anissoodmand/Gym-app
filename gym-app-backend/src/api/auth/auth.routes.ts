import express, { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from './auth.controller';

const router = express.Router();

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  registerUser(req, res).catch(next);
});

router.post('/login' , loginUser);
export default router;