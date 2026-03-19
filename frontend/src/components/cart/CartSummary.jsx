import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CartSummary.css';

const CartSummary = () => {
  const navigate = useNavigate();
  const { cart, applyCoupon, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const { subtotal = 0, tax = 0, shippingCost = 0, discount = 0, total = 0 } = cart;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setApplyingCoupon(true);
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (error) {
      // Error handled in context
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Save current cart and redirect to login
      sessionStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>{shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'Free'}</span>
      </div>

      <div className="summary-row">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>

      {discount > 0 && (
        <div className="summary-row discount">
          <span>Discount</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Coupon Form */}
      <form onSubmit={handleApplyCoupon} className="coupon-form">
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="coupon-input"
          disabled={applyingCoupon}
        />
        <button
          type="submit"
          className="apply-coupon-btn"
          disabled={!couponCode.trim() || applyingCoupon}
        >
          {applyingCoupon ? 'Applying...' : 'Apply'}
        </button>
      </form>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="checkout-btn"
        disabled={loading || cart.items?.length === 0}
      >
        Proceed to Checkout
      </button>

      {/* Payment Icons */}
      <div className="payment-methods">
        <i className="fab fa-cc-visa"></i>
        <i className="fab fa-cc-mastercard"></i>
        <i className="fab fa-cc-amex"></i>
        <i className="fab fa-cc-paypal"></i>
        <i className="fab fa-cc-stripe"></i>
      </div>

      {/* Secure Checkout Note */}
      <p className="secure-checkout">
        <i className="fas fa-lock"></i>
        Secure Checkout
      </p>
    </div>
  );
};

export default CartSummary;