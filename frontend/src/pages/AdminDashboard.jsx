import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardStats from '../components/admin/DashboardStats';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import SalesChart from '../components/admin/SalesChart';
import ProductTable from '../components/admin/ProductTable';
import ProductForm from '../components/admin/ProductForm';
import OrderTable from '../components/admin/OrderTable';
import UserTable from '../components/admin/UserTable';
import CategoryTable from '../components/admin/CategoryTable';
import CategoryForm from '../components/admin/CategoryForm';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load dashboard stats
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders);
      setSalesData(response.data.salesData);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  // Product Management
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await adminService.getProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await adminService.createProduct(productData);
      toast.success('Product created successfully');
      navigate('/admin/products');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      await adminService.updateProduct(id, productData);
      toast.success('Product updated successfully');
      navigate('/admin/products');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  // Order Management
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await adminService.getOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id, statusData) => {
    try {
      await adminService.updateOrderStatus(id, statusData);
      toast.success('Order status updated');
      fetchOrders();
      fetchDashboardStats(); // Refresh stats
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  // User Management
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateUserRole = async (id, role) => {
    try {
      await adminService.updateUserRole(id, role);
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
      fetchDashboardStats(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Category Management
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await adminService.getCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      await adminService.createCategory(categoryData);
      toast.success('Category created successfully');
      navigate('/admin/categories');
      fetchCategories();
      fetchDashboardStats(); // Refresh stats
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const handleUpdateCategory = async (id, categoryData) => {
    try {
      await adminService.updateCategory(id, categoryData);
      toast.success('Category updated successfully');
      navigate('/admin/categories');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await adminService.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
      fetchDashboardStats(); // Refresh stats
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      
      <div className="admin-content">
        <div className="content-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your store today.</p>
        </div>

        <Routes>
          {/* Dashboard Home */}
          <Route
            index
            element={
              <>
                <DashboardStats stats={stats} />
                <SalesChart data={salesData} />
                <RecentOrdersTable orders={recentOrders} />
              </>
            }
          />

          {/* Product Routes */}
          <Route
            path="products"
            element={
              <ProductTable
                products={products}
                onEdit={(product) => navigate(`/admin/products/edit/${product._id}`)}
                onDelete={handleDeleteProduct}
                loading={productsLoading}
              />
            }
          />
          <Route
            path="products/new"
            element={
              <ProductForm
                categories={categories}
                onSubmit={handleCreateProduct}
                loading={productsLoading}
              />
            }
          />
          <Route
            path="products/edit/:id"
            element={
              <ProductForm
                product={products.find(p => p._id === window.location.pathname.split('/').pop())}
                categories={categories}
                onSubmit={(data) => handleUpdateProduct(
                  window.location.pathname.split('/').pop(),
                  data
                )}
                loading={productsLoading}
              />
            }
          />

          {/* Order Routes */}
          <Route
            path="orders"
            element={
              <OrderTable
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
                loading={ordersLoading}
              />
            }
          />

          {/* User Routes */}
          <Route
            path="users"
            element={
              <UserTable
                users={users}
                onUpdateRole={handleUpdateUserRole}
                onDelete={handleDeleteUser}
                loading={usersLoading}
              />
            }
          />

          {/* Category Routes */}
          <Route
            path="categories"
            element={
              <CategoryTable
                categories={categories}
                onEdit={(category) => navigate(`/admin/categories/edit/${category._id}`)}
                onDelete={handleDeleteCategory}
                loading={categoriesLoading}
              />
            }
          />
          <Route
            path="categories/new"
            element={
              <CategoryForm
                onSubmit={handleCreateCategory}
                loading={categoriesLoading}
              />
            }
          />
          <Route
            path="categories/edit/:id"
            element={
              <CategoryForm
                category={categories.find(c => c._id === window.location.pathname.split('/').pop())}
                onSubmit={(data) => handleUpdateCategory(
                  window.location.pathname.split('/').pop(),
                  data
                )}
                loading={categoriesLoading}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;