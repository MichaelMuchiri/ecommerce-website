const Stripe = require('stripe');
const { Order } = require('../models');

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: { userId: req.user._id.toString() }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Update order status
      // You would need to store the order ID in metadata
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// @desc    Create PayPal order
// @route   POST /api/payments/create-paypal-order
// @access  Private
const createPayPalOrder = async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;

    // This would integrate with PayPal SDK
    // For now, return mock data
    res.json({
      success: true,
      orderId: 'MOCK_ORDER_ID'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order',
      error: error.message
    });
  }
};

// @desc    Capture PayPal order
// @route   POST /api/payments/capture-paypal-order
// @access  Private
const capturePayPalOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // This would capture the PayPal payment
    // For now, return mock success
    res.json({
      success: true,
      captureData: {
        id: orderId,
        status: 'COMPLETED'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal order',
      error: error.message
    });
  }
};

// @desc    Process M-Pesa payment
// @route   POST /api/payments/mpesa
// @access  Private
const processMpesaPayment = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;

    // This would integrate with M-Pesa API
    // For now, return mock success
    res.json({
      success: true,
      message: 'M-Pesa payment initiated',
      data: {
        transactionId: 'MPESA_' + Date.now(),
        phoneNumber,
        amount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process M-Pesa payment',
      error: error.message
    });
  }
};

module.exports = {
  createPaymentIntent,
  handleStripeWebhook,
  createPayPalOrder,
  capturePayPalOrder,
  processMpesaPayment
};