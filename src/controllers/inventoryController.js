const db = require("../db/connection");

// POST /inventory
const createInventory = (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

  // Check all fields are present
  if (
    supplier_id === undefined ||
    !product_name ||
    quantity === undefined ||
    price === undefined
  ) {
    return res.status(400).json({
      message:
        "supplier_id, product_name, quantity, and price are all required.",
    });
  }

  // Quantity must be >= 0
  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity must be 0 or more." });
  }

  // Price must be > 0
  if (price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0." });
  }

  // Check supplier exists
  const supplier = db
    .prepare("SELECT * FROM suppliers WHERE id = ?")
    .get(supplier_id);
  if (!supplier) {
    return res.status(400).json({
      message: `Invalid supplier_id: No supplier found with id ${supplier_id}.`,
    });
  }

  // Insert into DB
  const stmt = db.prepare(
    "INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)",
  );
  const result = stmt.run(supplier_id, product_name.trim(), quantity, price);

  return res.status(201).json({
    message: "Inventory item created successfully.",
    item: {
      id: result.lastInsertRowid,
      supplier_id,
      product_name: product_name.trim(),
      quantity,
      price,
    },
  });
};

// GET /inventory
const getAllInventory = (req, res) => {
  const items = db
    .prepare(
      `
    SELECT
      i.id,
      i.product_name,
      i.quantity,
      i.price,
      i.supplier_id,
      s.name AS supplier_name,
      s.city AS supplier_city
    FROM inventory i
    JOIN suppliers s ON i.supplier_id = s.id
    ORDER BY i.id DESC
  `,
    )
    .all();

  return res.json({ count: items.length, inventory: items });
};

// GET /inventory/grouped
const getInventoryGrouped = (req, res) => {
  const grouped = db
    .prepare(
      `
    SELECT
      s.id   AS supplier_id,
      s.name AS supplier_name,
      s.city AS supplier_city,
      COUNT(i.id)               AS total_products,
      SUM(i.quantity * i.price) AS total_inventory_value
    FROM suppliers s
    JOIN inventory i ON s.id = i.supplier_id
    GROUP BY s.id, s.name, s.city
    ORDER BY total_inventory_value DESC
  `,
    )
    .all();

  return res.json({ grouped });
};

module.exports = { createInventory, getAllInventory, getInventoryGrouped };
