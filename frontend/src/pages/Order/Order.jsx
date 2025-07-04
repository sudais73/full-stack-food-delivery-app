import React, { useContext } from 'react'
import './Order.css'
import { StoreContext } from '../../Context/StoreContext'
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
const Order = () => {
  const{getTotalCartAmount,token,food_list,cartItems, url} = useContext(StoreContext);

  // const navigate = useNavigate()
  // console.log(food_list)
const[data, setData] = useState({
  firstName:"",
  lastName:"",
  email:"",
  street:"",
  city:"",
  state:"",
  zipcode:"",
  country:"",
  phone:"",

})

const onChangeHandler =(e)=>{
    const name= e.target.name
    const value = e.target.value
    setData(data=>({...data,[name]:value}))
}
  
// const placeOrder = async(e) => {
//     e.preventDefault(); // Corrected typo here ('PreventDefault' -> 'preventDefault')
    
//     let orderItems = [];

//     food_list.forEach((item) => { // Changed map to forEach since we're not using the returned array
//         if (cartItems[item._id] > 0) {
//             let itemInfo = { ...item }; // Create a copy to avoid modifying original object
//             itemInfo["quantity"] = cartItems[item._id];
//             orderItems.push(itemInfo);
//         }
//     });
    
  
//     let orderData = {
//       address:data,
//       items:orderItems,
//       amount:getTotalCartAmount()+10
//     }

//     let response = await axios.post(`${url}/api/order/add`, orderData, {headers:{token}});
//     if (response.data.success) {
//             const { session_url } = response.data;
//             // Ensure the URL is valid before redirecting
//             if (session_url && session_url.startsWith('https://checkout.stripe.com')) {
//                 window.location.replace(session_url);
//             } else {
//                 throw new Error("Invalid payment URL");
//             }
//         } else {
//             alert("Error")
//         }

//       console.log(response)
//     // You'll likely want to send orderItems to your backend here
// }

const placeOrder = async (e) => {
    e.preventDefault();
    
    // Validate cart isn't empty
    if (Object.keys(cartItems).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Validate address data exists
    if (!data || !data.street || !data.city || !data.country) {
        alert("Please fill in all address fields");
        return;
    }

    try {
        // Prepare order items
        let orderItems = [];
        let totalAmount = 0;

        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                const itemInfo = { 
                    ...item,
                    quantity: cartItems[item._id]
                };
                orderItems.push(itemInfo);
                totalAmount += item.price * cartItems[item._id];
            }
        });

        // Add delivery charge
        const DELIVERY_CHARGE = 10;
        totalAmount += DELIVERY_CHARGE;

        const orderData = {
            
            address: data,
            items: orderItems,
            amount: totalAmount
        };

        // Send to backend
        const response = await axios.post(`${url}/api/order/add`, orderData, {
            headers: { token }
        });

        if (!response.data.success) {
            throw new Error(response.data.msg || "Order failed");
        }

        // Handle Stripe redirect
        const { session_url } = response.data;
        if (session_url?.startsWith('https://checkout.stripe.com')) {
            window.location.replace(session_url);
        } else {
            throw new Error("Invalid payment gateway URL");
        }

    } catch (error) {
        console.error("Order error:", error);
        alert(error.response?.data?.msg || error.message || "Order failed");
    }
};

  return (
    <form onSubmit={placeOrder} className='order'>
      <div className="order-left">
        <p className='title'>Delivery Information</p>
          <div className="multi-fields">
            <input required onChange={onChangeHandler} name='firstName' value={data.firstName} type="text" placeholder='First Name'/>
            <input required onChange={onChangeHandler} name='lastName' value={data.lastName} type="text" placeholder='Last Name'/>
          </div>
          <input required onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email Address' />
          <input required onChange={onChangeHandler} name='street' value={data.street} type="text" placeholder='Street' />

             <div className="multi-fields">
            <input required onChange={onChangeHandler} name='city' value={data.city} type="text" placeholder='City '/>
            <input required onChange={onChangeHandler} name='state' value={data.state} type="text" placeholder=' State'/>
          </div>

             <div className="multi-fields">
            <input required onChange={onChangeHandler} name='zipcode' value={data.zipcode} type="text" placeholder='Zip code'/>
            <input required onChange={onChangeHandler} name='country' value={data.country} type="text" placeholder='Country'/>
          </div>

          <input required onChange={onChangeHandler} name='phone' value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="order-right">
           <div className="cart-totals">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-totals-details">
                <p>SubTotal</p>
                <p>${getTotalCartAmount()}</p>
                 </div>
                 <hr />
              <div className="cart-totals-details">
                  <p>Delivery Fee</p>
                  <p>${getTotalCartAmount()===0?0:10}</p>
              </div>
              <hr />
              <div className="cart-totals-details">
                    <p>Total</p>
                    <p>${getTotalCartAmount()===0?0: getTotalCartAmount()+10}</p>
              </div>
            </div>
              <button type='submit'>PROCEED TO CHECKOUT</button>

          </div>

      </div>
    </form>
  )
}

export default Order
