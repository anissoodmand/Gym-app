import jwt from 'jsonwebtoken';
import { Request , Response, NextFunction } from 'express';


interface AuthenticatedRequest extends Request{
    user?: {id:string};
}

export const authenticateToken = async(req:AuthenticatedRequest , res:Response, next:NextFunction) =>{

    const token = req.cookies?.token;
    if(!token){
        res.status(401).json({message:'Access token is missing or invalid' });
       return; 
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET! as string) as {id:string};
        req.user = {id:decoded.id};
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token' }); 
    }
}