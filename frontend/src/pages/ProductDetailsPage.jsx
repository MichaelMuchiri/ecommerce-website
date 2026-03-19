import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../services/productService';
import Rating from '../components/common/Rating';
import Loader from '../components/common/Loader';
import ProductCard from '../components/products/ProductCard';
import './ProductDetailsPage.css';import { useCart } from '../context/CartContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(id);
      setProduct(response.data.product);
      setRelatedProducts(response.data.relatedProducts);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= (product?.quantity || 10)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.quantity || 10)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

   const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
      </div>
    );
  }

  const { name, price, description, images, ratings, brand, category, quantity: stock } = product;
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0];

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        {/* Image Gallery */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={images?.[selectedImage]?.url || primaryImage?.url || '/images/placeholder.jpg'} 
              alt={name} 
            />
          </div>
          {images?.length > 1 && (
            <div className="thumbnail-images">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.url} alt={`${name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{name}</h1>
          
          <div className="product-meta">
            <Rating value={ratings?.average || 0} text={`${ratings?.count || 0} reviews`} />
            {brand && <span className="product-brand">Brand: {brand}</span>}
          </div>

          <div className="product-price-section">
            <span className="product-price">${price?.toFixed(2)}</span>
            {stock > 0 ? (
              <span className="in-stock">In Stock ({stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="quantity-btn"
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={stock}
                className="quantity-input"
              />
              <button 
                onClick={incrementQuantity}
                disabled={quantity >= stock}
                className="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button 
              onClick={handleAddToCart}
              disabled={stock === 0}
              className="add-to-cart-btn"
            >
              Add to Cart
            </button>
            <button className="buy-now-btn">
              Buy Now
            </button>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <div className="info-item">
              <i className="fas fa-truck"></i>
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="info-item">
              <i className="fas fa-undo"></i>
              <span>30-day return policy</span>
            </div>
            <div className="info-item">
              <i className="fas fa-shield-alt"></i>
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;