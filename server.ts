import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from 'cors';

const db = new Database('inventory.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- global_admin, manager, employee
    unit_id INTEGER, -- NULL for global_admin
    name TEXT,
    email TEXT,
    phone TEXT,
    photo_url TEXT,
    FOREIGN KEY (unit_id) REFERENCES units(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 5,
    max_quantity INTEGER DEFAULT 50,
    unit TEXT DEFAULT 'un',
    active INTEGER DEFAULT 1, -- 1 for active, 0 for disabled
    image_url TEXT,
    FOREIGN KEY (unit_id) REFERENCES units(id)
  );

  CREATE TABLE IF NOT EXISTS inventory_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS template_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT DEFAULT 'un',
    min_quantity INTEGER DEFAULT 5,
    max_quantity INTEGER DEFAULT 50,
    FOREIGN KEY (template_id) REFERENCES inventory_templates(id)
  );
`);

// Migration: Add unit_id and active columns if they don't exist
const columns = db.prepare("PRAGMA table_info(products)").all() as any[];
if (!columns.find(c => c.name === 'unit_id')) {
  db.exec("ALTER TABLE products ADD COLUMN unit_id INTEGER");
}
if (!columns.find(c => c.name === 'min_quantity')) {
  db.exec("ALTER TABLE products ADD COLUMN min_quantity INTEGER DEFAULT 5");
}
if (!columns.find(c => c.name === 'max_quantity')) {
  db.exec("ALTER TABLE products ADD COLUMN max_quantity INTEGER DEFAULT 50");
}
if (!columns.find(c => c.name === 'active')) {
  db.exec("ALTER TABLE products ADD COLUMN active INTEGER DEFAULT 1");
}
if (!columns.find(c => c.name === 'image_url')) {
  db.exec("ALTER TABLE products ADD COLUMN image_url TEXT");
}

const userColumns = db.prepare("PRAGMA table_info(users)").all() as any[];
if (!userColumns.find(c => c.name === 'unit_id')) {
  db.exec("ALTER TABLE users ADD COLUMN unit_id INTEGER");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER,
    user_id INTEGER,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS request_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    request_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (request_id) REFERENCES requests(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER,
    product_id INTEGER,
    user_id INTEGER,
    quantity INTEGER NOT NULL,
    usage_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unit_id) REFERENCES units(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const requestColumns = db.prepare("PRAGMA table_info(requests)").all() as any[];
if (!requestColumns.find(c => c.name === 'unit_id')) {
  db.exec("ALTER TABLE requests ADD COLUMN unit_id INTEGER");
}

const usageColumns = db.prepare("PRAGMA table_info(usage_logs)").all() as any[];
if (!usageColumns.find(c => c.name === 'unit_id')) {
  db.exec("ALTER TABLE usage_logs ADD COLUMN unit_id INTEGER");
}

// Seed initial data if empty or missing superadmin
const superAdminExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?').get('superadmin') as { count: number };
if (superAdminExists.count === 0) {
  // Ensure at least one unit exists
  let mainUnitId: number | bigint;
  const unitCount = db.prepare('SELECT COUNT(*) as count FROM units').get() as { count: number };
  if (unitCount.count === 0) {
    const unitResult = db.prepare('INSERT INTO units (name, address) VALUES (?, ?)').run('Sede Principal', 'Av. Paulista, 1000');
    mainUnitId = unitResult.lastInsertRowid;
  } else {
    const firstUnit = db.prepare('SELECT id FROM units LIMIT 1').get() as { id: number };
    mainUnitId = firstUnit.id;
  }

  // Create Global Admin
  const insertUser = db.prepare('INSERT INTO users (username, password, role, unit_id, name, email) VALUES (?, ?, ?, ?, ?, ?)');
  db.prepare('INSERT INTO users (username, password, role, unit_id, name, email) VALUES (?, ?, ?, ?, ?, ?)').run('superadmin', 'superadmin123', 'global_admin', null, 'Administrador Global', 'global@empresa.com');
  
  // If it was completely empty, add other defaults
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (totalUsers.count === 1) { // Only superadmin was just added
    // Create Unit Manager
    insertUser.run('admin', 'admin123', 'manager', mainUnitId, 'Gestor Sede Principal', 'admin@empresa.com');
    
    // Create Employee
    insertUser.run('user', 'user123', 'employee', mainUnitId, 'Funcionário Silva', 'silva@empresa.com');

    const insertProd = db.prepare('INSERT INTO products (unit_id, name, category, quantity, unit) VALUES (?, ?, ?, ?, ?)');
    insertProd.run(mainUnitId, 'Papel A4', 'Escritório', 50, 'resma');
    insertProd.run(mainUnitId, 'Caneta Azul', 'Escritório', 100, 'un');
    insertProd.run(mainUnitId, 'Grampeador', 'Escritório', 10, 'un');
    insertProd.run(mainUnitId, 'Cabo HDMI', 'TI', 5, 'un');

    // Create a template
    const templateResult = db.prepare('INSERT INTO inventory_templates (name, description) VALUES (?, ?)').run('Escritório Padrão', 'Template com itens básicos de escritório');
    const templateId = templateResult.lastInsertRowid;

    const insertTemplateItem = db.prepare('INSERT INTO template_items (template_id, name, category, unit) VALUES (?, ?, ?, ?)');
    insertTemplateItem.run(templateId, 'Papel A4', 'Escritório', 'resma');
    insertTemplateItem.run(templateId, 'Caneta Azul', 'Escritório', 'un');
    insertTemplateItem.run(templateId, 'Grampeador', 'Escritório', 'un');
  }
}

// Ensure all existing users have a unit_id if they are not global_admin
const unitForMigration = db.prepare('SELECT id FROM units LIMIT 1').get() as { id: number };
if (unitForMigration) {
  db.prepare('UPDATE users SET unit_id = ? WHERE unit_id IS NULL AND role != ?').run(unitForMigration.id, 'global_admin');
  db.prepare('UPDATE products SET unit_id = ? WHERE unit_id IS NULL').run(unitForMigration.id);
  db.prepare('UPDATE requests SET unit_id = ? WHERE unit_id IS NULL').run(unitForMigration.id);
  db.prepare('UPDATE usage_logs SET unit_id = ? WHERE unit_id IS NULL').run(unitForMigration.id);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Auth Routes
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password) as any;
    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });

  // User Management
  app.get('/api/users', (req, res) => {
    const { unit_id } = req.query;
    let users;
    if (unit_id) {
      users = db.prepare('SELECT id, username, role, unit_id, name, email, phone, photo_url FROM users WHERE unit_id = ?').all(unit_id);
    } else {
      users = db.prepare('SELECT id, username, role, unit_id, name, email, phone, photo_url FROM users').all();
    }
    res.json(users);
  });

  app.post('/api/users', (req, res) => {
    const { username, password, role, name, email, phone, unit_id } = req.body;
    try {
      const safePhone = phone || null;
      const safeUnitId = unit_id || null;
      const result = db.prepare('INSERT INTO users (username, password, role, unit_id, name, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)').run(username, password, role, safeUnitId, name, email, safePhone);
      res.json({ id: result.lastInsertRowid });
    } catch (e) {
      res.status(400).json({ error: 'Usuário já existe' });
    }
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        return res.json({ success: true, message: 'Se o email existir, uma nova senha será enviada.' });
      }
      
      const newPassword = Math.random().toString(36).slice(-8);
      db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newPassword, user.id);
      
      console.log(`\n[MOCK EMAIL] Para: ${email} | Assunto: Recuperação de Senha | Nova Senha: ${newPassword}\n`);
      
      res.json({ success: true, message: 'Se o email existir, uma nova senha será enviada.' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao processar solicitação.' });
    }
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, photo_url, username, role, password } = req.body;
    try {
      const safePhone = phone || null;
      const safePhotoUrl = photo_url || null;
      
      if (username && role) {
        if (password) {
          db.prepare('UPDATE users SET name = ?, email = ?, phone = ?, photo_url = ?, username = ?, role = ?, password = ? WHERE id = ?').run(name, email, safePhone, safePhotoUrl, username, role, password, id);
        } else {
          db.prepare('UPDATE users SET name = ?, email = ?, phone = ?, photo_url = ?, username = ?, role = ? WHERE id = ?').run(name, email, safePhone, safePhotoUrl, username, role, id);
        }
      } else {
        if (password) {
          db.prepare('UPDATE users SET name = ?, email = ?, phone = ?, photo_url = ?, password = ? WHERE id = ?').run(name, email, safePhone, safePhotoUrl, password, id);
        } else {
          db.prepare('UPDATE users SET name = ?, email = ?, phone = ?, photo_url = ? WHERE id = ?').run(name, email, safePhone, safePhotoUrl, id);
        }
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: 'Nome de usuário ou email já existe.' });
      } else {
        res.status(500).json({ error: 'Erro ao atualizar usuário.' });
      }
    }
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    try {
      // Check if trying to delete the last manager or current user could be handled in frontend
      // but here we just ensure data integrity
      const deleteUsageLogs = db.prepare('DELETE FROM usage_logs WHERE user_id = ?');
      const deleteRequestItems = db.prepare('DELETE FROM request_items WHERE request_id IN (SELECT id FROM requests WHERE user_id = ?)');
      const deleteRequests = db.prepare('DELETE FROM requests WHERE user_id = ?');
      const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');

      const transaction = db.transaction(() => {
        deleteUsageLogs.run(id);
        deleteRequestItems.run(id);
        deleteRequests.run(id);
        deleteUser.run(id);
      });

      transaction();
      res.json({ success: true });
    } catch (e) {
      console.error('Error deleting user:', e);
      res.status(500).json({ error: 'Erro ao excluir usuário do banco de dados' });
    }
  });

  // API Routes
  app.get('/api/products', (req, res) => {
    const { unit_id } = req.query;
    let products;
    if (unit_id) {
      products = db.prepare('SELECT * FROM products WHERE unit_id = ?').all(unit_id);
    } else {
      products = db.prepare('SELECT * FROM products').all();
    }
    res.json(products);
  });

  app.post('/api/products', (req, res) => {
    const { name, category, quantity, unit, min_quantity, max_quantity, active, unit_id, image_url } = req.body;
    
    if (!unit_id) return res.status(400).json({ error: 'unit_id é obrigatório' });

    // Check if product with same name exists in this unit
    const existing = db.prepare('SELECT id FROM products WHERE name = ? AND unit_id = ?').get(name, unit_id) as any;
    
    const isActive = active !== undefined ? active : (quantity > 0 ? 1 : 0);

    if (existing) {
      // Update existing product information
      db.prepare('UPDATE products SET category = ?, quantity = ?, unit = ?, min_quantity = ?, max_quantity = ?, active = ?, image_url = ? WHERE id = ?')
        .run(category, quantity, unit, min_quantity, max_quantity, isActive, image_url, existing.id);
      res.json({ id: existing.id, updated: true });
    } else {
      // Insert new product
      const result = db.prepare('INSERT INTO products (unit_id, name, category, quantity, unit, min_quantity, max_quantity, active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(unit_id, name, category, quantity, unit, min_quantity || 5, max_quantity || 50, isActive, image_url);
      res.json({ id: result.lastInsertRowid, updated: false });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, quantity, unit, min_quantity, max_quantity, active, image_url } = req.body;
    const isActive = active !== undefined ? active : (quantity > 0 ? 1 : 0);
    
    const existing = db.prepare('SELECT image_url FROM products WHERE id = ?').get(id) as any;
    const finalImageUrl = image_url && image_url.trim() !== '' ? image_url : existing?.image_url;

    db.prepare('UPDATE products SET name = ?, category = ?, quantity = ?, unit = ?, min_quantity = ?, max_quantity = ?, active = ?, image_url = ? WHERE id = ?')
      .run(name, category, quantity, unit, min_quantity, max_quantity, isActive, finalImageUrl, id);
    res.json({ success: true });
  });

  app.patch('/api/products/:id/toggle', (req, res) => {
    const { id } = req.params;
    const product = db.prepare('SELECT active, quantity FROM products WHERE id = ?').get(id) as any;
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    
    const newStatus = product.active === 1 ? 0 : 1;
    // If trying to enable but quantity is 0, maybe we should allow it but warn? 
    // The user said "when stock is empty it will be disabled", so enabling with 0 stock might be contradictory.
    // But let's allow manual toggle.
    
    db.prepare('UPDATE products SET active = ? WHERE id = ?').run(newStatus, id);
    res.json({ active: newStatus });
  });

  app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    try {
      // Start a transaction to ensure data integrity
      const deleteRelatedItems = db.prepare('DELETE FROM request_items WHERE product_id = ?');
      const deleteUsageLogs = db.prepare('DELETE FROM usage_logs WHERE product_id = ?');
      const deleteProduct = db.prepare('DELETE FROM products WHERE id = ?');

      const transaction = db.transaction(() => {
        deleteRelatedItems.run(id);
        deleteUsageLogs.run(id);
        deleteProduct.run(id);
      });

      transaction();
      res.json({ success: true });
    } catch (e) {
      console.error('Error deleting product:', e);
      res.status(500).json({ error: 'Erro ao excluir produto do banco de dados' });
    }
  });

  app.get('/api/requests', (req, res) => {
    const { unit_id } = req.query;
    let requests;
    if (unit_id) {
      requests = db.prepare(`
        SELECT r.*, u.name as employee_name 
        FROM requests r 
        JOIN users u ON r.user_id = u.id
        WHERE r.unit_id = ?
        ORDER BY r.request_date DESC
      `).all(unit_id) as any[];
    } else {
      requests = db.prepare(`
        SELECT r.*, u.name as employee_name 
        FROM requests r 
        JOIN users u ON r.user_id = u.id
        ORDER BY r.request_date DESC
      `).all() as any[];
    }

    const requestsWithItems = requests.map(r => {
      const items = db.prepare(`
        SELECT ri.*, p.name as product_name, p.unit
        FROM request_items ri
        JOIN products p ON ri.product_id = p.id
        WHERE ri.request_id = ?
      `).all(r.id);
      return { ...r, items };
    });

    res.json(requestsWithItems);
  });

  app.post('/api/requests', (req, res) => {
    const { user_id, items, unit_id } = req.body; // items: [{product_id, quantity}]
    
    if (!unit_id) return res.status(400).json({ error: 'unit_id é obrigatório' });

    const transaction = db.transaction(() => {
      const requestResult = db.prepare('INSERT INTO requests (user_id, unit_id) VALUES (?, ?)').run(user_id, unit_id);
      const requestId = requestResult.lastInsertRowid;

      const insertItem = db.prepare('INSERT INTO request_items (request_id, product_id, quantity) VALUES (?, ?, ?)');
      for (const item of items) {
        insertItem.run(requestId, item.product_id, item.quantity);
      }
      return requestId;
    });

    try {
      const id = transaction();
      res.json({ id });
    } catch (e) {
      res.status(500).json({ error: 'Erro ao processar pedido' });
    }
  });

  app.patch('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const transaction = db.transaction(() => {
      const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(id) as any;
      if (!request) throw new Error('Pedido não encontrado');

      if (status === 'approved' && request.status === 'pending') {
        const items = db.prepare('SELECT * FROM request_items WHERE request_id = ?').all(id) as any[];
        for (const item of items) {
          const product = db.prepare('SELECT quantity FROM products WHERE id = ?').get(item.product_id) as { quantity: number };
          if (product.quantity < item.quantity) {
            throw new Error(`Estoque insuficiente para o produto ID ${item.product_id}`);
          }
          db.prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?').run(item.quantity, item.product_id);
          
          // Auto-disable if stock reaches zero
          const updatedProduct = db.prepare('SELECT quantity FROM products WHERE id = ?').get(item.product_id) as { quantity: number };
          if (updatedProduct.quantity <= 0) {
            db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(item.product_id);
          }
        }
      }

      db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, id);
    });

    try {
      transaction();
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/usage', (req, res) => {
    const { unit_id } = req.query;
    let logs;
    if (unit_id) {
      logs = db.prepare(`
        SELECT u.*, p.name as product_name, us.name as employee_name
        FROM usage_logs u 
        JOIN products p ON u.product_id = p.id
        JOIN users us ON u.user_id = us.id
        WHERE u.unit_id = ?
        ORDER BY u.usage_date DESC
      `).all(unit_id);
    } else {
      logs = db.prepare(`
        SELECT u.*, p.name as product_name, us.name as employee_name
        FROM usage_logs u 
        JOIN products p ON u.product_id = p.id
        JOIN users us ON u.user_id = us.id
        ORDER BY u.usage_date DESC
      `).all();
    }
    res.json(logs);
  });

  app.post('/api/usage', (req, res) => {
    const { product_id, user_id, quantity, unit_id } = req.body;
    
    if (!unit_id) return res.status(400).json({ error: 'unit_id é obrigatório' });

    const product = db.prepare('SELECT quantity FROM products WHERE id = ?').get(product_id) as { quantity: number };
    if (!product || product.quantity < quantity) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    db.prepare('UPDATE products SET quantity = quantity - ? WHERE id = ?').run(quantity, product_id);
    
    // Auto-disable if stock reaches zero
    const updatedProduct = db.prepare('SELECT quantity FROM products WHERE id = ?').get(product_id) as { quantity: number };
    if (updatedProduct.quantity <= 0) {
      db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(product_id);
    }

    const result = db.prepare('INSERT INTO usage_logs (product_id, user_id, quantity, unit_id) VALUES (?, ?, ?, ?)').run(product_id, user_id, quantity, unit_id);
    res.json({ id: result.lastInsertRowid });
  });

  app.get('/api/stats/global', (req, res) => {
    const units = db.prepare('SELECT * FROM units').all() as any[];
    const replenishmentStats = units.map(unit => {
      const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE quantity <= min_quantity AND unit_id = ?').get(unit.id) as { count: number };
      return {
        unit_id: unit.id,
        unit_name: unit.name,
        low_stock_count: lowStockCount.count
      };
    }).filter(s => s.low_stock_count > 0);
    
    res.json(replenishmentStats);
  });

  app.get('/api/stats', (req, res) => {
    const { unit_id } = req.query;
    
    let topUsageQuery = `
      SELECT p.name, SUM(total_qty) as total 
      FROM (
        SELECT product_id, SUM(quantity) as total_qty FROM usage_logs ${unit_id ? 'WHERE unit_id = ?' : ''} GROUP BY product_id
        UNION ALL
        SELECT ri.product_id, SUM(ri.quantity) as total_qty 
        FROM request_items ri 
        JOIN requests r ON ri.request_id = r.id 
        WHERE r.status = 'approved' ${unit_id ? 'AND r.unit_id = ?' : ''}
        GROUP BY ri.product_id
      ) combined
      JOIN products p ON combined.product_id = p.id
      GROUP BY p.id
      ORDER BY total DESC
      LIMIT 10
    `;

    const topUsage = unit_id ? db.prepare(topUsageQuery).all(unit_id, unit_id) : db.prepare(topUsageQuery).all();

    // Low stock items (Reposição)
    let lowStockQuery = `
      SELECT * FROM products 
      WHERE quantity <= min_quantity ${unit_id ? 'AND unit_id = ?' : ''}
      ORDER BY quantity ASC
    `;
    const lowStock = unit_id ? db.prepare(lowStockQuery).all(unit_id) : db.prepare(lowStockQuery).all();

    // Summary stats
    let summaryQuery = `
      SELECT 
        (SELECT COUNT(*) FROM products ${unit_id ? 'WHERE unit_id = ?' : ''}) as total_products,
        (SELECT COUNT(*) FROM requests WHERE status = 'pending' ${unit_id ? 'AND unit_id = ?' : ''}) as pending_requests,
        (SELECT SUM(quantity) FROM products ${unit_id ? 'WHERE unit_id = ?' : ''}) as total_items_in_stock
    `;
    const summary = unit_id ? db.prepare(summaryQuery).get(unit_id, unit_id, unit_id) : db.prepare(summaryQuery).get();

    res.json({ topUsage, lowStock, summary });
  });

  // Multi-Unit Management
  app.get('/api/units', (req, res) => {
    const units = db.prepare('SELECT * FROM units').all();
    res.json(units);
  });

  app.post('/api/units', (req, res) => {
    const { name, address } = req.body;
    const result = db.prepare('INSERT INTO units (name, address) VALUES (?, ?)').run(name, address);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/units/:id', (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;
    db.prepare('UPDATE units SET name = ?, address = ? WHERE id = ?').run(name, address, id);
    res.json({ success: true });
  });

  app.delete('/api/units/:id', (req, res) => {
    const { id } = req.params;
    const transaction = db.transaction(() => {
      // Delete everything related to this unit
      db.prepare('DELETE FROM usage_logs WHERE unit_id = ?').run(id);
      db.prepare('DELETE FROM request_items WHERE request_id IN (SELECT id FROM requests WHERE unit_id = ?)').run(id);
      db.prepare('DELETE FROM requests WHERE unit_id = ?').run(id);
      db.prepare('DELETE FROM products WHERE unit_id = ?').run(id);
      db.prepare('DELETE FROM users WHERE unit_id = ?').run(id);
      db.prepare('DELETE FROM units WHERE id = ?').run(id);
    });
    transaction();
    res.json({ success: true });
  });

  app.get('/api/templates', (req, res) => {
    const templates = db.prepare('SELECT * FROM inventory_templates').all();
    const templatesWithItems = templates.map(t => {
      const items = db.prepare('SELECT * FROM template_items WHERE template_id = ?').all(t.id);
      return { ...t, items };
    });
    res.json(templatesWithItems);
  });

  app.post('/api/templates', (req, res) => {
    const { name, description, items } = req.body;
    const transaction = db.transaction(() => {
      const result = db.prepare('INSERT INTO inventory_templates (name, description) VALUES (?, ?)').run(name, description);
      const templateId = result.lastInsertRowid;
      const insertItem = db.prepare('INSERT INTO template_items (template_id, name, category, unit, min_quantity, max_quantity) VALUES (?, ?, ?, ?, ?, ?)');
      for (const item of items) {
        insertItem.run(templateId, item.name, item.category, item.unit, item.min_quantity, item.max_quantity);
      }
      return templateId;
    });
    const id = transaction();
    res.json({ id });
  });

  app.put('/api/templates/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, items } = req.body;
    const transaction = db.transaction(() => {
      db.prepare('UPDATE inventory_templates SET name = ?, description = ? WHERE id = ?').run(name, description, id);
      db.prepare('DELETE FROM template_items WHERE template_id = ?').run(id);
      const insertItem = db.prepare('INSERT INTO template_items (template_id, name, category, unit, min_quantity, max_quantity) VALUES (?, ?, ?, ?, ?, ?)');
      for (const item of items) {
        insertItem.run(id, item.name, item.category, item.unit, item.min_quantity, item.max_quantity);
      }
    });
    transaction();
    res.json({ success: true });
  });

  app.delete('/api/templates/:id', (req, res) => {
    const { id } = req.params;
    const transaction = db.transaction(() => {
      db.prepare('DELETE FROM template_items WHERE template_id = ?').run(id);
      db.prepare('DELETE FROM inventory_templates WHERE id = ?').run(id);
    });
    transaction();
    res.json({ success: true });
  });

  app.post('/api/units/:id/provision', (req, res) => {
    const { id } = req.params;
    const { template_id } = req.body;
    
    const transaction = db.transaction(() => {
      const items = db.prepare('SELECT * FROM template_items WHERE template_id = ?').all(template_id) as any[];
      const insertProd = db.prepare('INSERT INTO products (unit_id, name, category, quantity, unit, min_quantity, max_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)');
      for (const item of items) {
        insertProd.run(id, item.name, item.category, 0, item.unit, item.min_quantity, item.max_quantity);
      }
    });

    try {
      transaction();
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: 'Erro ao provisionar unidade' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
