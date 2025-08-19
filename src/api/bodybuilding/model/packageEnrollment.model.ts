import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPackageEnroll extends Document{
    packageId : Types.ObjectId;
    userId : Types.ObjectId;
    coachId?: Types.ObjectId;
    startDate : Date;
    expireTime: Date;
    remainingSessions: number;
}

const packageEnrollmentSchema = new Schema<IPackageEnroll>(
{
    packageId: {type: Schema.Types.ObjectId, ref: 'Bodybuilding', required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coachId: {type: Schema.Types.ObjectId, ref: 'Coach'},
    startDate:  {type: Date , required: true ,default: Date.now },
    expireTime: {type: Date , required: true  },
    remainingSessions: { type: Number, required: true,}
}
)
export default mongoose.model<IPackageEnroll>("PackageEnrollment" , packageEnrollmentSchema);