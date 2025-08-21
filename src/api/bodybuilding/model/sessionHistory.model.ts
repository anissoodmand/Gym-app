import mongoose, { Schema, Document } from "mongoose";

export interface ISessionHistory extends Document {
  enrollmentId: mongoose.Types.ObjectId; // به کدوم اشتراک وصله
  userId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  usedAt: Date; // تاریخ ثبت حضور
}

const sessionHistorySchema = new Schema<ISessionHistory>(
  {
    enrollmentId: { type: Schema.Types.ObjectId, ref: "PackageEnrollment", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coachId: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model<ISessionHistory>("SessionHistory" , sessionHistorySchema);

