import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import { validateEmail, validatePhone } from '../utils/validators';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handled by context
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        {!isEditing && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-sidebar">
          <div className="user-info-card">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user?.name}</h3>
            <p className="user-email">{user?.email}</p>
            <p className="user-role">{user?.role}</p>
          </div>

          <div className="dashboard-menu">
            <button className="menu-item active">Profile</button>
            <button className="menu-item">Orders</button>
            <button className="menu-item">Wishlist</button>
            <button className="menu-item">Addresses</button>
            <button className="menu-item">Settings</button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="profile-section">
            <h2>Profile Information</h2>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                </div>

                <div className="form-row">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                </div>

                <div className="form-row">
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="10-digit phone number"
                  />
                </div>

                <h3>Address</h3>
                
                <div className="form-row">
                  <Input
                    label="Street Address"
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row grid-2">
                  <Input
                    label="City"
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                  <Input
                    label="State"
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row grid-2">
                  <Input
                    label="ZIP Code"
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                  />
                  <Input
                    label="Country"
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-button">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-group">
                  <label>Name:</label>
                  <p>{user?.name}</p>
                </div>
                <div className="info-group">
                  <label>Email:</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-group">
                  <label>Phone:</label>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>
                <div className="info-group">
                  <label>Address:</label>
                  {user?.address ? (
                    <p>
                      {user.address.street}, {user.address.city},<br />
                      {user.address.state} {user.address.zipCode},<br />
                      {user.address.country}
                    </p>
                  ) : (
                    <p>No address provided</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="recent-orders">
            <h2>Recent Orders</h2>
            <div className="orders-list">
              <p className="no-orders">No orders yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;