import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ConfirmModal from '../common/ConfirmModal';
import './CategoryTable.css';

const CategoryTable = ({ categories, onEdit, onDelete, loading }) => {
  const [deleteModal, setDeleteModal] = useState({ show: false, category: null });

  const handleDeleteClick = (category) => {
    setDeleteModal({ show: true, category });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.category) {
      onDelete(deleteModal.category._id);
    }
    setDeleteModal({ show: false, category: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, category: null });
  };

  if (loading) {
    return (
      <div className="category-table-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="category-table">
        <div className="table-header">
          <h3>Categories</h3>
          <Link to="/admin/categories/new" className="add-btn">
            <i className="fas fa-plus"></i>
            Add Category
          </Link>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="category-name">{category.name}</td>
                  <td>{category.slug}</td>
                  <td className="category-description">{category.description || '-'}</td>
                  <td>{category.productCount || 0}</td>
                  <td>
                    <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(category)}
                        className="edit-btn"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(category)}
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

        {categories.length === 0 && (
          <div className="no-categories">
            <p>No categories found</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.show}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteModal.category?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default CategoryTable;