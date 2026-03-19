import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import useDebounce from '../../hooks/useDebounce';
import './ProductFilters.css';

const ProductFilters = () => {
  const { categories, filters, updateFilters, clearFilters } = useProducts();
  const [localFilters, setLocalFilters] = useState(filters);
  const debouncedSearch = useDebounce(localFilters.keyword, 500);

  // Update filters when debounced search changes
  useEffect(() => {
    updateFilters({ keyword: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  // Sync local filters with global filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value ? Number(value) : ''
    }));
  };

  const handleApplyFilters = () => {
    updateFilters(localFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalFilters({
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

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button onClick={handleClearFilters} className="clear-filters">
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className="filter-section">
        <label htmlFor="keyword">Search</label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          value={localFilters.keyword}
          onChange={handleChange}
          placeholder="Search products..."
          className="search-input"
        />
      </div>

      {/* Category */}
      <div className="filter-section">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={localFilters.category}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <label>Price Range</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            value={localFilters.minPrice}
            onChange={handlePriceChange}
            placeholder="Min"
            min="0"
            className="price-input"
          />
          <span>to</span>
          <input
            type="number"
            name="maxPrice"
            value={localFilters.maxPrice}
            onChange={handlePriceChange}
            placeholder="Max"
            min="0"
            className="price-input"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="filter-section">
        <label htmlFor="minRating">Minimum Rating</label>
        <select
          id="minRating"
          name="minRating"
          value={localFilters.minRating}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">Any Rating</option>
          <option value="4">4 ★ & above</option>
          <option value="3">3 ★ & above</option>
          <option value="2">2 ★ & above</option>
          <option value="1">1 ★ & above</option>
        </select>
      </div>

      {/* Apply Button */}
      <button onClick={handleApplyFilters} className="apply-filters">
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilters;