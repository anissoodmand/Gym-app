import mongoose,{ Schema , Document} from "mongoose";

export interface ICoach extends Document{
    name: string;
    phone: string;
    password: string;
   category: 'کراس فیت' | "پیلاتس"| "فیتنس"| "آمادگی جسمانی"| "ایروبیک";
   presence: boolean;
}

const coachSchema: Schema = new Schema({
    name: {type: String , required: true},
    phone: {type: String , required: true , unique:true},
    password: { type: String, required: true },
    category: { type: String, required: true },
    presence:{ type: Boolean , default : false},
});
export default mongoose.model<ICoach>('Coach', coachSchema);