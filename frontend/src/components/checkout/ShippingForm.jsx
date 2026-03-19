import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import './ShippingForm.css';

const ShippingForm = ({ onNext }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Save shipping address to localStorage
    localStorage.setItem('shippingAddress', JSON.stringify(formData));
    onNext();
  };

  const handleCancel = () => {
    navigate('/cart');
  };

  return (
    <div className="shipping-form-container">
      <h2>Shipping Address</h2>
      
      <form onSubmit={handleSubmit} className="shipping-form">
        <div className="form-row">
          <Input
            label="Street Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            placeholder="123 Main St"
            required
          />
        </div>

        <div className="form-row grid-2">
          <Input
            label="City"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            placeholder="New York"
            required
          />
          <Input
            label="State"
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
            placeholder="NY"
            required
          />
        </div>

        <div className="form-row grid-2">
          <Input
            label="ZIP Code"
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
            placeholder="10001"
            required
          />
          <Input
            label="Country"
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            error={errors.country}
            placeholder="United States"
            required
          />
        </div>

        <div className="form-row">
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="(123) 456-7890"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="continue-btn">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;