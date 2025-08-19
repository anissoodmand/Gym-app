import express, { Request, Response, NextFunction } from 'express';
import {enrollInPackage} from "../controllers/packageEnrollment.controller"

const router = express.Router();
router.post("/" ,enrollInPackage);

export default router;