import { Request, Response } from 'express';
import Bodybuilding from '../model/bodybuilding.model';

export const createPackage = async(req:Request , res:Response) =>{
    try {
       const{packageName,durationDays,sessionCount,price,isActive} = req.body;
       
       const newPackage = await Bodybuilding.create({
        packageName,durationDays,sessionCount,price,isActive:true
       })
       res.status(201).json({success: true, data:newPackage , message: "New bodybuilding package create successfully"})
    } catch (error) {
        console.error('Error creating bodybuilding package:', error);
     res.status(500).json({ success: false, message: '@@@@@@@خطای سرور' });
     return
    }
}

export const getAllPackages = async(req:Request , res:Response) =>{
    try {
        const packages = await Bodybuilding.find();
        if(!packages){
             res.status(404).json({success: false, message: "هیچ پکیجی برای بدنسازی یافت نشد"})
        return;
        }
         res.status(200).json({success: true,total :packages.length , message:"اطلاعات همه پکیج های بدنسازی: " ,packages})
    return;
    } catch (error) {
             console.error('Error package:', error);
     res.status(500).json({ success: false, message: '@@@@@@@خطای سرور' });
     return
    }
}