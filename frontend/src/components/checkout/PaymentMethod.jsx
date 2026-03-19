import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentMethod.css';

const PaymentMethod = ({ onNext }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [error, setError] = useState('');

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'Credit / Debit Card',
      icon: 'fab fa-cc-stripe',
      description: 'Pay securely with Visa, Mastercard, or American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'fab fa-paypal',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: 'fas fa-mobile-alt',
      description: 'Pay with M-Pesa (Kenya)'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: 'fas fa-money-bill-wave',
      description: 'Pay when you receive your order'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    localStorage.setItem('paymentMethod', paymentMethod);
    onNext();
  };

  const handleBack = () => {
    navigate('/checkout/shipping');
  };

  return (
    <div className="payment-method-container">
      <h2>Payment Method</h2>
      
      <form onSubmit={handleSubmit} className="payment-method-form">
        <div className="payment-options">
          {paymentMethods.map(method => (
            <label
              key={method.id}
              className={`payment-option ${paymentMethod === method.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-radio"
              />
              <div className="payment-content">
                <div className="payment-header">
                  <i className={method.icon}></i>
                  <span className="payment-name">{method.name}</span>
                </div>
                <p className="payment-description">{method.description}</p>
              </div>
            </label>
          ))}
        </div>

        {error && <div className="payment-error">{error}</div>}

        <div className="form-actions">
          <button type="button" onClick={handleBack} className="back-btn">
            Back to Shipping
          </button>
          <button type="submit" className="continue-btn">
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethod;