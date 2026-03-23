import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import './OrderReview.css';

const OrderReview = ({ onPlaceOrder }) => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth(); // ← Now using user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get saved data from localStorage
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    // Load saved data from localStorage
    const savedAddress = localStorage.getItem('shippingAddress');
    const savedPayment = localStorage.getItem('paymentMethod');
    
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    }
    if (savedPayment) {
      setPaymentMethod(savedPayment);
    }

    // Check if user is logged in
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleBack = () => {
    navigate('/checkout/payment');
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required data
      if (!shippingAddress.address || !paymentMethod) {
        setError('Missing shipping address or payment method');
        return;
      }

      // Prepare order items
      const orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        image: item.product.images?.[0]?.url
      }));

      // Create order data with user information
      const orderData = {
        orderItems,
        shippingAddress: {
          ...shippingAddress,
          userId: user?._id,        // ← Using user data
          userEmail: user?.email,    // ← Using user data
          userName: user?.name       // ← Using user data
        },
        paymentMethod,
        taxPrice: cart.tax || 0,
        shippingPrice: cart.shippingCost || 0,
        subtotal: cart.subtotal,
        totalPrice: cart.total,
        userId: user?._id,           // ← Using user data
        userEmail: user?.email,      // ← Using user data
        userName: user?.name         // ← Using user data
      };

      // Create order
      const response = await orderService.createOrder(orderData);
      
      // Clear cart and checkout data
      await clearCart();
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      localStorage.removeItem('cart');

      // Navigate based on payment method
      if (paymentMethod === 'stripe') {
        navigate(`/checkout/payment/${response.data._id}`);
      } else if (paymentMethod === 'paypal') {
        navigate(`/checkout/payment/${response.data._id}`);
      } else if (paymentMethod === 'mpesa') {
        navigate(`/checkout/payment/${response.data._id}`);
      } else {
        // Cash on delivery or other
        navigate(`/order-success/${response.data._id}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Format address for display
  const formatAddress = () => {
    const { address, city, state, zipCode, country } = shippingAddress;
    if (!address) return 'No address provided';
    return `${address}, ${city}, ${state} ${zipCode}, ${country}`;
  };

  // Get payment method display
  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'stripe':
        return { icon: 'fab fa-cc-stripe', name: 'Credit / Debit Card' };
      case 'paypal':
        return { icon: 'fab fa-paypal', name: 'PayPal' };
      case 'mpesa':
        return { icon: 'fas fa-mobile-alt', name: 'M-Pesa' };
      case 'cash':
        return { icon: 'fas fa-money-bill-wave', name: 'Cash on Delivery' };
      default:
        return { icon: 'fas fa-credit-card', name: 'Payment Method' };
    }
  };

  const paymentDisplay = getPaymentMethodDisplay();

  // Show loading state
  if (!shippingAddress.address) {
    return (
      <div className="order-review-loading">
        <div className="loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-review-container">
      <h2>Review Your Order</h2>

      {/* User Info Banner - NEW SECTION USING USER DATA */}
      {user && (
        <div className="user-info-banner">
          <i className="fas fa-user-circle"></i>
          <div className="user-info-details">
            <span className="user-name">Ordering as: <strong>{user.name}</strong></span>
            <span className="user-email">Email: {user.email}</span>
          </div>
        </div>
      )}

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
            <p><strong>{shippingAddress.fullName || user?.name || 'Customer'}</strong></p>
            <p>{formatAddress()}</p>
            <p className="phone">Phone: {shippingAddress.phone || user?.phone || 'Not provided'}</p>
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
              <i className={paymentDisplay.icon}></i>
              <span>{paymentDisplay.name}</span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="review-section">
          <h3>Order Items ({cart.items?.length || 0})</h3>
          <div className="order-items-list">
            {cart.items?.map((item) => (
              <div key={item._id} className="review-item">
                <div className="item-image">
                  <img 
                    src={item.product?.images?.[0]?.url || '/images/placeholder.jpg'} 
                    alt={item.product?.name}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.product?.name}</h4>
                  <p className="item-price">${item.price?.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity)?.toFixed(2)}
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
            <span>{cart.shippingCost > 0 ? `$${cart.shippingCost?.toFixed(2)}` : 'Free'}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${cart.tax?.toFixed(2)}</span>
          </div>
          {cart.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-${cart.discount?.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row total">
            <span>Total</span>
            <span>${cart.total?.toFixed(2)}</span>
          </div>
        </div>

        {error && <div className="order-error">{error}</div>}

        <div className="form-actions">
          <button onClick={handleBack} className="back-btn" disabled={loading}>
            Back to Payment
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading || cart.items?.length === 0}
            className="place-order-btn"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Placing Order...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>

      {/* Terms Agreement - NEW SECTION */}
      <div className="terms-agreement">
        <input type="checkbox" id="termsAgreement" required />
        <label htmlFor="termsAgreement">
          I agree to the <a href="/terms">Terms of Service</a> and 
          <a href="/privacy"> Privacy Policy</a>
        </label>
      </div>
    </div>
  );
};

export default OrderReview;