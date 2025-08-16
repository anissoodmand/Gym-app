import { Request, Response } from 'express';
import ClassSchedule from '../model/classSchedule.model';
import {date, z} from 'zod';
import { create } from 'domain';
import { title } from 'process';
import moment from 'moment-jalaali';
import ClassSession from '../model/classSession.model'

const columnRowByDaySchema = z.object({
  day: z.enum(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
  column: z.number().min(0, 'مقدار ستون نامعتبر است'),
  row: z.number().min(0, 'مقدار سطر نامعتبر است'),
});
const createClassScheduleSchema = z.object({
    title: z.string().min(1, 'عنوان الزامی است'),
    category: z.string().min(1, 'دسته بندی الزامی است'),
    coach: z.string().min(1, 'شناسه مربی الزامی است'),
    coachId:z.string(),
    days:z.array(columnRowByDaySchema).nonempty('باید حداقل یک روز انتخاب شود'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت ساعت باید HH:MM باشد'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت ساعت باید HH:MM باشد'),
    capacity: z.number().min(1, 'ظرفیت باید حداقل ۱ باشد'),
    price:z.number(),
    isActive:z.boolean().default(true),
})

export const createClassSchedule = async (req:Request , res:Response): Promise<void> =>{
    try {
        const parsed = createClassScheduleSchema.safeParse(req.body);
        if(!parsed.success){
            res.status(400).json({ 
            success: false,
            message: 'ورودی نامعتبر است',
             errors: parsed.error.errors,
            })
            return
        }
        const { title,category ,coach,coachId,days,startTime,endTime,capacity,price, isActive} = parsed.data;
        const newSchedule = await ClassSchedule.create({title,category ,coach,coachId,days,startTime,endTime,capacity,price, isActive:true});
        res.status(201).json({success: true, data: newSchedule, message: 'برنامه جدید ساخته شد'})
    } catch (error) {
         console.error('Error creating class schedule:', error);
     res.status(500).json({ success: false, message: 'خطای سرور' });
     return
    }
}

export const getAllClasses = async(req:Request , res:Response) =>{
    try {
        const classes = await ClassSchedule.find();
        if(!classes || classes.length === 0){
            res.status(404).json({success: false , message: "هیچ کلاسی یافت نشد!"});
            return
        }

        res.status(200).json({success: true ,total: classes.length , message: "تمامی کلاس ها: " , data: classes});
        return
    } catch (error) {
         res.status(500).json({ success: false, message: 'خطای سرور' });
         return
    }
}

export const getClassInfoById = async(req:Request , res:Response) =>{
    try {
        const {id} = req.params;
        const myClass = await ClassSchedule.findById(id);
        if(!myClass){
             res.status(404).json({success: false , message: "!کلاس مورد نظر یافت نشد"});
            return
        }
          res.status(200).json({success: true , message: " اطلاعات کلاس مورد نظر شما" , data: myClass});
        return
    } catch (error) {
         res.status(500).json({ success: false, message: 'خطای سرور' });
         return
    }
}

export const updateClass = async(req:Request , res:Response) =>{
    try {
      const {id} = req.params;
       
        const MyUpdate = req.body;
        
        const myClass = await ClassSchedule.findByIdAndUpdate(id , MyUpdate ,{
            new: true,
            runValidators: true
        });

        if(!myClass){
            res.status(404).json({message: "class not found"})
            return;
        }
        res.status(200).json({message: "class update successfully" , data: myClass})
        return;
    } catch (error) {
         res.status(500).json({ success: false, message: '-خطای سرور' });
         return
    }
}

export const deleteClass = async(req:Request , res:Response) =>{
    try {
         const {id} = req.params;
        const deletedClass = await ClassSchedule.findByIdAndDelete(id);
        if(!deleteClass){
           res.status(404).json({success: false , message: "!کلاس مورد نظر یافت نشد"});
            return  
        }
          res.status(200).json({success: true , message: "کلاس با موفقیت حذف شد "});
        return
    } catch (error) {
         res.status(500).json({ success: false, message: '-خطای سرور' });
         return
    }
}

export const getRemainingCapacity = async (req: Request, res: Response) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await ClassSchedule.findById(scheduleId);
    if (!schedule) {
       res.status(404).json({ success: false, message: 'برنامه کلاس پیدا نشد' });
       return
    }

    const today = moment().format('YYYY-MM-DD');

    const sessions = await ClassSession.find({
      scheduleId,
      date: { $gte: today },
      isCanceled: false,
    });

    const capacity = schedule.capacity;
    const totalSessions = sessions.length;

    const remainingPerSession = sessions.map(s => capacity - s.registeredUsers.length);

    const minRemaining = Math.min(...remainingPerSession);
    const avgRemaining = Math.round(
      remainingPerSession.reduce((a, b) => a + b, 0) / totalSessions
    );

    res.status(200).json({
      success: true,
      totalSessions,
      classCapacity: capacity,
      minRemaining,
      //avgRemaining,
    });
  } catch (error) {
    console.error('خطا در دریافت ظرفیت کلاس:', error);
    res.status(500).json({ success: false, message: 'خطای سرور در بررسی ظرفیت' });
  }
};
