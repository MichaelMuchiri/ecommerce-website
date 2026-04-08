const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

// 👇 CHANGE THIS TO YOUR EMAIL ADDRESS
const email = 'ema2@gmail.com'; 

console.log('Updating user to admin...');

db.run('UPDATE users SET role = "admin" WHERE email = ?', [email], function(err) {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log(`Updated ${this.changes} user(s) to admin role`);
    
    db.get('SELECT id, name, email, role FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Verify error:', err.message);
      } else if (user) {
        console.log(`\n✅ User found:`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
      } else {
        console.log('User not found - check your email address');
      }
      db.close();
    });
  }
});