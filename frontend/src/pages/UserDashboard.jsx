import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', zipCode: '', country: '' }
  });
  const [errors, setErrors] = useState({});

  // Fetch profile data on load
  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get('/auth/profile');
      if (response.data.success) {
        const data = response.data.data;
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || { street: '', city: '', zipCode: '', country: '' }
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders/myorders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.name) newErrors.name = 'Name is required';
    return newErrors;
  };

  const handleSaveProfile = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await API.put('/auth/profile', {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address
      });
      
      if (response.data.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        await fetchProfile();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatAddressDisplay = (address) => {
    if (!address) return 'No address provided';
    
    let addressObj = address;
    if (typeof address === 'string') {
      try {
        addressObj = JSON.parse(address);
      } catch {
        return address;
      }
    }
    
    const parts = [];
    if (addressObj.street) parts.push(addressObj.street);
    if (addressObj.city) parts.push(addressObj.city);
    if (addressObj.zipCode) parts.push(addressObj.zipCode);
    if (addressObj.country) parts.push(addressObj.country);
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  const getPhoneDisplay = () => {
    return profileData.phone || 'Not provided';
  };

  const getAddressDisplay = () => {
    if (isEditing) {
      return (
        <div className="edit-address-form">
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address.street"
              value={profileData.address?.street || ''}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={profileData.address?.city || ''}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={profileData.address?.zipCode || ''}
                onChange={handleChange}
                placeholder="ZIP Code"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="address.country"
              value={profileData.address?.country || ''}
              onChange={handleChange}
              placeholder="Country"
            />
          </div>
        </div>
      );
    }
    return <p>{formatAddressDisplay(profileData.address)}</p>;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        {!isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              {profileData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3>{profileData.name || 'User'}</h3>
            <p>{profileData.email || user?.email}</p>
            <span className="user-role">{user?.role || 'user'}</span>
          </div>

          <div className="dashboard-menu">
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i> Profile
            </button>
            <button 
              className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fas fa-shopping-bag"></i> Orders
            </button>
            <button 
              className="menu-item"
              onClick={logout}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="dashboard-content">
          {activeTab === 'profile' && (
            <div>
              <h2 className="content-title">Profile Information</h2>
              
              {isEditing ? (
                <div className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      disabled 
                      className="disabled-input"
                    />
                    <small className="help-text">Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <h3>Shipping Address</h3>
                  {getAddressDisplay()}

                  <div className="form-actions">
                    <button onClick={handleSaveProfile} className="save-btn" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-info">
                  <div className="info-row">
                    <span className="label">Full Name:</span>
                    <span className="value">{profileData.name || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{profileData.email || user?.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{getPhoneDisplay()}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{formatAddressDisplay(profileData.address)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="content-title">My Orders</h2>
              {orders.length === 0 ? (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="shop-now-link">Start Shopping</Link>
                </div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>${order.total?.toFixed(2)}</td>
                        <td>
                          <span className={`status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;