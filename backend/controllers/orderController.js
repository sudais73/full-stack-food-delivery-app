import orderModel from "../models/orderModel.js";
import  userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// placing user order for frontend//

// const placeOrder = async(req,res)=>{
//     const frontend_url = "http://localhost:5173"
// try {
//     const newOrder = new orderModel({
//         userId:req.body.userId,
//         items:req.body.items,
//         amount:req.body.amount,
//         address:req.body.address,


//     })

//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
//  const line_items = req.body.items.map((item)=>({
// price_data:{
//     currency:"usd",
//     product_data:{
//         name:item.name
//     },
//     unit_amount:item.price*100
// },
// quantity:item.quantity
//  }))

//  line_items.push({
//     price_data:{
//         currency:"usd",
//       product_data:{
//         name:"Delivery Charges"
//     },
//      unit_amount:10*100,
//     },
   
//     quantity:1
//  })

//  const session = await stripe.checkout.sessions.create({
//     line_items:line_items,
//     mode:"payment",
//     success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//     cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//  })
// res.json({success:true, session_url:session.url})
// } catch (error) {
//     console.log(error)
//     res.json({success:false, msg:"Error"})
// }
// }

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    
    try {
        // Validate required fields
        const requiredFields = ['userId', 'items', 'amount', 'address'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({
                    success: false,
                    msg: `Missing required field: ${field}`
                });
            }
        }

        // Validate items array
        if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Invalid items in cart"
            });
        }

        // Recalculate amount to prevent manipulation
        const calculatedAmount = req.body.items.reduce((total, item) => {
            if (!item.price || !item.quantity) {
                throw new Error("Invalid item format");
            }
            return total + (item.price * item.quantity);
        }, 0);

        const DELIVERY_CHARGE = 10;
        const totalAmount = calculatedAmount + DELIVERY_CHARGE;

        // Create new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: totalAmount,
            address: req.body.address,
            status: "pending",
            createdAt: new Date()
        });

        await newOrder.save();
        
        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, {
            cartData: {}
        });

        // Prepare Stripe line items
        const line_items = req.body.items.map(item => ({
            price_data: {
                currency: "usd",
                product_data: { 
                    name: item.name,
                    metadata: {
                        productId: item._id
                    }
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        // Add delivery charge
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: { name: "Delivery Charges" },
                unit_amount: DELIVERY_CHARGE * 100
            },
            quantity: 1
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            // customer_email: req.user.email, // If you have user email
            metadata: {
                orderId: newOrder._id.toString()
            }
        });

        res.json({
            success: true,
            session_url: session.url
        });

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({
            success: false,
            msg: error.message || "Order processing failed"
        });
    }
};

const verifyOrder = async(req,res)=>{
const{orderId, success} = req.body;
try {
    if(success==="true"){
        await orderModel.findByIdAndUpdate(orderId, {payment:true});
        res.json({success:true, msg:"Paid"})
    }else{
        await orderModel.findByIdAndDelete(orderId)
        res.json({success:false,msg:"Not Paid"})
    }
} catch (error) {
     console.error( error);
        res.status(500).json({
            success: false,
            msg: error.message || "failed"
        });
}
}

// user orders for frontend//
const userOrders = async(req,res)=>{
try {
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true, data:orders})
} catch (error) {
     console.error( error);
        res.status(500).json({
            success: false,
            msg: error.message || "failed"
        });
}
}

// getting all orders for admin page//

const listOrders = async(req,res)=>{
try {
    const orders = await orderModel.find({});
    res.json({success:true, data:orders})
} catch (error) {
     console.error( error);
        res.status(500).json({
            success: false,
            msg: error.message || "failed"
        });
}
}

// api for updating order status//

const updateStatus = async(req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status})
    res.json({success:true, msg:"Status Updated"})
  } catch (error) {
     console.error( error);
        res.status(500).json({
            success: false,
            msg: error.message || "failed"
        });
  }

}


export  {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}