import API from './api';

const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/products?${queryString}`);
    return response.data;
  },

  // Get single product by ID or slug
  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  // Get top rated products
  getTopProducts: async () => {
    const response = await API.get('/products/top');
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await API.get('/products/featured');
    return response.data;
  },

  // Admin: Create product
  createProduct: async (productData) => {
    const response = await API.post('/products', productData);
    return response.data;
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  }
};

export default productService;