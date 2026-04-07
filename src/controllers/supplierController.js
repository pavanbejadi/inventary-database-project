const db = require("../db/connection");

// POST /supplier
const createSupplier = (req, res) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return res
      .status(400)
      .json({ message: "Both name and city are required." });
  }

  const stmt = db.prepare("INSERT INTO suppliers (name, city) VALUES (?, ?)");
  const result = stmt.run(name.trim(), city.trim());

  return res.status(201).json({
    message: "Supplier created successfully.",
    supplier: {
      id: result.lastInsertRowid,
      name: name.trim(),
      city: city.trim(),
    },
  });
};

// GET /supplier
const getAllSuppliers = (req, res) => {
  const suppliers = db.prepare("SELECT * FROM suppliers").all();
  return res.json({ count: suppliers.length, suppliers });
};

module.exports = { createSupplier, getAllSuppliers };
