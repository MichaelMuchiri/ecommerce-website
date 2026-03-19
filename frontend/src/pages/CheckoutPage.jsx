import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentMethod from '../components/checkout/PaymentMethod';
import OrderReview from '../components/checkout/OrderReview';
import StripePayment from '../components/checkout/StripePayment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css';

// Load Stripe outside of components to avoid recreating
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Check if cart has items
  useEffect(() => {
    if (!cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleShippingNext = () => {
    setCurrentStep(2);
    navigate('/checkout/payment');
  };

  const handlePaymentNext = () => {
    setCurrentStep(3);
    navigate('/checkout/review');
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <CheckoutSteps 
          step1={true}
          step2={currentStep >= 2}
          step3={currentStep >= 3}
          step4={currentStep >= 4}
        />

        <Routes>
          <Route 
            path="shipping" 
            element={<ShippingForm onNext={handleShippingNext} />} 
          />
          <Route 
            path="payment" 
            element={<PaymentMethod onNext={handlePaymentNext} />} 
          />
          <Route 
            path="review" 
            element={<OrderReview />} 
          />
          <Route 
            path="payment/:orderId" 
            element={
              <Elements stripe={stripePromise}>
                <StripePayment 
                  orderId={window.location.pathname.split('/').pop()}
                  amount={cart.total}
                />
              </Elements>
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default CheckoutPage;