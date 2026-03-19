import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartIcon.css';

const CartIcon = () => {
  const { itemCount } = useCart();

  return (
    <Link to="/cart" className="cart-icon">
      <i className="fas fa-shopping-cart"></i>
      {itemCount > 0 && (
        <span className="cart-count">{itemCount}</span>
      )}
    </Link>
  );
};

export default CartIcon;