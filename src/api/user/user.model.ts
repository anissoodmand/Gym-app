import mongoose,{ Schema , Document} from "mongoose";

export interface IUser extends Document{
    name: string;
    phone: string;
    password: string;
    role : "admin" | "user"| "coach";
    status: "active" | "pending";
}

const userSchema: Schema = new Schema({
    name: {type: String , required: true},
    phone: {type: String , required: true , unique:true},
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user" ,"coach"], default: "user" },
    status: { type: String, enum: ['active', 'pending'], default: 'active' },
});

const User = mongoose.model<IUser>("User" , userSchema);
export default User;