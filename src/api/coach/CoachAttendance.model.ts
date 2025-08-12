import mongoose, { Schema, Document, Types } from "mongoose";

interface ICoachAttendance extends Document {
  sessionId: Types.ObjectId; // رفرنس به جلسه
  coachId: Types.ObjectId; // مربی
  date: Date;
}

const coachAttendanceSchema = new Schema<ICoachAttendance>({
  sessionId: { type: Schema.Types.ObjectId, ref: "ClassSession", required: true },
  coachId: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
  date: { type: Date, default: Date.now }
});
export default mongoose.model<ICoachAttendance>('CoachAttendance', coachAttendanceSchema);
