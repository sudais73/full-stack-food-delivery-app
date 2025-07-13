import React from 'react'
import './Cart.css'
import { useContext } from 'react'
import { StoreContext } from './../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
const Cart = () => {
  
  const{food_list,cartItems,removeFromCart,getTotalCartAmount,url} = useContext(StoreContext)
const navigate = useNavigate()
  return (
    <div className='cart'>
      <div className="cart-items">
         <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Totals</p>
          <p>Remove</p>
         </div>
         <br />
         <hr />
         {food_list.map((item,index)=>{
          if(cartItems[item._id]>0){
            return (
              <>
              <div key={index} className="cart-items-title cart-items-item">
                <img src={`${url}/images/${item.image}`} alt="" />
                     <p>{item.name}</p> 
                     <p>${item.price}</p>
                     <p>{cartItems[item._id]}</p>
                     <p>${item.price*cartItems[item._id]}</p>
                     <p className='cross' onClick={()=>removeFromCart(item._id)}>X</p>
              </div>
              <hr />
              </>
            )
          }
         })}
         </div>

         <div className="cart-bottom">
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
              <button onClick={()=>navigate("/order")}> <span onClick={()=>scrollTo(0,0)}>PROCEED TO CHECKOUT</span> </button>

          </div>

          <div className="cart-promo-code">
            <div>
              <p>If you have promo code , Enter it here</p>
              <div className="cart-promo-code-input">
                <input type="text" placeholder='Promo code' />
                <button>Submit</button>
              </div>
            </div>
          </div>
         </div>
    </div>
  )
}

export default Cart
