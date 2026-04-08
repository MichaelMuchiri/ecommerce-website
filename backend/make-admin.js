const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'ecommerce.db'));

const email = 'emmanuelk1@gmail.com'; 

db.run('UPDATE users SET role = "admin" WHERE email = ?', [email], function(err) {
  if (err) {
    console.error('Error:', err.message);
  } else if (this.changes === 0) {
    console.log('User not found');
  } else {
    console.log(`User ${email} is now an admin!`);
  }
  db.close();
});