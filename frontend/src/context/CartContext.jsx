import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total: 0 });
      setItemCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data);
      const count = response.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setItemCount(count);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeCartItem(itemId);
      await fetchCart();
    } catch (error) {
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};