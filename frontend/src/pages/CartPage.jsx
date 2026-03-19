import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyCart from '../components/cart/EmptyCart';
import Loader from '../components/common/Loader';
import './CartPage.css';

const CartPage = () => {
  const { cart, loading } = useCart();

  if (loading) {
    return (
      <div className="cart-page-loading">
        <Loader />
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <div className="cart-sidebar">
          <CartSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;