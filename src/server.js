const express = require("express");
const supplierRoutes = require("./routes/supplierRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/supplier", supplierRoutes);
app.use("/inventory", inventoryRoutes);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Zeerostock Inventory API is running.",
    endpoints: {
      "POST /supplier": "Create a supplier",
      "GET  /supplier": "List all suppliers",
      "POST /inventory": "Add an inventory item",
      "GET  /inventory": "List all inventory",
      "GET  /inventory/grouped":
        "Inventory grouped by supplier, sorted by total value",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
