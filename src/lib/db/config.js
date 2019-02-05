const mysql = require('mysql2');
const db = require("../../config/index").db;

const pool = mysql.createPool({
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    port : db.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

module.exports = pool;