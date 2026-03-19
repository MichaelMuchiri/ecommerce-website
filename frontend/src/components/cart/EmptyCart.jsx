import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyCart.css';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <i className="fas fa-shopping-cart empty-cart-icon"></i>
      <h2>Your Cart is Empty</h2>
      <p>Looks like you haven't added any items to your cart yet.</p>
      <Link to="/shop" className="continue-shopping-btn">
        Continue Shopping
      </Link>
    </div>
  );
};

export default EmptyCart;