import { Request, Response } from "express";
import User from "./user.model";
import { authenticateToken} from '../../middlewares/auth.middleware'
import bcrypt from 'bcrypt';

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

    res.status(200).json({ success: true, message: "  اطلاعات کاربر لاگین شده شامل موارد زیر می باشد:",  user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "خطای سرور", error: err.message });
  }
}

export const getAllUsers = async (req:Request , res:Response) =>{
  try {
    const users = await User.find().select("-password");
    if(!users){
      res.status(404).json({success: false, message: "هیچ کاربری یافت نشد"})
      return;
    }
    res.status(200).json({success: true,total :users.length , message:"اطلاعات همه کاربران: " ,users})
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: "خطای سرور- بازگرداندن لیست کاربران با خطا مواجه شد" });
  }
}

export const getUserInfoById = async (req:Request , res:Response) =>{
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
      res.status(404).json({success: false, message: " کاربر یافت نشد"});
      return
    }
     res.status(200).json({success: true, message:"اطلاعات کاربر: " ,user})
    return;
  } catch (error) {
     res.status(500).json({ success: false, message: "خطای سرور- بازگرداندن کاربر با خطا مواجه شد" })
  }
}
export const createUserByAdmin = async (req:Request , res:Response) =>{
try {
  console.log('📥 درخواست دریافتی:', req.body);
    const { name, phone, password, status = 'active', role = 'user' } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) { res.status(400).json({ message: 'این شماره قبلاً ثبت شده است.' });
   return
    };
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      phone,
      password: hashedPassword,
      status,
      role,
    });

    res.status(201).json({success:true, message: 'کاربر با موفقیت ساخته شد.',newUser });
} catch (error) {
   console.error('❌ خطا در ساخت کاربر:', error);
   res.status(500).json({ success: false, message: 'خطای داخلی سرور' });
}
}
export const deleteUser = async (req:Request , res:Response) =>{
  try {
    const {id} = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if(!deletedUser){
       res.status(404).json({success: false, message: " کاربر یافت نشد"});
      return
    }
      res.status(200).json({success: true , message: "کاربر با موفقیت حذف شد "});
        return
  } catch (error) {
    res.status(500).json({ success: false, message: 'لطفا بررسی کنید-خطای سرور' });
  }
}