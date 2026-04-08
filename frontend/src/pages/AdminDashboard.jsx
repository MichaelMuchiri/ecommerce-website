import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', quantity: '', category: '', image: ''
  });

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await API.get('/admin/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await API.get('/admin/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await API.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setProductForm({ ...productForm, image: response.data.imageUrl });
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct.id}`, productForm);
        alert('Product updated!');
      } else {
        await API.post('/admin/products', productForm);
        alert('Product created!');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: '', description: '', quantity: '', category: '', image: '' });
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await API.delete(`/admin/products/${id}`);
        alert('Product deleted');
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}`, { status });
      alert('Order status updated');
      fetchOrders();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleUserRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}`, { role });
      alert('User role updated');
      fetchUsers();
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${id}`);
        alert('User deleted successfully');
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      description: product.description || '',
      quantity: product.quantity,
      category: product.category || '',
      image: product.image || ''
    });
    setShowProductForm(true);
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <i className="fas fa-chart-line"></i> Dashboard
          </button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            <i className="fas fa-box"></i> Products
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <i className="fas fa-shopping-cart"></i> Orders
          </button>
          <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            <i className="fas fa-users"></i> Users
          </button>
        </nav>
      </div>

      <div className="admin-main">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>${stats.totalRevenue?.toFixed(2) || 0}</h3>
                <p>Total Revenue</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalOrders || 0}</h3>
                <p>Total Orders</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalProducts || 0}</h3>
                <p>Total Products</p>
              </div>
              <div className="stat-card">
                <h3>{stats.totalUsers || 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="tab-header">
              <h1>Products</h1>
              <button className="add-btn" onClick={() => { setShowProductForm(true); setEditingProduct(null); setProductForm({ name: '', price: '', description: '', quantity: '', category: '', image: '' }); }}>
                + Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="product-form-modal">
                <form onSubmit={handleProductSubmit}>
                  <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                  <input type="text" placeholder="Product Name" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required />
                  <input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required />
                  <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                  <input type="number" placeholder="Quantity" value={productForm.quantity} onChange={(e) => setProductForm({...productForm, quantity: e.target.value})} required />
                  <input type="text" placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} />
                  
                  {/* IMAGE UPLOAD BUTTON - Replaces the URL input */}
                  <div className="form-group">
                    <label>Product Image</label>
                    <input
                      type="file"
                      id="productImageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('productImageUpload').click()}
                      className="upload-btn"
                      disabled={uploading}
                    >
                      {uploading ? '📤 Uploading...' : '📁 Select Image from Computer'}
                    </button>
                    {productForm.image && (
                      <div className="image-preview">
                        <img src={productForm.image} alt="Preview" />
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: '' })}
                          className="remove-image-btn"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <small className="upload-hint">Click button to select an image from your computer (JPG, PNG, GIF, WebP, max 5MB)</small>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                    <button type="button" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                    <td>{p.quantity}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editProduct(p)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h1>Orders</h1>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{o.user_name}<br/><small>{o.user_email}</small></td>
                    <td>${o.total?.toFixed(2)}</td>
                    <td>
                      <select value={o.status} onChange={(e) => handleOrderStatus(o.id, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="order-date">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ color: '#333', background: '#fff' }}>
            <h1>Users</h1>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      {u.address?.street ? 
                        `${u.address.street}, ${u.address.city || ''}, ${u.address.country || ''}` : 
                        '-'
                      }
                    </td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleUserRole(u.id, e.target.value)} 
                        disabled={u.email === user?.email}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="user-date">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      {u.email !== user?.email && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)} 
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;