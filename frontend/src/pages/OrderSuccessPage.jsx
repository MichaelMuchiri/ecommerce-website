import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import orderService from '../services/orderService';
import Loader from '../components/common/Loader';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderService.getOrderById(id);
        setOrder(response.data);
      } catch (error) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-success-loading">
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-error">
        <h2>Error</h2>
        <p>{error || 'Order not found'}</p>
        <Link to="/" className="home-link">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-header">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been placed successfully</p>
      </div>

      <div className="order-details">
        <div className="order-info">
          <div className="info-row">
            <span>Order Number:</span>
            <strong>#{order.invoiceNumber || order._id.slice(-8)}</strong>
          </div>
          <div className="info-row">
            <span>Order Date:</span>
            <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
          </div>
          <div className="info-row">
            <span>Payment Method:</span>
            <strong className="payment-method">
              {order.paymentMethod === 'stripe' && (
                <>
                  <i className="fab fa-cc-stripe"></i>
                  Credit Card
                </>
              )}
              {order.paymentMethod === 'paypal' && (
                <>
                  <i className="fab fa-paypal"></i>
                  PayPal
                </>
              )}
              {order.paymentMethod === 'mpesa' && (
                <>
                  <i className="fas fa-mobile-alt"></i>
                  M-Pesa
                </>
              )}
              {order.paymentMethod === 'cash' && (
                <>
                  <i className="fas fa-money-bill-wave"></i>
                  Cash on Delivery
                </>
              )}
            </strong>
          </div>
          <div className="info-row">
            <span>Order Status:</span>
            <strong className={`status ${order.orderStatus}`}>
              {order.orderStatus.toUpperCase()}
            </strong>
          </div>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {order.orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                </div>
                <span className="item-price">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            {order.discountPrice > 0 && (
              <div className="total-row discount">
                <span>Discount:</span>
                <span>-${order.discountPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="shipping-info">
          <h3>Shipping Address</h3>
          <div className="address">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            <p className="phone">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      <div className="success-actions">
        <Link to="/shop" className="continue-shopping-btn">
          Continue Shopping
        </Link>
        <Link to="/dashboard" className="view-orders-btn">
          View My Orders
        </Link>
      </div>

      <div className="email-notice">
        <i className="fas fa-envelope"></i>
        <p>A confirmation email has been sent to your email address</p>
      </div>
    </div>
  );
};

export default OrderSuccessPage;