import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBodybuilding extends Document{
   packageName: string,
   durationDays: number,
   sessionCount: number,
   price: number ,
   discountPrice?: number,
   isActive: boolean
}

const bodybuildingSchema = new Schema<IBodybuilding>({
    packageName:{type: String , required: true},
    durationDays: {type: Number , required: true},
    sessionCount: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    isActive: { type: Boolean, default: true },
},{ timestamps: true }
)
export default mongoose.model<IBodybuilding>("Bodybuilding",bodybuildingSchema);