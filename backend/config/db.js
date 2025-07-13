import mongoose from "mongoose";

export const connectDb = async()=>{
    await mongoose.connect(process.env.MONGODB_SECRET).then(()=>console.log("DB connected"));
}