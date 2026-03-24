const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ========== MIDDLEWARE ==========
// CORS configuration - handles multiple origins
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'https://ecommerce-api-btlv.onrender.com'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== BASIC TEST ROUTE ==========
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the E-commerce API',
    status: 'success',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      admin: '/api/admin'
    }
  });
});

// ========== API ROUTES ==========
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ========== TEST ROUTES (optional) ==========
app.get('/api/test/create-test-user', async (req, res) => {
  try {
    const { User } = require('./models');
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    res.json({ success: true, message: 'Test user created', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/test/users', async (req, res) => {
  try {
    const { User } = require('./models');
    const users = await User.find();
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== DATABASE CONNECTION ==========
// Accept either MONGODB_URI or MONGODB_URL
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerce';
const PORT = process.env.PORT || 5000;

// Mask password for logging (works for both SRV and Standard)
let maskedUri = MONGODB_URI;
try {
  maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
} catch (e) {
  maskedUri = 'Unable to mask (check connection string format)';
}
console.log(`🔌 Connecting to MongoDB: ${maskedUri}`);

// Connection options for Standard connection
const mongooseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // For Standard connection, these are usually handled automatically
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(MONGODB_URI, mongooseOptions)
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  console.log(`🔗 Host: ${mongoose.connection.host}`);
  console.log(`🔌 Port: ${mongoose.connection.port}`);

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('\n💡 Troubleshooting:');
  console.error('  1. Check your connection string format (Standard vs SRV)');
  console.error('  2. Verify your database password is correct');
  console.error('  3. Ensure your IP is whitelisted in MongoDB Atlas');
  console.error('  4. Check if the replica set name is correct');
  console.error('  5. Make sure the database name "/ecommerce" is included');
  console.error('\n   Connection string format should be:');
  console.error('   mongodb://username:password@host1:27017,host2:27017/database?replicaSet=xxx&ssl=true');
  process.exit(1);
});

// ========== ERROR HANDLING MIDDLEWARE ==========
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});