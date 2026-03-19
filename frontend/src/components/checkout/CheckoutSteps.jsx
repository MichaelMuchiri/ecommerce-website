import React from 'react';
import './CheckoutSteps.css';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="checkout-steps">
      <div className={`step ${step1 ? 'active' : ''} ${step1 ? 'completed' : ''}`}>
        <div className="step-icon">1</div>
        <div className="step-label">Sign In</div>
      </div>
      
      <div className={`step ${step2 ? 'active' : ''} ${step2 ? 'completed' : ''}`}>
        <div className="step-icon">2</div>
        <div className="step-label">Shipping</div>
      </div>
      
      <div className={`step ${step3 ? 'active' : ''} ${step3 ? 'completed' : ''}`}>
        <div className="step-icon">3</div>
        <div className="step-label">Payment</div>
      </div>
      
      <div className={`step ${step4 ? 'active' : ''} ${step4 ? 'completed' : ''}`}>
        <div className="step-icon">4</div>
        <div className="step-label">Place Order</div>
      </div>
    </div>
  );
};

export default CheckoutSteps;