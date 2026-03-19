import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: '/admin/products', icon: 'fas fa-box', label: 'Products' },
    { path: '/admin/orders', icon: 'fas fa-shopping-cart', label: 'Orders' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Users' },
    { path: '/admin/categories', icon: 'fas fa-tags', label: 'Categories' },
  ];

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'nav-link active' : 'nav-link'
            }
            end={item.path === '/admin'}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="nav-link">
          <i className="fas fa-store"></i>
          <span>Back to Store</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;