import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClassSession extends Document {
 scheduleId: Types.ObjectId;
 date: Date;
 registeredUsers: Types.ObjectId[];
 isCanceled: boolean;  
 startTime : string;
 endTime: string; 
}

const ClassSessionSchema = new Schema<IClassSession>(
    {
        scheduleId: {type: Schema.Types.ObjectId , ref: "ClassSchedule" ,required: true},
        date: { type: Date, required: true },
        registeredUsers: [{type: Schema.Types.ObjectId , ref: "User" }],
        isCanceled: { type: Boolean, default: false },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
  },
  { timestamps: true }
);
export default mongoose.model<IClassSession>("ClassSession", ClassSessionSchema)