import mongoose from "mongoose";

const mongo_URI = process.env.MONGO_URI as string;

export const connectDB = async () =>{
    try {
        await mongoose.connect(mongo_URI);
        console.log("✅ Database connected successfully")
    } catch (error) {
        console.log("❌ Database connection failed:" , error);
        // process.exit(1);
    }
}