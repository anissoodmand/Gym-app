import express, { Request, Response, NextFunction } from 'express';
import{createPackage ,getAllPackages} from '../controllers/bodybuilding.controller';

const router = express.Router();
router.post("/createPackage" , createPackage);
router.get("allPackages" ,getAllPackages);

export default router;