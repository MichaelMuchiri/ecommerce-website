const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'my_secret_key_12345';

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());

// ========== STATIC FILES (for uploaded images) ==========
// This MUST come before any routes that need to serve files
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// ========== MULTER CONFIGURATION (file upload) ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + unique + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images allowed'));
};
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter });

// ========== HELPER: IS ADMIN MIDDLEWARE ==========
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });

  const hashedPassword = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, 'user'], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) return res.status(400).json({ success: false, message: 'Email already exists' });
      return res.status(500).json({ success: false, message: err.message });
    }
    const token = jwt.sign({ id: this.lastID, email, role: 'user' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, data: { id: this.lastID, name, email, role: 'user', token } });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role, token } });
  });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.get('SELECT id, name, email, phone, address, role FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) return res.status(404).json({ success: false, message: 'User not found' });
      let address = user.address;
      if (address && typeof address === 'string') try { address = JSON.parse(address); } catch(e) { address = { street: address }; }
      res.json({ success: true, data: { ...user, address: address || {} } });
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

app.put('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { name, phone, address } = req.body;
    db.run('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?', [name, phone, JSON.stringify(address), decoded.id], function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get('SELECT id, name, email, phone, address FROM users WHERE id = ?', [decoded.id], (err, user) => {
        res.json({ success: true, message: 'Profile updated', data: user });
      });
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

// ========== PRODUCT ROUTES ==========
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC', (err, products) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: products || [] });
  });
});

app.get('/api/products/featured', (req, res) => {
  db.all('SELECT * FROM products WHERE is_active = 1 LIMIT 8', (err, products) => {
    res.json({ success: true, data: products || [] });
  });
});

app.get('/api/products/top', (req, res) => {
  db.all('SELECT * FROM products WHERE is_active = 1 LIMIT 5', (err, products) => {
    res.json({ success: true, data: products || [] });
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ? AND is_active = 1', [req.params.id], (err, product) => {
    if (err || !product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  });
});

// ========== CATEGORIES ==========
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories WHERE is_active = 1 ORDER BY name', (err, categories) => {
    res.json({ success: true, data: categories || [] });
  });
});

// ========== CART ROUTES ==========
app.get('/api/cart', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ success: true, data: { items: [], total: 0 } });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.all(`SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image FROM carts c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?`, [decoded.id], (err, items) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      const total = items.reduce((s,i) => s + (i.price * i.quantity), 0);
      res.json({ success: true, data: { items, total } });
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

app.post('/api/cart/add', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Please login first' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { productId, quantity = 1 } = req.body;
    db.get('SELECT * FROM carts WHERE user_id = ? AND product_id = ?', [decoded.id, productId], (err, existing) => {
      if (existing) {
        db.run('UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity, decoded.id, productId], (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: 'Cart updated' });
        });
      } else {
        db.run('INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)', [decoded.id, productId, quantity], (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true, message: 'Item added to cart' });
        });
      }
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

app.put('/api/cart/update/:itemId', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Please login first' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?', [req.body.quantity, req.params.itemId, decoded.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Cart updated' });
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

app.delete('/api/cart/remove/:itemId', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Please login first' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('DELETE FROM carts WHERE id = ? AND user_id = ?', [req.params.itemId, decoded.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Item removed' });
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

// ========== ORDERS ==========
app.post('/api/orders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Please login first' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { total, shippingAddress, paymentMethod } = req.body;
    db.run(`INSERT INTO orders (user_id, total, status, shipping_address, payment_method) VALUES (?, ?, 'pending', ?, ?)`,
      [decoded.id, total, JSON.stringify(shippingAddress), paymentMethod], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.run('DELETE FROM carts WHERE user_id = ?', [decoded.id]);
        res.json({ success: true, message: 'Order placed', orderId: this.lastID });
      });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

app.get('/api/orders/myorders', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Please login first' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [decoded.id], (err, orders) => {
      res.json({ success: true, data: orders || [] });
    });
  } catch(err) { res.status(401).json({ success: false, message: 'Invalid token' }); }
});

// ========== ADMIN ROUTES ==========
app.get('/api/admin/stats', isAdmin, (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', [], (_, u) => {
    db.get('SELECT COUNT(*) as count FROM products WHERE is_active = 1', [], (_, p) => {
      db.get('SELECT COUNT(*) as count FROM orders', [], (_, o) => {
        db.get('SELECT SUM(total) as total FROM orders WHERE status != "cancelled"', [], (_, r) => {
          res.json({ success: true, data: { totalUsers: u?.count||0, totalProducts: p?.count||0, totalOrders: o?.count||0, totalRevenue: r?.total||0 } });
        });
      });
    });
  });
});

