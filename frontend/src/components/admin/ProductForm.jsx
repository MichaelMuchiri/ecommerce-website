import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import './ProductForm.css';

const ProductForm = ({ product, categories, onSubmit, loading }) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    comparePrice: '',
    quantity: '',
    category: '',
    brand: '',
    tags: [],
    image: '',
    isActive: true,
    isFeatured: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        quantity: product.quantity || '',
        category: product.category?._id || product.category || '',
        brand: product.brand || '',
        tags: product.tags || [],
        image: product.image || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  // File upload handler - opens file explorer
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, or WebP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setUploading(true);
    try {
      const response = await API.post('/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, image: response.data.imageUrl }));
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // Clear file input
      e.target.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.quantity && formData.quantity !== 0) newErrors.quantity = 'Quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  return (
    <div className="product-form-container">
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-left">
            {/* Basic fields remain the same */}
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={errors.sku ? 'error' : ''}
              />
              {errors.sku && <span className="error-message">{errors.sku}</span>}
            </div>

            <div style={{ background: 'red', color: 'white', padding: '5px' }}>NEW VERSION LOADED</div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
              ></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="comparePrice">Compare Price</label>
                <input
                  type="number"
                  id="comparePrice"
                  name="comparePrice"
                  step="0.01"
                  min="0"
                  value={formData.comparePrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <span className="error-message">{errors.quantity}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  {categories && categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="electronics, smartphone, new"
              />
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>

              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Featured
              </label>
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>Product Image</label>
              
              {/* Hidden file input - triggers file explorer */}
              <input
                type="file"
                id="imageFileInput"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              
              {/* Upload Button - Clicking this opens file explorer */}
              <button
                type="button"
                onClick={() => document.getElementById('imageFileInput').click()}
                className="upload-btn"
                disabled={uploading}
              >
                {uploading ? '📤 Uploading...' : '📁 Select Image from Computer'}
              </button>
              
              {/* Image preview after upload */}
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Product preview" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="remove-image-btn"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <small className="upload-hint">
                Click the button above to select an image from your computer.<br />
                Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
              </small>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;