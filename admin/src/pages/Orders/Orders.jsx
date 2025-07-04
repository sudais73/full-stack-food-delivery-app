import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets'

const Orders = ({url}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    "Food Processing",
    "Out for Delivery",
    "Delivered"
  ];

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success("Status updated successfully");
        await fetchAllOrders(); // Refresh the orders list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className='admin-orders-container'>
      <h2 className='admin-orders-title'>Orders Management</h2>
      
      {loading ? (
        <div className="loading-spinner">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">No orders found</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className={`order-card status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="order-header">
                <img src={assets.parcel_icon} alt="Order icon" className="order-icon" />
                <div>
                  <h3 className="order-id">Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <p className="order-date">
                    {new Date(order.data).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="order-details">
                <div className="customer-info">
                  <h4>{order.address.firstName} {order.address.lastName}</h4>
                  <p className="customer-phone">📱 {order.address.phone}</p>
                  <div className="customer-address">
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}</p>
                    <p>{order.address.country}, {order.address.zipcode}</p>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">× {item.quantity}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span>${calculateOrderTotal(order.items).toFixed(2)}</span>
                </div>

                <div className="status-control">
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className={`status-select status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {statusOptions.map((option) => (
                      <option 
                        key={option} 
                        value={option}
                        className={`status-option status-${option.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders