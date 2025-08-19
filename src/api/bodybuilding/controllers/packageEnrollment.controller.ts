import { Request, Response } from 'express';
import Bodybuilding from '../model/bodybuilding.model';
import PackageEnrollment from '../model/packageEnrollment.model';

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
        expire.setDate(expire.getDate() + packageId.durationDays);

        const newEnroll = await PackageEnrollment.create({
            packageId, userId , coachId , startDate : start , expireTime: expire , remainingSessions : packageId.sessionCount
        });
        res.status(201).json({success: true , message:"ثبت نام کاربر در این پکیج با موفقیت انجام شد" , newEnroll});

    } catch (error) {
    console.error('Error enroll in package:', error);
     res.status(500).json({ success: false, message: 'خطای سرور رخ داده است' });
     return;
    }
}