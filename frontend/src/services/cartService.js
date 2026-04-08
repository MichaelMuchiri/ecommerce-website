import API from './api';

const cartService = {
  // Get cart
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await API.post('/cart/add', { productId, quantity });
    return response.data;
  },

  // Update quantity
  updateCartItem: async (itemId, quantity) => {
    const response = await API.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item
  removeCartItem: async (itemId) => {
    const response = await API.delete(`/cart/remove/${itemId}`);
    return response.data;
  }
};

export default cartService;