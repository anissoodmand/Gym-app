import express from 'express';
import {generateSessions} from '../controllers/classSession.controller';

const router = express.Router();
router.post('/generate' , generateSessions)
export default router;