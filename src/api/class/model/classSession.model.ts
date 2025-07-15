import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClassSession extends Document {
 scheduleId: Types.ObjectId;
 date: string;
 registeredUsers: Types.ObjectId[];
 isCanceled: boolean;   
}

const ClassSessionSchema = new Schema<IClassSession>(
    {
        scheduleId: {type: Schema.Types.ObjectId , ref: "ClassSchedule" ,required: true},
         date: { type: String, required: true },
         registeredUsers: [{type: Schema.Types.ObjectId , ref: "User" }],
          isCanceled: { type: Boolean, default: false }
  },
  { timestamps: true }
);
export default mongoose.model<IClassSession>("ClassSession", ClassSessionSchema)