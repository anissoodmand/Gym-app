import express, { Request, Response, NextFunction } from 'express';
import {enrollInPackage ,useOneSession} from "../controllers/packageEnrollment.controller"

const router = express.Router();
router.post("/" ,enrollInPackage);
router.post("/:id/use-session",useOneSession);

export default router;