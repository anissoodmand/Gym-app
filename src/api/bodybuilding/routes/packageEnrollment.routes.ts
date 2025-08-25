import express, { Request, Response, NextFunction } from 'express';
import {enrollInPackage ,useOneSession  ,getAllPackageEnrollments} from "../controllers/packageEnrollment.controller"

const router = express.Router();
router.post("/" ,enrollInPackage);
router.post("/:enrollmentId/use-session",useOneSession);
router.get("/all" ,getAllPackageEnrollments)

export default router;