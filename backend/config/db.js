import mongoose from "mongoose";

export const connectDb = async()=>{
    await mongoose.connect("mongodb+srv://sudaisman193:sudais0909@cluster0.nwibe6b.mongodb.net/food-delivery").then(()=>console.log("DB connected"));
}