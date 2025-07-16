import { Request, Response } from 'express';
import ClassSchedule from './model/classSchedule.model';
import {date, z} from 'zod';
import { create } from 'domain';
import { title } from 'process';

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

export const getAllClasses = async(req:Request , res:Response) =>{
    try {
        const classes = await ClassSchedule.find();
        if(!classes || classes.length === 0){
            res.status(404).json({success: false , message: "هیچ کلاسی یافت نشد!"});
            return
        }
          const allClasses = classes.map(cls => ({
            title : cls.title,
            category: cls.category,
            coach: cls.coach,
            days: cls.days,
            startTime: cls.startTime,
            endTime: cls.endTime,
            capacity: cls.capacity,
            isActive: cls.isActive,
            column: cls.column,
             row: cls. row
          }));
        res.status(200).json({success: true , message: "تمامی کلاس ها: " , data: allClasses});
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