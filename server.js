import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// ✅ Store data in safe AppData folder (PERMANENT STORAGE)
const DB_DIR = path.join(process.env.APPDATA, "RestaurantPOS", "data");
const MENU_FILE = path.join(DB_DIR, "menu.json");
const ORDERS_FILE = path.join(DB_DIR, "orders.json");
const CARTS_FILE = path.join(DB_DIR, "carts.json");

// Initialize database directory and files
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const initFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initFile(MENU_FILE, []);
initFile(ORDERS_FILE, []);
initFile(CARTS_FILE, {});



// Helper functions
const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return [];
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ✅ Auto migrate old menu.json from project folder (only first time)
const OLD_MENU_FILE = path.join(__dirname, "data", "menu.json");

if (fs.existsSync(OLD_MENU_FILE)) {
  const currentMenu = readJSON(MENU_FILE);

  if (!currentMenu || currentMenu.length === 0) {
    const oldMenu = readJSON(OLD_MENU_FILE);

    if (oldMenu && oldMenu.length > 0) {
      writeJSON(MENU_FILE, oldMenu);
      console.log("✅ Menu migrated successfully to AppData folder.");
    }
  }
}

app.use(cors());
app.use(express.json());

// ------------------ MENU ROUTES ------------------
app.get("/api/menu", (req, res) => {
  try {
    const items = readJSON(MENU_FILE);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/menu", (req, res) => {
  try {
    const { name, category, price, available } = req.body;
    const items = readJSON(MENU_FILE);

    const newItem = {
      id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
      name,
      category,
      price: parseFloat(price),
      available: available ?? 1,
    };

    items.push(newItem);
    writeJSON(MENU_FILE, items);
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/menu/:id", (req, res) => {
  try {
    const { name, category, price, available } = req.body;
    const items = readJSON(MENU_FILE);

    const index = items.findIndex((item) => item.id === parseInt(req.params.id));

    if (index !== -1) {
      items[index] = {
        id: parseInt(req.params.id),
        name,
        category,
        price: parseFloat(price),
        available,
      };

      writeJSON(MENU_FILE, items);
      res.json(items[index]);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/menu/:id", (req, res) => {
  try {
    const items = readJSON(MENU_FILE);
    const filtered = items.filter((item) => item.id !== parseInt(req.params.id));

    writeJSON(MENU_FILE, filtered);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------ CART ROUTES ------------------
app.get("/api/cart/:tableName", (req, res) => {
  try {
    const carts = readJSON(CARTS_FILE);
    res.json(carts[req.params.tableName] || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart/:tableName", (req, res) => {
  try {
    const { items } = req.body;
    const carts = readJSON(CARTS_FILE);

    carts[req.params.tableName] = items;
    writeJSON(CARTS_FILE, carts);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/cart/:tableName", (req, res) => {
  try {
    const carts = readJSON(CARTS_FILE);

    delete carts[req.params.tableName];
    writeJSON(CARTS_FILE, carts);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------ ORDER ROUTES ------------------
app.post("/api/orders", (req, res) => {
  try {
    const { order_number, table_name, items, subtotal, tax, discount, total } =
      req.body;

    const orders = readJSON(ORDERS_FILE);

    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      order_number,
      table_name,
      items,
      subtotal,
      tax,
      discount,
      total,
      created_at: new Date().toISOString(),
    };

    orders.push(newOrder);
    writeJSON(ORDERS_FILE, orders);

    // Clear cart for this table
    const carts = readJSON(CARTS_FILE);
    delete carts[table_name];
    writeJSON(CARTS_FILE, carts);

    res.json({ id: newOrder.id, order_number });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders", (req, res) => {
  try {
    const { date, table } = req.query;
    let orders = readJSON(ORDERS_FILE);

    if (date) {
      orders = orders.filter((order) => order.created_at.startsWith(date));
    }

    if (table) {
      orders = orders.filter((order) =>
        order.table_name.toLowerCase().includes(table.toLowerCase())
      );
    }

    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders/:id", (req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
    const order = orders.find((o) => o.id === parseInt(req.params.id));

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/orders/next-number", (req, res) => {
  try {
    const orders = readJSON(ORDERS_FILE);
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

    const todayOrders = orders.filter((o) => o.order_number?.startsWith(today));

    let nextNumber = 1;

    if (todayOrders.length > 0) {
      const lastNum = Math.max(
        ...todayOrders.map((o) => parseInt(o.order_number.slice(-4)))
      );
      nextNumber = lastNum + 1;
    }

    const orderNumber = `${today}${String(nextNumber).padStart(4, "0")}`;
    res.json({ order_number: orderNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE ORDER (with password)
app.delete("/api/orders/:id", (req, res) => {
  try {
    const password = req.query.password || req.body.password;

    if (password !== "9332497108") {
      return res.status(401).json({ error: "Invalid password" });
    }

    const orders = readJSON(ORDERS_FILE);

    const filteredOrders = orders.filter(
      (o) => o.id !== parseInt(req.params.id)
    );

    writeJSON(ORDERS_FILE, filteredOrders);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CLEAR ALL ORDER HISTORY (with password)
app.delete("/api/orders", (req, res) => {
  try {
    const password = req.query.password || req.body.password;

    if (password !== "9332497108") {
      return res.status(401).json({ error: "Invalid password" });
    }

    writeJSON(ORDERS_FILE, []); // remove all orders

    res.json({ success: true, message: "All order history cleared!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------ SERVE FRONTEND BUILD ------------------
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// ------------------ START SERVER ------------------
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     Restaurant POS Backend Server Running          ║
║                                                    ║
║     URL: http://localhost:${PORT}                   ║
║                                                    ║
║     Data Folder: ${DB_DIR}
║                                                    ║
║     Status: ✓ Ready to accept connections          ║
╚════════════════════════════════════════════════════╝
  `);
});
