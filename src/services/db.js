require("dotenv").config();
const mysql = require("mysql2");

// DB_* variables for local use, or Railway's MySQL service variables.
const db = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER,
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_DATABASE || process.env.MYSQLDATABASE,
  connectionLimit: 10,
  multipleStatements: true // Needed by the original, manually run DB init script.
});

module.exports = db;
