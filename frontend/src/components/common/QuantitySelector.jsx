import React from 'react';
import './QuantitySelector.css';

const QuantitySelector = ({ 
  quantity, 
  onIncrement, 
  onDecrement, 
  onChange,
  min = 1,
  max = 99,
  disabled = false
}) => {
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onChange(value);
    }
  };

  return (
    <div className="quantity-selector">
      <button
        onClick={onDecrement}
        disabled={quantity <= min || disabled}
        className="quantity-btn"
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        className="quantity-input"
      />
      <button
        onClick={onIncrement}
        disabled={quantity >= max || disabled}
        className="quantity-btn"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;