import { Request, Response } from 'express';
import ClassSchedule from './model/classSchedule.model';
import {z} from 'zod';
import { create } from 'domain';

const createClassScheduleSchema = z.object({
    title: z.string().min(1, 'عنوان الزامی است'),
    category: z.string().min(1, 'دسته بندی الزامی است'),
    coach: z.string().min(1, 'شناسه مربی الزامی است'),
    days: z
    .array(z.enum(['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri']))
    .nonempty('باید حداقل یک روز انتخاب شود'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت ساعت باید HH:MM باشد'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'فرمت ساعت باید HH:MM باشد'),
    capacity: z.number().min(1, 'ظرفیت باید حداقل ۱ باشد'),
    isActive:z.boolean().default(true),
    column: z.number().min(0),
    row: z.number().min(0),
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
        const { title,category ,coach,days,startTime,endTime,capacity,column,row,isActive} = parsed.data;
        const newSchedule = await ClassSchedule.create({title,category ,coach,days,startTime,endTime,capacity,column,row,isActive:true});
        res.status(201).json({success: true, data: newSchedule, message: 'برنامه جدید ساخته شد'})
    } catch (error) {
         console.error('Error creating class schedule:', error);
     res.status(500).json({ success: false, message: 'خطای سرور' });
     return
    }
}