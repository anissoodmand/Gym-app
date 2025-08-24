import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import Coach from './coach.model';
import ClassSession from '../class/model/classSession.model';
import CoachAttendance from './CoachAttendance.model';
import ClassEnrollment from '../class/model/classEnrollment.model';
import ClassSchedule from '../class/model/classSchedule.model';

export const createCoach = async (req:Request , res:Response) =>{
try {
 
    const { name, phone, password, category , presence ,scheduleId } = req.body;

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
      presence,
      scheduleId
    });

    res.status(201).json({success:true, message: 'مربی با موفقیت ساخته شد.',newCoach });
} catch (error) {
   console.error('❌ خطا در ساخت مربی:', error);
   res.status(500).json({ success: false, message: 'خطای داخلی سرور' });
}
}
export const session2Attendance = async(req:Request , res:Response)=>{
try {
  const {scheduleId , coachId} = req.body;
  const classSessions = await ClassSession.find(scheduleId);
  if(!classSessions){
     res.status(404).json({ success: false, message:"جلسه یافت نشد"})
      return;
  }
    await ClassEnrollment.updateMany(                         //2
      { scheduleId: classSessions[0]?.scheduleId , remainingSessions: { $gt: 0 } },
      { $inc: { remainingSessions: -1 } }
    );
      res.status(200).json({success:true, message: "حضور مربی با موفقیت ثبت شد و از تمامی کاربران این کلاس یک جلسه کسر شد"})
} catch (error) {
      console.error('Error CoachAttendance :', error);
      res.status(500).json({success: false, message: "خطا در ثبت حضور مربی" });
}
}
export const session1Attendance = async(req:Request , res:Response)=>{
  try {
    const {scheduleId , coachId} = req.body;
   
    const mySession = await ClassSession.findById(scheduleId);
    if(!mySession){
      res.status(404).json({ success: false, message:"جلسه یافت نشد"})
      return;
    }
    const exist = await CoachAttendance.findOne({ sessionId: mySession._id });
    if(exist){
      res.status(400).json({success: false, message: "حضور مربی قبلاً ثبت شده"});
      return
    }
    await CoachAttendance.create({ sessionId: mySession._id , coachId });   
    await ClassEnrollment.updateMany(                         
      { scheduleId: mySession.scheduleId , remainingSessions: { $gt: 0 } },
      { $inc: { remainingSessions: -1 } }
    );

    res.status(200).json({success:true, message: "حضور مربی با موفقیت ثبت شد و از تمامی کاربران این کلاس یک جلسه کسر شد"})
  } catch (error) {
    console.error('Error CoachAttendance :', error);
      res.status(500).json({success: false, message: "خطا در ثبت حضور مربی" });
  }
}

export const updateCoach = async(req:Request , res:Response) =>{
    try {
      const {id} = req.params;
       
        const MyUpdate = req.body;
        
        const myCoach = await Coach.findByIdAndUpdate(id , MyUpdate ,{
            new: true,
            runValidators: true
        });

        if(!myCoach){
            res.status(404).json({message: "Coach not found"})
            return;
        }
        res.status(200).json({message: "Coach update successfully" , data: myCoach})
        return;
    } catch (error) {
         res.status(500).json({ success: false, message: '-خطای سرور' });
         return
    }
}
export const sessionAttendance = async (req: Request, res: Response) => {
  try {
    const { scheduleId, coachId } = req.body;

    // تمام جلسات مربوط به این برنامه
    const sessions = await ClassSession.find({ scheduleId });

    if (!sessions || sessions.length === 0) {
      res.status(404).json({ success: false, message: "هیچ جلسه‌ای برای این برنامه یافت نشد" });
      return;
    }

    let processedSessions = 0;
    let skippedSessions = 0;

    for (const session of sessions) {
      // آیا قبلاً حضور برای این جلسه ثبت شده؟
      const exist = await CoachAttendance.findOne({ sessionId: session._id });
      if (exist) {
        skippedSessions++;
        continue; // برو جلسه بعدی
      }

      // ثبت حضور مربی
      await CoachAttendance.create({ sessionId: session._id, coachId });
      processedSessions++;
    }

    // ✅ فقط یک بار از همه کاربران یک جلسه کم کن
    if (processedSessions > 0) {
      await ClassEnrollment.updateMany(
        { scheduleId, remainingSessions: { $gt: 0 } },
        { $inc: { remainingSessions: -1 } }
      );
    }

    res.status(200).json({
      success: true,
      message: `پردازش انجام شد: ${processedSessions} جلسه ثبت شد، ${skippedSessions} جلسه از قبل ثبت شده بود.`
    });
  } catch (error) {
    console.error("Error CoachAttendance:", error);
    res.status(500).json({ success: false, message: "خطا در ثبت حضور مربی" });
  }
};

