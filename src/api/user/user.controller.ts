import { Request, Response } from "express";
import User from "./user.model";
import { authenticateToken} from '../../middlewares/auth.middleware'
import bcrypt from 'bcrypt';
import ClassEnrollment from '../class/model/classEnrollment.model';
import ClassSession from '../class/model/classSession.model';
import ClassSchedule from '../class/model/classSchedule.model';
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
export const updateUser = async (req:Request, res: Response) =>{
  try {
    const {id} = req.params;
    let MyUpdate = req.body;
      if(MyUpdate.password){
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(MyUpdate.password , saltRounds);
      MyUpdate = {
        ...MyUpdate,
        password: hashedPassword,
      };
    }
    const myUser = await User.findByIdAndUpdate(id , MyUpdate ,{
        new: true,
        runValidators: true
    });
    if(!myUser){
      res.status(404).json({success: false, message: " کاربر یافت نشد"});
      return
    }
    res.status(200).json({success: true , message: "کاربر با موفقیت بروزرسانی شد "})
  } catch (error) {
    res.status(500).json({ success: false, message: 'لطفا بررسی کنید-خطای سرور' });
 
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
export const getUserAdminView = async (req: Request, res: Response) =>{
   try {
      const {userId} = req.params;
  const includeExpired = req.query.includeExpired === 'true';

  const user = await User.findById(userId).select('-password').lean();
   if (!user){
    res.status(404).json({ success: false, message: 'کاربر پیدا نشد' })
    return};

   const enrollFilter : any= {userId};
   if(!enrollFilter){enrollFilter.expireTime = { $gte: new Date() }}

   const enrollments = await ClassEnrollment.find(enrollFilter)
    .populate({ path: 'scheduleId', select: 'title days.day', model: 'ClassSchedule', strictPopulate: false })
    .populate({ path: "coachId", select: "name", model: "Coach", strictPopulate: false })
      .select("remainingSessions scheduleId coachId createdAt")
      .lean();

      const result = enrollments.map(enroll => ({
      title: (enroll.scheduleId && typeof enroll.scheduleId === 'object' && 'title' in enroll.scheduleId) ? enroll.scheduleId.title : undefined,
      days: (enroll.scheduleId && typeof enroll.scheduleId === 'object' && 'days' in enroll.scheduleId) ? enroll.scheduleId.days : undefined,
      coachName: (enroll.coachId && typeof enroll.coachId === 'object' && 'name' in enroll.coachId) ? enroll.coachId.name : undefined,
      enrollDate: enroll.createdAt,
      remainingSessions: enroll.remainingSessions,
      
    }));

  
    res.status(200).json({success: true , user , result })
   } catch (error) {
    console.error("Error getUserAdminView:", error);
     res.status(500).json({ success: false, message: "خطا در دریافت اطلاعات کلاس‌ها" })
   }
}