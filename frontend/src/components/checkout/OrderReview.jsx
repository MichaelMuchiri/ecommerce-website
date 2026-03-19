import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import './OrderReview.css';

const OrderReview = ({ onPlaceOrder }) => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get saved data from localStorage
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
  const paymentMethod = localStorage.getItem('paymentMethod') || 'stripe';

  const handleBack = () => {
    navigate('/checkout/payment');
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      // Prepare order items
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        image: item.product.images?.[0]?.url
      }));

      // Create order data
      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice: cart.tax || 0,
        shippingPrice: cart.shippingCost || 0,
        subtotal: cart.subtotal,
        totalPrice: cart.total
      };

      // Create order
      const response = await orderService.createOrder(orderData);
      
      // Clear cart and checkout data
      await clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');

      // Navigate to payment processing
      if (paymentMethod === 'stripe') {
        navigate(`/checkout/payment/${response.data._id}`);
      } else if (paymentMethod === 'paypal') {
        navigate(`/checkout/payment/${response.data._id}`);
      } else if (paymentMethod === 'mpesa') {
        navigate(`/checkout/payment/${response.data._id}`);
      } else {
        // Cash on delivery
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-review-container">
      <h2>Review Your Order</h2>

      <div className="review-sections">
        {/* Shipping Address */}
        <div className="review-section">
          <div className="section-header">
            <h3>Shipping Address</h3>
            <button onClick={handleBack} className="edit-btn">
              Edit
            </button>
          </div>
          <div className="section-content">
            <p>{shippingAddress.address}</p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
            <p>{shippingAddress.country}</p>
            <p className="phone">Phone: {shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="review-section">
          <div className="section-header">
            <h3>Payment Method</h3>
            <button onClick={handleBack} className="edit-btn">
              Edit
            </button>
          </div>
          <div className="section-content">
            <p className="payment-method-display">
              {paymentMethod === 'stripe' && <i className="fab fa-cc-stripe"></i>}
              {paymentMethod === 'paypal' && <i className="fab fa-paypal"></i>}
              {paymentMethod === 'mpesa' && <i className="fas fa-mobile-alt"></i>}
              {paymentMethod === 'cash' && <i className="fas fa-money-bill-wave"></i>}
              <span>
                {paymentMethod === 'stripe' && 'Credit / Debit Card'}
                {paymentMethod === 'paypal' && 'PayPal'}
                {paymentMethod === 'mpesa' && 'M-Pesa'}
                {paymentMethod === 'cash' && 'Cash on Delivery'}
              </span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="review-section">
          <h3>Order Items</h3>
          <div className="order-items-list">
            {cart.items.map((item) => (
              <div key={item._id} className="review-item">
                <div className="item-image">
                  <img 
                    src={item.product?.images?.[0]?.url || '/images/placeholder.jpg'} 
                    alt={item.product?.name}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.product?.name}</h4>
                  <p className="item-price">${item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${item.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="review-section summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cart.subtotal?.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{cart.shippingCost > 0 ? `$${cart.shippingCost.toFixed(2)}` : 'Free'}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${cart.tax?.toFixed(2)}</span>
          </div>
          {cart.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-${cart.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>${cart.total?.toFixed(2)}</span>
          </div>
        </div>

        {error && <div className="order-error">{error}</div>}

        <div className="form-actions">
          <button onClick={handleBack} className="back-btn">
            Back to Payment
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || cart.items.length === 0}
            className="place-order-btn"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;