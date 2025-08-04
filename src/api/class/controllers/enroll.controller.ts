import { Request, Response } from 'express';
import ClassSession from '../model/classSession.model';
import ClassEnrollment from '../model/classEnrollment.model';
import ClassSchedule from '../model/classSchedule.model';
import { checkCapacityForSessions } from '../services/classCapacity.service';
import moment from 'moment-jalaali';

export const enrollInClass = async(req:Request , res:Response): Promise<void> =>{
    try {
         const { userId, scheduleId, sessionIds, type, price  , coachId} = req.body;
            // بررسی ظرفیت جلسات
         const result = await checkCapacityForSessions(sessionIds);
         if(!result.ok){
        res.status(400).json({
        success: false,
        message: 'ظرفیت برخی جلسات پر شده',
        fullSessions: result.fullSessions, });
         return
        }
    // 2. بررسی تکراری نبودن ثبت‌نام
    const existingEnrollment = await ClassEnrollment.findOne({
      userId,
      scheduleId,
      sessionIds: { $in: sessionIds },
    });

    if (existingEnrollment) {
      const duplicateSessionIds = existingEnrollment.sessionIds.filter((sessionId) =>
        sessionIds.includes(sessionId.toString())
      );

      res.status(400).json({
        success: false,
        message: 'شما قبلاً در برخی از این جلسات ثبت‌نام کرده‌اید.',
        duplicateSessionIds,
      });
      return;
    }
          // محاسبه‌ی expireTime با توجه به نوع ثبت‌نام
        let expireTime: Date;
        if (type === 'monthly') {
          expireTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 روز بعد
        } else if (type === 'single') {
          expireTime = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 روز بعد (مثلاً)
        } else {
          expireTime = new Date(); // مقدار پیش‌فرض اگر نوع ثبت‌نام مشخص نباشد
        }

           // ثبت‌نام در دیتابیس
        const enrollment = await ClassEnrollment.create({
            userId, scheduleId, sessionIds, type, paid:false, price , expireTime , coachId
        })
        //افزودن کاربر به جلسات انتخابی
        await ClassSession.updateMany(
           { _id: { $in: sessionIds } },
      { $addToSet: { registeredUsers: userId } });

       res.status(201).json({
      success: true,
      message: 'ثبت‌نام انجام شد',
      data: enrollment,});
    return
    } catch (error) {
        console.error('Error in enrollInClass:', error);
    res.status(500).json({ success: false, message: 'خطای سرور' });
    }
}

export const enrollUserMonthly = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scheduleId, userId } = req.body;

    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
       res.status(404).json({ success: false, message: 'برنامه کلاس یافت نشد' });
       return
    }

    const today = moment().format('YYYY-MM-DD');

    const sessions = await ClassSession.find({
      scheduleId,
      date: { $gte: today },
      isCanceled: false,
    });

    let enrolledCount = 0;
    for (const session of sessions) {
      if (
        session.registeredUsers.length < schedule.capacity &&
        !session.registeredUsers.includes(userId)
      ) {
        session.registeredUsers.push(userId);
        await session.save();
        enrolledCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `${enrolledCount} جلسه برای کاربر ثبت شد.`,
    });
  } catch (error) {
    console.error('خطا در ثبت نام ماهانه:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در ثبت‌نام' });
  }
};


export const cancelUserMonthlyEnrollment = async (req: Request, res: Response) => {
  try {
    const { scheduleId, userId } = req.body;

    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
       res.status(404).json({ success: false, message: 'برنامه کلاس یافت نشد' });
       return
    }

    const today = moment().format('YYYY-MM-DD');

    const sessions = await ClassSession.find({
      scheduleId,
      date: { $gte: today },
      isCanceled: false,
      registeredUsers: userId,
    });

    let cancelCount = 0;

    for (const session of sessions) {
      session.registeredUsers = session.registeredUsers.filter(
        (id) => id.toString() !== userId
      );
      await session.save();
      cancelCount++;
    }

    res.status(200).json({
      success: true,
      message: `${cancelCount} جلسه لغو ثبت‌نام شد.`,
    });
  } catch (error) {
    console.error('خطا در لغو ثبت‌نام ماهانه:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در لغو ثبت‌نام' });
  }
};
