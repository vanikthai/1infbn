const mysql = require("mysql");
const con = mysql.createConnection({
    host: "localhost",
    user: "vaniktha_01",
    password: "112211",
    database: "vaniktha_01"
  });
module.exports = con
