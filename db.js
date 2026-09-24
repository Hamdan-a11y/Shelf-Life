const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Password@123",
  database: "shelflife",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = pool;