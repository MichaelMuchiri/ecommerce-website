const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

// Admin user details - CHANGE THESE
const admin = {
  name: 'Admin User',
  email: 'emmanuelk12@gmail.com',
  password: 'murimi',
  role: 'admin'
};

// Hash password
const hashedPassword = bcrypt.hashSync(admin.password, 10);

// Insert admin user
db.run(`INSERT OR REPLACE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
  [admin.name, admin.email, hashedPassword, admin.role],
  function(err) {
    if (err) {
      console.error('Error creating admin:', err.message);
    } else {
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${admin.password}`);
      console.log(`   Role: ${admin.role}`);
    }
    db.close();
  }
);