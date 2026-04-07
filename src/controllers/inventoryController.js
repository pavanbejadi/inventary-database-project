const db = require("../db/connection");

const createInventory = (req, res) => {
  const { supplier_id, product_name, quantity, price } = req.body;

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

  if (quantity < 0) {
    return res.status(400).json({ message: "Quantity must be 0 or more." });
  }

  if (price <= 0) {
    return res.status(400).json({ message: "Price must be greater than 0." });
  }

  db.get(
    "SELECT * FROM suppliers WHERE id = ?",
    [supplier_id],
    (err, supplier) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!supplier) {
        return res.status(400).json({
          message: `Invalid supplier_id: No supplier found with id ${supplier_id}.`,
        });
      }

      const sql =
        "INSERT INTO inventory (supplier_id, product_name, quantity, price) VALUES (?, ?, ?, ?)";
      db.run(
        sql,
        [supplier_id, product_name.trim(), quantity, price],
        function (err) {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          return res.status(201).json({
            message: "Inventory item created successfully.",
            item: {
              id: this.lastID,
              supplier_id,
              product_name: product_name.trim(),
              quantity,
              price,
            },
          });
        },
      );
    },
  );
};

const getAllInventory = (req, res) => {
  const sql = `
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
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.json({ count: rows.length, inventory: rows });
  });
};

const getInventoryGrouped = (req, res) => {
  const sql = `
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
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.json({ grouped: rows });
  });
};

module.exports = { createInventory, getAllInventory, getInventoryGrouped };
