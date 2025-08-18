import { Request, Response, NextFunction } from "express";
import User from "../api/user/user.model";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const hasRole = (...allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        res.status(403).json({ success: false, message: "Access denied" });
         return;
      }

      next();
    } catch (error) {
      console.error("Error in hasRole middleware:", error);
      res.status(500).json({ success: false, message: "An error occurred while checking role" });
    }
  };
};
