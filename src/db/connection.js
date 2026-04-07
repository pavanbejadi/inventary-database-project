const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "../../../inventory.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new sqlite3.Database(DB_PATH);

const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");

db.serialize(() => {
  db.exec(schema);
});

module.exports = db;
