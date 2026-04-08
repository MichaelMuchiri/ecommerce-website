const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('========================================');
console.log('Testing MongoDB Atlas Connection');
console.log('========================================');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  process.exit(1);
}

// Mask password in log
const maskedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
console.log('Connection string:', maskedUri);
console.log('');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔌 Host:', mongoose.connection.host);
    console.log('========================================');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED to connect');
    console.error('Error:', error.message);
    console.log('');
    console.log('💡 Common fixes:');
    console.log('1. Check your password is correct');
    console.log('2. Make sure IP is whitelisted (0.0.0.0/0)');
    console.log('3. Verify cluster name is "cluster0"');
    console.log('========================================');
    process.exit(1);
  });