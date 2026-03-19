const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleStripeWebhook,
  createPayPalOrder,
  capturePayPalOrder,
  processMpesaPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Stripe webhook needs raw body, not express.json()
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.use(protect);

router.post('/create-payment-intent', createPaymentIntent);
router.post('/create-paypal-order', createPayPalOrder);
router.post('/capture-paypal-order', capturePayPalOrder);
router.post('/mpesa', processMpesaPayment);

module.exports = router;