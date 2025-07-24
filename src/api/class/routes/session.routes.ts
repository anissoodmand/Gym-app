import express from 'express';
import {generateSessions ,getAllSessionsWithCapacity} from '../controllers/classSession.controller';

const router = express.Router();
router.post('/generate' , generateSessions);
router.get('/AllCapacity' ,getAllSessionsWithCapacity)
export default router;