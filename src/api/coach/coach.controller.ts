import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import Coach from './coach.model';


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