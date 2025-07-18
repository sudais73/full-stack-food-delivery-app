import foodModel from "../models/foodModels.js";
import fs from 'fs'
// add food item//

const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename

    })
    try {
        await food.save();
        res.json({ success: true, msg: "Food Added Successfully" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, msg: "Error" })
    }

}


// All food list//

const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({})
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, msg: "Error" })
    }
}

// remove from db//
const removeFood =async (req,res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`,()=>{})
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, msg:"Food Removed Successfully"})
    } catch (error) {
         console.log(error.message)
        res.json({ success: false, msg: "Error" })
    }
}


export { addFood, listFood, removeFood}