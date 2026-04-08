const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

// Method 1: Update your existing user to admin
// CHANGE THIS EMAIL to the one you registered with
const yourEmail = 'emmanuelk1@gmail.com';

console.log('=== FIXING ADMIN ACCESS ===\n');

// First, check existing users
db.all('SELECT id, name, email, role FROM users', [], (err, users) => {
  if (err) {
    console.error('Error:', err.message);
    db.close();
    return;
  }
  
  console.log('Current users:');
  users.forEach(u => {
    console.log(`  ID:${u.id} | ${u.email} | Role: ${u.role}`);
  });
  
  console.log('\n---');
  
  // Update the user to admin
  db.run('UPDATE users SET role = "admin" WHERE email = ?', [yourEmail], function(err) {
    if (err) {
      console.error('Update error:', err.message);
    } else if (this.changes === 0) {
      console.log(`❌ User "${yourEmail}" not found!`);
      console.log('\nTry one of these emails instead:');
      users.forEach(u => {
        console.log(`   - ${u.email}`);
      });
    } else {
      console.log(`✅ SUCCESS! User "${yourEmail}" is now an ADMIN!`);
      console.log('\n👉 Next steps:');
      console.log('   1. Logout from your website');
      console.log('   2. Login again');
      console.log('   3. Click the Admin link in the navbar');
    }
    db.close();
  });
});