import React, { useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import ProductSort from '../components/products/ProductSort';
import ProductPagination from '../components/products/ProductPagination';
import './ShopPage.css';

const ShopPage = () => {
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    fetchCategories 
  } = useProducts();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Shop Our Products</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="shop-container">
        <aside className="shop-sidebar">
          <ProductFilters />
        </aside>

        <main className="shop-main">
          <ProductSort />
          <ProductGrid 
            products={products} 
            loading={loading} 
            error={error}
          />
          <ProductPagination />
        </main>
      </div>
    </div>
  );
};

export default ShopPage;