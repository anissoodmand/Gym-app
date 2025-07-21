import { Request, Response } from 'express';
import ClassSession from '../model/classSession.model';
import ClassEnrollment from '../model/classEnrollment.model';
import { checkCapacityForSessions } from '../services/classCapacity.service';

export const enrollInClass = async(req:Request , res:Response): Promise<void> =>{
    try {
         const { userId, scheduleId, sessionIds, type, price } = req.body;
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
           // ثبت‌نام در دیتابیس
        const enrollment = await ClassEnrollment.create({
            userId, scheduleId, sessionIds, type, paid:false, price
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