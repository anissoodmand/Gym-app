import { Request, Response } from 'express';
import Bodybuilding from '../model/bodybuilding.model';
import PackageEnrollment from '../model/packageEnrollment.model';
import SessionHistory from '../model/sessionHistory.model';

export const enrollInPackage = async (req: Request, res: Response) => {
    try {
        const {packageId , userId , coachId , startDate , isActive} = req.body;
        const myPackage = await Bodybuilding.findById(packageId);
        if(!myPackage){
            res.status(404).json({ success: false, message:"پکیج یافت نشد"})
            return;
        }
       
        if((myPackage as any).isActive === false){
             res.status(400).json({ success: false, message:"این پکیج غیرفعال است"})
            return;
        }

        if((myPackage as any).packageName === "private" && !coachId){
            res.status(405).json({success: false, message: "وارد کردن مربی برای پکیج خصوصی اجباری می باشد" });
         return;   
        }
        const now = new Date();
        const existing = await PackageEnrollment.findOne({
            packageId , userId , expireTime :{$gt : now},
        })
        if(existing){
            res.status(409).json({success: false, message: "کاربر هم‌اکنون یک ثبت‌نام فعال برای این پکیج دارد",
            data: existing,});
            return;
        }

        const start = startDate ? new Date(startDate) : new Date();
        const expire = new Date(start);
        expire.setDate(expire.getDate() + myPackage.durationDays);

        const newEnroll = await PackageEnrollment.create({
            packageId, userId , coachId , startDate : start , expireTime: expire , remainingSessions : myPackage.sessionCount
        });
        res.status(201).json({success: true , message:"ثبت نام کاربر در این پکیج با موفقیت انجام شد" , newEnroll});

    } catch (error) {
    console.error('Error enroll in package:', error);
     res.status(500).json({ success: false, message: 'خطای سرور رخ داده است' });
     return;
    }
}

export const useOneSession = async( req:Request , res:Response) =>{
    try {
        const {enrollmentId} = req.params;
        const now = new Date();
        const updateSession = await PackageEnrollment.findByIdAndUpdate(
            { _id: enrollmentId, expireTime: { $gt: now }, remainingSessions: { $gt: 0 } },
            { $inc: { remainingSessions: -1 } },
            { new: true }
        ).populate("userId coachId packageId", "name packageName");
         if (updateSession) {
      // مرحله 2: ثبت در هیستوری
        await SessionHistory.create({
            enrollmentId: updateSession._id,
            userId: updateSession.userId,
            coachId: updateSession.coachId,
            packageId: updateSession.packageId,
            usedAt: now,
      });
        res.status(200).json({
        success: true,
        message: "جلسه با موفقیت ثبت شد",
        data: {
          remainingSessions: updateSession.remainingSessions,
          expireTime: updateSession.expireTime,
        }
      });
       const enrollment = await PackageEnrollment.findById(enrollmentId).select("expireTime remainingSessions");

    if (!enrollment) {
       res.status(404).json({ message: "اشتراک پیدا نشد" });
       return
    }

    if (enrollment.expireTime <= now) {
       res.status(400).json({ message: "اشتراک منقضی شده است" });
       return
    }

    if (enrollment.remainingSessions <= 0) {
       res.status(405).json({ message: "هیچ جلسه‌ای باقی نمانده است" });
       return
    }}
    } catch (error) {
     console.error('Error: use one session:', error);
     res.status(500).json({ success: false, message: 'خطای سرور رخ داده است' });
     return;
    }
}

export const getAllPackageEnrollments = async(req:Request , res:Response) =>{
    try {
        const now = new Date();
        const allPackage = await PackageEnrollment.find(
            {expireTime: { $gt: now }, remainingSessions: { $gt: 0 } });
             if(!allPackage){
      res.status(404).json({success: false, message: "هیچ ثبت نام فعالی یافت نشد"})
      return;
    }
    res.status(200).json({success: true,total :allPackage.length , message:"اطلاعات همه پکیج های فعال ثبت نام: " ,allPackage})
    return;
    } catch (error) {
    console.error('Error: get All Package Enrollments:', error);
     res.status(500).json({ success: false, message: 'خطای سرور رخ داده است' });
     return;
    }
}