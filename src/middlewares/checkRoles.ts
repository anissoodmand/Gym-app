import { Request , Response, NextFunction } from 'express';
import User from '../api/user/user.model';

interface AuthenticatedRequest extends Request{
    user?: {id:string};
}

export const isAdmin = async (req:AuthenticatedRequest , res: Response , next: NextFunction) =>{
    try {
        const user = await User.findById(req.user?.id);
        if(!user){
             res.status(404).json({ success: false, message: "User(admin) not found"});
            return;
        }

        if(user?.role !== "admin"){
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        next();
    } catch (error) {
         console.error('Error isAdmin ***:', error);
         res.status(500).json({ success: false, message: "An error occurred while checking if the role is admin"})
    }
}

export const isCoach = async (req:AuthenticatedRequest , res: Response , next: NextFunction) =>{
    try {
        const user = await User.findById(req.user?.id);
        if(!user){
             res.status(404).json({ success: false, message: "User(coach) not found"});
            return;
        }

        if(user?.role !== "coach"){
            res.status(403).json({ success: false, message: "Access denied" });
            return;
        }
        next();
    } catch (error) {
         console.error('Error isCoach ***:', error);
         res.status(500).json({ success: false, message: "An error occurred while checking if the role is coach"})
    }
}