import { Request, Response } from "express";
import User from "./user.model";
import { authenticateToken} from '../../middlewares/auth.middleware'

interface AuthenticatedRequest extends Request{
    user?: {id:string};
}
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
   try {
    if (!req.user?.id) {
       res.status(401).json({ success: false, message: "کاربر احراز هویت نشده" });
       return
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
       res.status(404).json({ success: false, message: "کاربر یافت نشد" });
      return
    }

    res.status(200).json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "خطای سرور", error: err.message });
  }
}