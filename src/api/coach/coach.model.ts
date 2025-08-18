import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICoach extends Document{
    name: string;
    phone: string;
    password: string;
   category: 'کراسفیت' | "پیلاتس"| "فیتنس"| "آمادگی جسمانی"| "ایروبیک";
   presence: boolean;
    scheduleId: Types.ObjectId;
    userId: Types.ObjectId;
}

const coachSchema: Schema = new Schema({
    name: {type: String , required: true},
    phone: {type: String , required: true , unique:true},
    password: { type: String, required: true },
    category: { type: String, required: true },
    presence:{ type: Boolean , default : false},
    scheduleId: { type: Schema.Types.ObjectId, ref: 'ClassSchedule', },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
});
export default mongoose.model<ICoach>('Coach', coachSchema);