import API from './api';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await API.get('/admin/stats');
    return response.data;
  },

  // User management
  getUsers: async () => {
    const response = await API.get('/admin/users');
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await API.put(`/admin/users/${id}`, { role });
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Order management
  getOrders: async () => {
    const response = await API.get('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (id, statusData) => {
    const response = await API.put(`/admin/orders/${id}`, statusData);
    return response.data;
  },

  // Product management
  getProducts: async () => {
    const response = await API.get('/admin/products');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await API.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await API.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await API.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Category management
  getCategories: async () => {
    const response = await API.get('/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await API.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await API.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await API.delete(`/admin/categories/${id}`);
    return response.data;
  }
};

export default adminService;