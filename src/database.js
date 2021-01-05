const mysql = require("mysql");
const { promisify } = require("util"); //llamo a una fucnion nativa de node para poder soportar promesas

const { database } = require("./db_credenciales");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TO MANY CONNECTIONS");
    }

    if (err.code === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }
  if (connection) connection.release();
  console.log("DB is Connected");
  return;
});

//Convierto a promesas lo que hasta ahora eran solo callbacks
pool.query = promisify(pool.query); // Ahora cada vez que realizo una query peudo utilizar promesas gracias a promisify.
module.exports = pool;
