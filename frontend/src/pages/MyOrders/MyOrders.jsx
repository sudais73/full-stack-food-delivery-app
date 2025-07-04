import React from "react";
import "./MyOrders.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } }
    );

    if (response.data.success) {
      setData(response.data.data);
      console.log(response.data.data);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div>
    
    <div className="orders-container">
  {/* Grand Totals Section */}
  {data.length > 0 && (
    <div className="orders-summary">
      <h3>Order Summary</h3>
      <p>
        Total Orders: <strong>{data.length}</strong> | 
        Total Items: <strong>
          {data.reduce((total, order) => 
            total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0)}
        </strong> | 
        Grand Total: <strong>$
          {data.reduce((total, order) => total + order.amount, 0).toFixed(2)}
        </strong>
      </p>
    </div>
  )}

  {/* Orders List */}
  {data.length > 0 ? (
    data.map((order) => {
      const orderItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      return (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <img 
              src={assets.parcel_icon} 
              alt="Order icon" 
              className="order-icon"
            />
            <div>
              <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
              <p className="order-meta">
                
                {orderItemCount} item{orderItemCount !== 1 ? 's' : ''} • 
                ${order.amount.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item._id} className="order-item">
                <span>{item.name}</span>
                <span>{item.quantity} × ${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${(order.amount - 10).toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Delivery:</span>
              <span>$10.00</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Paid:</span>
              <span>${order.amount.toFixed(2)}</span>
             
            </div>
            <div className="total-row grand-total">
              <span>Status:{order.status}</span>
              <p style={{cursor:"pointer", color:"tomato"}} onClick={fetchOrders()}>Track Order</p>
            </div>
             
          </div>
        </div>
      );
    })
  ) : (
    <div className="empty-orders">
      <p>No orders found</p>
    </div>
  )}
</div>
    </div>
  );
};

export default MyOrders;
