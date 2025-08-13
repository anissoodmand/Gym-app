import express from 'express';
import {generateSessions,deleteAllSessions ,getAllSessionsWithCapacity} from '../controllers/classSession.controller';

const router = express.Router();
router.post('/generate' , generateSessions);
router.get('/AllCapacity' ,getAllSessionsWithCapacity)
router.delete("/allDEL" ,deleteAllSessions)
export default router;