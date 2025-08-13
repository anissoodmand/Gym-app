import mongoose,{ Schema , Document, Types} from "mongoose";
export interface ColumnRowByDay {
  day: "شنبه"|"یک شنبه"|"دو شنبه"|"سه شنبه"|"چهار شنبه"|"پنج شنبه"|"جمعه";
  column: number;
  row: number;
}
export interface IClassSchedule extends Document{
    title : string;
    category: 'کراس فیت' | "پیلاتس"| "فیتنس"| "آمادگی جسمانی"| "ایروبیک";
    coach: string;
    coachId: Types.ObjectId;
    days: ColumnRowByDay[];
    startTime: string;
    endTime: string;
    capacity: number;
     price: number;
    isActive: boolean;
}
const columnRowByDaySchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه" ,"جمعه"],
    },
    column: { type: Number, required: true },
    row: { type: Number, required: true },
  },
  { _id: false }
);


const ClassScheduleSchema = new Schema<IClassSchedule>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    coach: { type: String, required: true },
    coachId: {type: Schema.Types.ObjectId, ref: 'Coach', required: true},
    days:  [columnRowByDaySchema],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    capacity: { type: Number, required: true },
     price: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IClassSchedule>('ClassSchedule', ClassScheduleSchema);