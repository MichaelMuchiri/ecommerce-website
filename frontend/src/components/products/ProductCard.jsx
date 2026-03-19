import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../common/Rating';
import './ProductCard.css';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { _id, name, price, images, ratings, slug, discountPercentage } = product;
  const { addToCart } = useCart();

    const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    addToCart(product, 1);
  };
  // Get primary image or first image
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
  const imageUrl = primaryImage?.url || '/images/placeholder.jpg';

  return (
    <div className="product-card">
      <Link to={`/product/${slug || _id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={name} 
            className="product-image"
            loading="lazy"
          />
          {discountPercentage > 0 && (
            <span className="discount-badge">-{discountPercentage}%</span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          
          <div className="product-rating">
            <Rating value={ratings?.average || 0} />
            <span className="rating-count">({ratings?.count || 0})</span>
          </div>
          
          <div className="product-price">
            {discountPercentage > 0 ? (
              <>
                <span className="original-price">
                  ${product.comparePrice?.toFixed(2)}
                </span>
                <span className="sale-price">${price?.toFixed(2)}</span>
              </>
            ) : (
              <span className="regular-price">${price?.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
      
      <button 
    onClick={handleAddToCart} 
    className="add-to-cart-btn"
    disabled={product.quantity === 0}
  >
    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
  </button>
    </div>
  );
};

export default ProductCard;