const db = require("../db/connection");

const createSupplier = (req, res) => {
  const { name, city } = req.body;

  if (!name || !city) {
    return res
      .status(400)
      .json({ message: "Both name and city are required." });
  }

  const sql = "INSERT INTO suppliers (name, city) VALUES (?, ?)";
  db.run(sql, [name.trim(), city.trim()], function (err) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(201).json({
      message: "Supplier created successfully.",
      supplier: { id: this.lastID, name: name.trim(), city: city.trim() },
    });
  });
};

const getAllSuppliers = (req, res) => {
  db.all("SELECT * FROM suppliers", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    return res.json({ count: rows.length, suppliers: rows });
  });
};

module.exports = { createSupplier, getAllSuppliers };
