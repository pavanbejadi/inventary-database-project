const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "../../../inventory.db");
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new Database(DB_PATH);

// Enable foreign key support
db.pragma("foreign_keys = ON");

// Auto-create tables from schema.sql
const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

module.exports = db;
