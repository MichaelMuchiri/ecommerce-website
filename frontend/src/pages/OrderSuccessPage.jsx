import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../services/api';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await API.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="order-success-loading">Loading order details...</div>;
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been placed successfully.</p>
        
        <div className="order-details">
          <p><strong>Order Number:</strong> #{order?.id}</p>
          <p><strong>Total Amount:</strong> ${order?.total?.toFixed(2)}</p>
          <p><strong>Status:</strong> <span className="status-pending">{order?.status}</span></p>
        </div>
        
        <div className="success-actions">
          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
          <Link to="/dashboard" className="view-orders">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;