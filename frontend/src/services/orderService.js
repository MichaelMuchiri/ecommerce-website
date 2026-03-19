import API from './api';

const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },

  // Get logged in user orders
  getMyOrders: async () => {
    const response = await API.get('/orders/myorders');
    return response.data;
  },

  // Update order to paid
  updateOrderToPaid: async (id, paymentResult) => {
    const response = await API.put(`/orders/${id}/pay`, paymentResult);
    return response.data;
  },

  // Admin: Get all orders
  getOrders: async () => {
    const response = await API.get('/orders');
    return response.data;
  },

  // Admin: Update order to delivered
  updateOrderToDelivered: async (id) => {
    const response = await API.put(`/orders/${id}/deliver`);
    return response.data;
  }
};

export default orderService;