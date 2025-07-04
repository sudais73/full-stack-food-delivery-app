import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

// login//

const login = async(req, res)=>{
const {email,password} = req.body;
try {
    const user = await userModel.findOne({email})
    if(!user){
        return res.json({success:false, msg:"User Doesn't exist"})
    }

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
    return res.json({success:false, msg:"Invalid Password"})
}

const token = createToken(user._id);

res.json({success:true, token})
} catch (error) {
      console.log(error)
     res.json({success:false, msg:"Error"})
}
}


const createToken = (id)=>{
return jwt.sign({id},process.env.JWT_SECRET)
}
// signup//

const signup = async (req,res)=>{
const{name,email,password} = req.body;

try {

    // checking for user exists or not//
    const existsUser = await userModel.findOne({email})
    if(existsUser){
        return res.json({success:false, msg:"User Exists with this email id"})
    }
// validating email and password//
if(!validator.isEmail(email)){
    return  res.json({success:false, msg:"Please enter a valid email"})
}

if(password.length<8){
    return  res.json({success:false, msg:"Password must be at least 8 character"})
}

// hashing user password//
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

const newUser = new userModel({
    name,
    email,
    password:hashedPassword
})
 const user = await newUser.save();

const token = createToken(user._id)
res.json({success:true, token})





} catch (error) {
    console.log(error)
     res.json({success:false, msg:"Error"})
}
}

export {login,signup}