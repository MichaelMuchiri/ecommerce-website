import React from 'react';
import './DashboardStats.css';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: 'fas fa-dollar-sign',
      color: '#27ae60'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: 'fas fa-shopping-cart',
      color: '#3498db'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: 'fas fa-box',
      color: '#e67e22'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: 'fas fa-users',
      color: '#9b59b6'
    },
    {
      title: 'Categories',
      value: stats.totalCategories || 0,
      icon: 'fas fa-tags',
      color: '#e74c3c'
    }
  ];

  return (
    <div className="dashboard-stats">
      {statCards.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ background: stat.color }}>
            <i className={stat.icon}></i>
          </div>
          <div className="stat-info">
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;