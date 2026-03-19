import React, { createContext, useState, useContext, useCallback } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    brand: '',
    minRating: '',
    sort: 'newest',
    page: 1
  });

  // Fetch products with current filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove empty filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
      );
      
      const response = await productService.getProducts(activeFilters);
      setProducts(response.data.products);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total
      });
      
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch products');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch featured products
  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const response = await productService.getFeaturedProducts();
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    }
  }, []);

  // Fetch top rated products
  const fetchTopProducts = useCallback(async () => {
    try {
      const response = await productService.getTopProducts();
      setTopProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch top products:', error);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to page 1 when filters change
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      brand: '',
      minRating: '',
      sort: 'newest',
      page: 1
    });
  };

  const value = {
    products,
    featuredProducts,
    topProducts,
    categories,
    loading,
    error,
    pagination,
    filters,
    fetchProducts,
    fetchFeaturedProducts,
    fetchTopProducts,
    fetchCategories,
    updateFilters,
    clearFilters
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};