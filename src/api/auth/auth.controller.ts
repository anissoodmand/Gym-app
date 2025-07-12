import { Request, Response } from "express";
import User from "../user/user.model";
import bcrypt from 'bcrypt';
import {z} from 'zod';
import jwt from 'jsonwebtoken';


const registerUserSchema = z.object({
    name : z.string().min(3 , "name is required AMO JON"),
    phone : z.string().regex(/^09\d{9}$/,"this phone number is invalid"),
    password: z.string().min(6, "password should be 6 char and more")
});

export const registerUser = async (req:Request , res: Response) =>{
try {
    const validatedData = registerUserSchema.parse(req.body);
    const {name , phone , password} = validatedData;
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'این شماره قبلاً ثبت شده است' });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password , 10);
    const user = await User.create({...validatedData , password: hashedPassword});
    res.status(201).json({success: true, message: 'ثبت نام کاربر با موفقیت انجام شد', user})
} catch (error:any) {
      if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'خطای داخلی سرور' });
  }
}


export const loginUser = async(req:Request , res: Response) =>{
  try {
    const {phone , password} = req.body;
    const user = await User.findOne({phone});
    if(!user){
      res.status(404).json({success:false,  message: "کاربر یافت نشد، لطفا ثبت نام کنید"})
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      res.status(401).json({success:false, message: "نام کاربری یا رمزعبور اشتباه است"});
      return;
    }
    const token = jwt.sign(
     { id: user._id, phone: user.phone},
     process.env.JWT_SECRET!,
     {expiresIn: '24h'}
    );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // فقط در HTTPS در حالت production
    sameSite: "none", // یا "Strict" یا "None" بر اساس نیاز
    maxAge: 1000 * 60 * 60 * 24 // یک روز
  })
  console.log("Set-Cookie header:", res.getHeader("Set-Cookie"));
  res.status(200)
  .json({ success: true, message: "شما وارد شدید ، خوش آمدید" });
 


  } catch (error:any) {
    res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
}