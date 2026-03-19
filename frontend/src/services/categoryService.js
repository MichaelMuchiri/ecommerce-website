import API from './api';

const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await API.get('/categories');
    return response.data;
  },

  // Get single category by slug
  getCategoryBySlug: async (slug) => {
    const response = await API.get(`/categories/${slug}`);
    return response.data;
  },

  // Admin: Create category
  createCategory: async (categoryData) => {
    const response = await API.post('/categories', categoryData);
    return response.data;
  },

  // Admin: Update category
  updateCategory: async (id, categoryData) => {
    const response = await API.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Admin: Delete category
  deleteCategory: async (id) => {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;