import React, { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal';
import './UserTable.css';

const UserTable = ({ users, onUpdateRole, onDelete, loading }) => {
  const [roleModal, setRoleModal] = useState({ show: false, user: null, newRole: '' });
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRoleClick = (user, newRole) => {
    setRoleModal({ show: true, user, newRole });
  };

  const handleRoleConfirm = () => {
    if (roleModal.user && roleModal.newRole) {
      onUpdateRole(roleModal.user._id, roleModal.newRole);
    }
    setRoleModal({ show: false, user: null, newRole: '' });
  };

  const handleRoleCancel = () => {
    setRoleModal({ show: false, user: null, newRole: '' });
  };

  const handleDeleteClick = (user) => {
    setDeleteModal({ show: true, user });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.user) {
      onDelete(deleteModal.user._id);
    }
    setDeleteModal({ show: false, user: null });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ show: false, user: null });
  };

  if (loading) {
    return (
      <div className="user-table-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="user-table">
        <div className="table-header">
          <h3>Users</h3>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="user-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{user.orderCount || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleClick(user, e.target.value)}
                        className="role-select"
                        disabled={user._id === JSON.parse(localStorage.getItem('user'))?._id}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="delete-btn"
                        title="Delete"
                        disabled={user._id === JSON.parse(localStorage.getItem('user'))?._id}
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

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={roleModal.show}
        title="Update User Role"
        message={`Are you sure you want to change ${roleModal.user?.name}'s role to "${roleModal.newRole}"?`}
        onConfirm={handleRoleConfirm}
        onCancel={handleRoleCancel}
      />

      <ConfirmModal
        isOpen={deleteModal.show}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteModal.user?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default UserTable;