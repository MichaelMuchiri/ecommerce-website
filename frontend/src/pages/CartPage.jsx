import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const { items = [], total = 0 } = cart;

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Please Login to View Cart</h2>
          <p>You need to be logged in to see your shopping cart.</p>
          <Link to="/login" className="login-btn-cart">Login Now</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-container">
        <div className="cart-loading">Loading your cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/shop" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart ({items.length} items)</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} />
              </div>
              
              <div className="cart-item-details">
                <div className="cart-item-header">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <button 
                    onClick={() => handleRemove(item.id)} 
                    className="remove-item"
                    title="Remove item"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
                
                <div className="cart-item-price">
                  ${item.price.toFixed(2)} each
                </div>
                
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="cart-item-total">
                    <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
          
          <Link to="/shop" className="continue-shop-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;