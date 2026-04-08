import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.id, 1);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      alert('Failed to add to cart. Please try again.');
    }
  };

  const imageUrl = product.image || 'https://via.placeholder.com/300';

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={imageUrl} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price?.toFixed(2)}</p>
        </div>
      </Link>
      <button onClick={handleAddToCart} className="add-to-cart-btn">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;