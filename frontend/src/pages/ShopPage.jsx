import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import './ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Shop Our Products</h1>
        <p>Discover amazing products at great prices</p>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products found. Please seed products first.</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;