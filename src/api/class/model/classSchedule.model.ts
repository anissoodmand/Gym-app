import mongoose,{ Schema , Document} from "mongoose";

export interface IClassSchedule extends Document{
    title : string;
    category: 'کراس فیت' | "پیلاتس"| "فیتنس"| "آمادگی جسمانی"| "ایروبیک";
    coach: string;
    days: ('شنبه' | 'یک‌شنبه' | 'دوشنبه' | 'سه‌شنبه' | 'چهارشنبه' | 'پنج‌شنبه' | 'جمعه')[];
    startTime: string;
    endTime: string;
    capacity: number;
    isActive: boolean;
    column: number;
    row: number;
}


const ClassScheduleSchema = new Schema<IClassSchedule>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    coach: { type: String, required: true },
    days: [{ type: String, required: true }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    capacity: { type: Number, required: true },

    isActive: { type: Boolean, default: true },
    column: { type: Number, required: true },
    row: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IClassSchedule>('ClassSchedule', ClassScheduleSchema);