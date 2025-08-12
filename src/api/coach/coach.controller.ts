import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import Coach from './coach.model';
import ClassSession from '../class/model/classSession.model';
import CoachAttendance from './CoachAttendance.model';
import ClassEnrollment from '../class/model/classEnrollment.model';

export const createCoach = async (req:Request , res:Response) =>{
try {
 
    const { name, phone, password, category , presence } = req.body;

    const existingUser = await Coach.findOne({ phone });
    if (existingUser) { res.status(400).json({ message: 'این شماره قبلاً ثبت شده است.' });
   return
    };
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCoach = await Coach.create({
      name,
      phone,
      password: hashedPassword,
      category,
      presence
    });

    res.status(201).json({success:true, message: 'مربی با موفقیت ساخته شد.',newCoach });
} catch (error) {
   console.error('❌ خطا در ساخت مربی:', error);
   res.status(500).json({ success: false, message: 'خطای داخلی سرور' });
}
}

export const sessionAttendance = async(req:Request , res:Response)=>{
  try {
    const {sessionId , coachId} = req.body;
   
    const mySession = await ClassSession.findById(sessionId);
    if(!mySession){
      res.status(404).json({ success: false, message:"جلسه یافت نشد"})
      return;
    }
    const exist = await CoachAttendance.findById({sessionId});
    if(exist){
      res.status(400).json({success: false, message: "حضور مربی قبلاً ثبت شده"});
      return
    }
    await CoachAttendance.create({ sessionId, coachId });    //1
    await ClassEnrollment.updateMany(                         //2
      { sessionId, remainingSessions: { $gt: 0 } },
      { $inc: { remainingSessions: -1 } }
    );

    res.status(200).json({success:true, message: "حضور مربی با موفقیت ثبت شد و از تمامی کاربران این کلاس یک جلسه کسر شد"})
  } catch (error) {
      res.status(500).json({ message: "خطا در ثبت حضور مربی" });
  }
}