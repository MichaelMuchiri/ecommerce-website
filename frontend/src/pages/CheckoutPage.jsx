import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Kenya',
    phone: ''
  });
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Form errors
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items?.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingAddress.fullName) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.address) newErrors.address = 'Address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!shippingAddress.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cart.items,
        total: cart.total,
        shippingAddress,
        paymentMethod
      };
      
      const response = await API.post('/orders', orderData);
      
      if (response.data.success) {
        // Clear cart from context
        await fetchCart();
        navigate(`/order-success/${response.data.orderId}`);
      }
    } catch (error) {
      console.error('Order failed:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.total || 0;
  const shipping = 0;
  const total = subtotal + shipping;

  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaLoading, setMpesaLoading] = useState(false);

  const handleMpesaPayment = async () => {
  if (!mpesaPhone || mpesaPhone.length < 10) {
    alert('Please enter a valid phone number');
    return;
  }
  
  setMpesaLoading(true);
  try {
    const response = await API.post('/payments/mpesa', {
      phoneNumber: mpesaPhone,
      amount: total,
      orderId: 'temp'
    });
    
    if (response.data.success) {
      alert('STK Push sent! Please check your phone and enter your PIN.');
      // You can poll for status or wait for callback
      // For now, proceed to order placement
      // Proceed to order placement after M-Pesa payment
    await handlePlaceOrder();
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Payment failed. Please try again.');
  } finally {
    setMpesaLoading(false);
  }
};{paymentMethod === 'mpesa' && (
  <div className="mpesa-form">
    <div className="form-group">
      <label>M-Pesa Phone Number</label>
      <input
        type="tel"
        placeholder="0712345678"
        value={mpesaPhone}
        onChange={(e) => setMpesaPhone(e.target.value)}
      />
      <small>Enter the phone number registered with M-Pesa</small>
    </div>
    <button 
      type="button" 
      onClick={handleMpesaPayment}
      className="mpesa-btn"
      disabled={mpesaLoading}
    >
      {mpesaLoading ? 'Processing...' : `Pay KES ${total} via M-Pesa`}
    </button>
  </div>
)}


  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        
        {/* Steps Indicator */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Shipping</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Payment</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review</div>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Main Form */}
          <div className="checkout-form">
            {step === 1 && (
              <form onSubmit={handleShippingSubmit}>
                <h2>Shipping Address</h2>
                
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleShippingChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleShippingChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Street address"
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleShippingChange}
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleShippingChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="e.g., 0712345678"
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <button type="submit" className="next-btn">Continue to Payment</button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePaymentSubmit}>
                <h2>Payment Method</h2>
                
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <i className="fas fa-money-bill-wave"></i>
                      <span>Cash on Delivery</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div>
                      <i className="fas fa-mobile-alt"></i>
                      <span>M-Pesa</span>
                    </div>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setStep(1)} className="back-btn">
                    Back to Shipping
                  </button>
                  <button type="submit" className="next-btn">
                    Review Order
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div>
                <h2>Review Your Order</h2>
                
                <div className="review-section">
                  <h3>Shipping Address</h3>
                  <div className="review-content">
                    <p><strong>{shippingAddress.fullName}</strong></p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    <p>{shippingAddress.country}</p>
                    <p>Phone: {shippingAddress.phone}</p>
                    <button onClick={() => setStep(1)} className="edit-btn">Edit</button>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <div className="review-content">
                    <p>{paymentMethod === 'cash' ? 'Cash on Delivery' : 'M-Pesa'}</p>
                    <button onClick={() => setStep(2)} className="edit-btn">Edit</button>
                  </div>
                </div>

                <div className="review-section">
                  <h3>Order Items</h3>
                  <div className="order-items">
                    {cart.items?.map(item => (
                      <div key={item.id} className="order-item">
                        <span>{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setStep(2)} className="back-btn">
                    Back to Payment
                  </button>
                  <button 
                    onClick={handlePlaceOrder} 
                    className="place-order-btn"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            {cart.items?.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="summary-divider"></div>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;