import React from 'react';
import { useProducts } from '../../context/ProductContext';
import './ProductSort.css';

const ProductSort = () => {
  const { filters, updateFilters, pagination } = useProducts();

  const handleSortChange = (e) => {
    updateFilters({ sort: e.target.value });
  };

  return (
    <div className="product-sort">
      <div className="results-count">
        Showing <strong>{pagination.total}</strong> products
      </div>
      
      <div className="sort-controls">
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={filters.sort}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSort;