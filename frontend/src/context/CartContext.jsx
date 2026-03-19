import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Load cart on mount and when auth state changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // Update item count whenever cart changes
  useEffect(() => {
    const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    setItemCount(count);
  }, [cart]);

  const loadCart = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Load from server for authenticated users
        const response = await cartService.getCart();
        setCart(response.data);
        
        // Check if there's a guest cart to merge
        const guestCart = cartService.getLocalCart();
        if (guestCart.items?.length > 0) {
          await mergeGuestCart(guestCart);
        }
      } else {
        // Load from localStorage for guests
        const localCart = cartService.getLocalCart();
        setCart(localCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const mergeGuestCart = async (guestCart) => {
    try {
      await cartService.mergeCart(guestCart);
      cartService.clearLocalCart();
      // Reload cart after merge
      const response = await cartService.getCart();
      setCart(response.data);
      toast.success('Guest cart merged with your account');
    } catch (error) {
      console.error('Failed to merge cart:', error);
    }
  };

  const addToCart = async (product, quantity = 1, variant = null) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Add to server cart
        const response = await cartService.addToCart(product._id, quantity, variant);
        setCart(response.data);
      } else {
        // Add to local cart
        const localCart = cartService.getLocalCart();
        
        const existingItemIndex = localCart.items.findIndex(
          item => item.product._id === product._id && 
                 (item.variant || null) === (variant || null)
        );

        if (existingItemIndex > -1) {
          // Update existing item
          localCart.items[existingItemIndex].quantity += quantity;
          localCart.items[existingItemIndex].total = 
            localCart.items[existingItemIndex].price * localCart.items[existingItemIndex].quantity;
        } else {
          // Add new item
          localCart.items.push({
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              images: product.images
            },
            quantity,
            price: product.price,
            total: product.price * quantity,
            variant
          });
        }

        // Recalculate totals
        localCart.subtotal = localCart.items.reduce((sum, item) => sum + item.total, 0);
        localCart.total = localCart.subtotal;

        cartService.saveLocalCart(localCart);
        setCart(localCart);
      }

      toast.success('Added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Update server cart
        const response = await cartService.updateCartItem(itemId, newQuantity);
        setCart(response.data);
      } else {
        // Update local cart
        const localCart = cartService.getLocalCart();
        const itemIndex = localCart.items.findIndex(item => item._id === itemId);
        
        if (itemIndex > -1) {
          localCart.items[itemIndex].quantity = newQuantity;
          localCart.items[itemIndex].total = 
            localCart.items[itemIndex].price * newQuantity;
          
          // Recalculate totals
          localCart.subtotal = localCart.items.reduce((sum, item) => sum + item.total, 0);
          localCart.total = localCart.subtotal;
          
          cartService.saveLocalCart(localCart);
          setCart(localCart);
        }
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Remove from server cart
        const response = await cartService.removeCartItem(itemId);
        setCart(response.data);
      } else {
        // Remove from local cart
        const localCart = cartService.getLocalCart();
        localCart.items = localCart.items.filter(item => item._id !== itemId);
        
        // Recalculate totals
        localCart.subtotal = localCart.items.reduce((sum, item) => sum + item.total, 0);
        localCart.total = localCart.subtotal;
        
        cartService.saveLocalCart(localCart);
        setCart(localCart);
      }

      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        // Clear server cart
        const response = await cartService.clearCart();
        setCart(response.data);
      } else {
        // Clear local cart
        cartService.clearLocalCart();
        setCart({ items: [], subtotal: 0, total: 0 });
      }

      toast.success('Cart cleared');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const response = await cartService.applyCoupon(couponCode);
        setCart(response.data);
        toast.success('Coupon applied!');
      } else {
        // For guests, just store coupon in local cart
        const localCart = cartService.getLocalCart();
        localCart.couponCode = couponCode;
        // TODO: Apply coupon discount logic
        cartService.saveLocalCart(localCart);
        setCart(localCart);
        toast.success('Coupon applied!');
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      toast.error('Invalid coupon code');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};