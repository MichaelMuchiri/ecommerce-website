import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete, loading }) => {
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

  const handleDeleteClick = (product) => {
    setDeleteModal({ show: true, product });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.product) {
      onDelete(deleteModal.product._id);
    }
    setDeleteModal({ show: false, product: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, product: null });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  if (loading) {
    return (
      <div className="product-table-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="product-table">
        <div className="table-header">
          <h3>Products</h3>
          <Link to="/admin/products/new" className="add-btn">
            <i className="fas fa-plus"></i>
            Add Product
          </Link>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="product-image">
                      <img 
                        src={product.images?.[0]?.url || '/images/placeholder.jpg'} 
                        alt={product.name}
                      />
                    </div>
                  </td>
                  <td className="product-name">{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category?.name || 'N/A'}</td>
                  <td>${product.price?.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${getStockStatus(product.quantity)}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(product)}
                        className="edit-btn"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="delete-btn"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.show}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteModal.product?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default ProductTable;