import React from 'react';
import { Link } from 'react-router-dom';
import './RecentOrdersTable.css';

const RecentOrdersTable = ({ orders }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="recent-orders-table">
      <div className="table-header">
        <h3>Recent Orders</h3>
        <Link to="/admin/orders" className="view-all">View All</Link>
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.slice(-8)}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>${order.totalPrice?.toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <span className={`payment-badge ${order.isPaid ? 'paid' : 'unpaid'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/orders/${order._id}`} className="view-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="no-orders">
          <p>No recent orders</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;