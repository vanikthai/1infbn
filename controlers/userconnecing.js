const connection = require("./dbtable.js");
module.exports = (payload) => {
  return new Promise((resolve, reject) => {
    let sql = `UPDATE users SET room='${payload.socket_id}', online='${payload.online}' WHERE id_user = '${payload.idb}'`;
    users[socket.id] = user;
    mysql(sql)
      .then((res) => {
        //socket.emit("server_error", JSON.stringify(user));
        resolve(payload.user)
        //socket.broadcast.emit("user_connected", payload.user);
      })
      .catch((error) => {
        reject(error)
        // socket.emit("server_error", err + sql);
      });
  });
};
