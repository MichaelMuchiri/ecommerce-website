import React, { useState } from 'react';
import ConfirmModal from '../common/ConfirmModal';
import './OrderTable.css';

const OrderTable = ({ orders, onUpdateStatus, loading }) => {
  const [statusModal, setStatusModal] = useState({ show: false, order: null, newStatus: '' });

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusClick = (order, newStatus) => {
    setStatusModal({ show: true, order, newStatus });
  };

  const handleStatusConfirm = () => {
    if (statusModal.order && statusModal.newStatus) {
      onUpdateStatus(statusModal.order._id, { 
        orderStatus: statusModal.newStatus,
        isDelivered: statusModal.newStatus === 'delivered'
      });
    }
    setStatusModal({ show: false, order: null, newStatus: '' });
  };

  const handleStatusCancel = () => {
    setStatusModal({ show: false, order: null, newStatus: '' });
  };

  if (loading) {
    return (
      <div className="order-table-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="order-table">
        <div className="table-header">
          <h3>Orders</h3>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order.invoiceNumber || order._id.slice(-8)}</td>
                  <td>
                    <div className="customer-info">
                      <strong>{order.user?.name || 'N/A'}</strong>
                      <small>{order.user?.email || ''}</small>
                    </div>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.orderItems?.length || 0}</td>
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
                    <div className="status-actions">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusClick(order, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={statusModal.show}
        title="Update Order Status"
        message={`Are you sure you want to change order status to "${statusModal.newStatus}"?`}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
      />
    </>
  );
};

export default OrderTable;