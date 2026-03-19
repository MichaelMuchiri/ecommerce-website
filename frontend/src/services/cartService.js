import API from './api';

const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1, variant = null) => {
    const response = await API.post('/cart/items', { productId, quantity, variant });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await API.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeCartItem: async (itemId) => {
    const response = await API.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await API.delete('/cart');
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (couponCode) => {
    const response = await API.post('/cart/coupon', { couponCode });
    return response.data;
  },

  // Merge guest cart with user cart
  mergeCart: async (guestCart) => {
    const response = await API.post('/cart/merge', { guestCart });
    return response.data;
  },

  // Local storage functions for guest cart
  getLocalCart: () => {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : { items: [] };
  },

  saveLocalCart: (cart) => {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  },

  clearLocalCart: () => {
    localStorage.removeItem('guestCart');
  }
};

export default cartService;