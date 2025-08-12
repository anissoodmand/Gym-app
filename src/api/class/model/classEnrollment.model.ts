import mongoose, { Schema, Document, Types, Date } from 'mongoose';

export interface IClassEnrollment extends Document {
  userId: Types.ObjectId;
  scheduleId: Types.ObjectId;
  sessionIds: Types.ObjectId[]; // جلساتی که کاربر توش ثبت‌نام کرده
  type: 'monthly' | 'single'; // نوع ثبت‌نام
  paid: boolean; // پرداخت انجام شده یا نه
  price: number;
  expireTime : Date;
  coachId: Types.ObjectId;
  remainingSessions: number;
}

const ClassEnrollmentSchema = new Schema<IClassEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'ClassSchedule', required: true , index: true},
    sessionIds: [{ type: Schema.Types.ObjectId, ref: 'ClassSession', required: true }],
    type: { type: String, enum: ['monthly', 'single'], default: 'monthly' },
    paid: { type: Boolean, default: false },
    price: { type: Number, required: true },
    expireTime: {type: Date , required: true  },
    coachId: {type: Schema.Types.ObjectId, ref: 'Coach', required: true},
    remainingSessions: { type: Number, required: true, default: 12 }
  },
  { timestamps: true }
);

export default mongoose.model<IClassEnrollment>('ClassEnrollment', ClassEnrollmentSchema);
