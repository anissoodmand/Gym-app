import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClassEnrollment extends Document {
  userId: Types.ObjectId;
  scheduleId: Types.ObjectId;
  sessionIds: Types.ObjectId[]; // جلساتی که کاربر توش ثبت‌نام کرده
  type: 'monthly' | 'single'; // نوع ثبت‌نام
  paid: boolean; // پرداخت انجام شده یا نه
  price: number;
}

const ClassEnrollmentSchema = new Schema<IClassEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'ClassSchedule', required: true },
    sessionIds: [{ type: Schema.Types.ObjectId, ref: 'ClassSession', required: true }],
    type: { type: String, enum: ['monthly', 'single'], required: true },
    paid: { type: Boolean, default: false },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IClassEnrollment>('ClassEnrollment', ClassEnrollmentSchema);
