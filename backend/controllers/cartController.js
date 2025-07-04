import userModel from "./../models/userModel.js";
// add items to user cart//

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, msg: "Food Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Error" });
  }
};

//remove items from users cart/

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    let cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, msg: "Food Removed from Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Error" });
  }
};

// fetch user cart data//

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    res.json({ success: true,  
      cartData});
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: "Error" });
  }
};


// const getCart = async (req, res) => {
//   try {
//     const userData = await userModel.findById(req.user.id);
//     if (!userData) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }

//     res.json({ 
//       success: true, 
//       data: { cartData: userData.cartData || {} } // Ensure cartData is never null
//     });
//   } catch (error) {
//     console.error("Cart fetch error:", error);
//     res.status(500).json({ 
//       success: false, 
//       msg: "Internal server error",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined
//     });
//   }
// };

export { addToCart, removeFromCart, getCart };