app.get('/api/admin/products', isAdmin, (req, res) => {
  db.all('SELECT * FROM products ORDER BY created_at DESC', (err, products) => {
    res.json({ success: true, data: products || [] });
  });
});

app.post('/api/admin/products', isAdmin, (req, res) => {
  const { name, price, description, quantity, category, image } = req.body;
  const slug = name.toLowerCase().replace(/ /g, '-');
  db.run(`INSERT INTO products (name, slug, price, description, quantity, category, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [name, slug, price, description, quantity, category, image], function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Product created', id: this.lastID });
    });
});

app.put('/api/admin/products/:id', isAdmin, (req, res) => {
  const { name, price, description, quantity, category, image, is_active } = req.body;
  const slug = name.toLowerCase().replace(/ /g, '-');
  db.run(`UPDATE products SET name=?, slug=?, price=?, description=?, quantity=?, category=?, image=?, is_active=? WHERE id=?`,
    [name, slug, price, description, quantity, category, image, is_active, req.params.id], function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Product updated' });
    });
});

app.delete('/api/admin/products/:id', isAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Product deleted' });
  });
});

app.get('/api/admin/orders', isAdmin, (req, res) => {
  db.all(`SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`, (err, orders) => {
    res.json({ success: true, data: orders || [] });
  });
});

app.put('/api/admin/orders/:id', isAdmin, (req, res) => {
  db.run('UPDATE orders SET status = ? WHERE id = ?', [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Order status updated' });
  });
});

app.get('/api/admin/users', isAdmin, (req, res) => {
  db.all(`SELECT id, name, email, phone, address, role, created_at FROM users ORDER BY id DESC`, (err, users) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const formatted = users.map(u => {
      let addr = u.address;
      if (addr && typeof addr === 'string') try { addr = JSON.parse(addr); } catch(e) { addr = { street: addr }; }
      return { ...u, address: addr || {} };
    });
    res.json({ success: true, data: formatted });
  });
});

app.put('/api/admin/users/:id', isAdmin, (req, res) => {
  db.run('UPDATE users SET role = ? WHERE id = ?', [req.body.role, req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'User role updated' });
  });
});

app.delete('/api/admin/users/:id', isAdmin, (req, res) => {
  if (req.params.id == req.userId) return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
  db.run('DELETE FROM carts WHERE user_id = ?', [req.params.id], () => {
    db.run('DELETE FROM orders WHERE user_id = ?', [req.params.id], () => {
      db.run('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'User deleted' });
      });
    });
  });
});

// ========== UPLOAD ENDPOINT ==========
app.post('/api/admin/upload', isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

// ========== SEED / TEST ROUTES (optional, keep as needed) ==========
app.get('/api/seed-categories', (req, res) => {
  const cats = ['Electronics','Fashion','Home & Living','Sports','Books','Toys'];
  let completed = 0;
  cats.forEach(cat => {
    const slug = cat.toLowerCase().replace(/&/g,'').replace(/ /g,'-');
    db.run('INSERT OR IGNORE INTO categories (name, slug, is_active) VALUES (?, ?, 1)', [cat, slug], () => {
      completed++;
      if (completed === cats.length) res.json({ message: 'Categories seeded' });
    });
  });
});

app.get('/api/seed-products', (req, res) => {
  const products = [
    { name: 'Wireless Headphones', price: 79.99, description: 'Great sound', quantity: 50, category: 'Electronics', image: 'https://via.placeholder.com/300' },
    { name: 'Smart Watch', price: 199.99, description: 'Track fitness', quantity: 30, category: 'Electronics', image: 'https://via.placeholder.com/300' },
    { name: 'Running Shoes', price: 89.99, description: 'Comfortable', quantity: 100, category: 'Fashion', image: 'https://via.placeholder.com/300' }
  ];
  let completed = 0;
  products.forEach(p => {
    const slug = p.name.toLowerCase().replace(/ /g,'-');
    db.run(`INSERT OR IGNORE INTO products (name, slug, price, description, quantity, category, image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [p.name, slug, p.price, p.description, p.quantity, p.category, p.image], () => {
        completed++;
        if (completed === products.length) res.json({ message: 'Products seeded' });
      });
  });
});

app.get('/api/set-admin', (req, res) => {
  db.run('UPDATE users SET role = "admin" WHERE email = "emmanuelk1@gmail.com"', function(err) {
    res.json({ success: !err, message: err ? err.message : `Updated ${this.changes} user(s) to admin` });
  });
});

// ========== ROOT ==========
app.get('/', (req, res) => {
  res.json({ message: 'Ecommerce API running', database: 'SQLite' });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});