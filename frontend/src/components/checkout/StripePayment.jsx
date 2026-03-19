import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import API from '../../services/api';
import orderService from '../../services/orderService';
import './StripePayment.css';

const StripePayment = ({ orderId, amount }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await API.post('/payments/create-payment-intent', {
          amount: amount
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        setError('Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [amount]);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Customer Name', // You can get this from user context
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Update order to paid
        await orderService.updateOrderToPaid(orderId, {
          id: paymentIntent.id,
          status: paymentIntent.status,
          updateTime: new Date().toISOString(),
          emailAddress: paymentIntent.receipt_email
        });

        navigate(`/order-success/${orderId}`);
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment">
      <h3>Card Payment</h3>
      
      <form onSubmit={handleSubmit} className="stripe-form">
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>

        {error && <div className="payment-error">{error}</div>}

        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className="pay-button"
        >
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </form>

      <div className="secure-badge">
        <i className="fas fa-lock"></i>
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
};

export default StripePayment;