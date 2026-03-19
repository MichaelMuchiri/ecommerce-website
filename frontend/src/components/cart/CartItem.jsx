import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../common/QuantitySelector';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, price, total, _id } = item;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(_id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(_id);
    }
  };

  const imageUrl = product?.images?.[0]?.url || '/images/placeholder.jpg';

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Link to={`/product/${product?.slug || product?._id}`}>
          <img src={imageUrl} alt={product?.name} />
        </Link>
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <Link to={`/product/${product?.slug || product?._id}`} className="cart-item-title">
            {product?.name}
          </Link>
          <button onClick={handleRemove} className="remove-item" title="Remove item">
            <i className="fas fa-trash"></i>
          </button>
        </div>

        {item.variant && (
          <p className="cart-item-variant">Variant: {item.variant}</p>
        )}

        <div className="cart-item-price">
          <span className="price">${price?.toFixed(2)} each</span>
        </div>

        <div className="cart-item-actions">
          <QuantitySelector
            quantity={quantity}
            onIncrement={() => handleQuantityChange(quantity + 1)}
            onDecrement={() => handleQuantityChange(quantity - 1)}
            onChange={handleQuantityChange}
            max={product?.quantity || 99}
          />

          <div className="cart-item-total">
            <span>Total: </span>
            <strong>${total?.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;