const users = [];
const rooms = [];
const mysql = require("../controlers/dbtable.js");
const passhash = require("password-hash");

// const {ensureAuthenticated} = require('../controlers/auth.js')
module.exports = (socket) => {
  socket.on("message", (msg) => {
    addmessage(msg);
  });

  socket.on("privateMessage", (msg) => {
    if (!rooms[msg.to.uid]) {
      addTosend(msg);
      return;
    }
    socket.to(rooms[msg.to.uid]).emit("privateMessage", msg);
  });
  socket.on("user_connected", (user) => {
    user_connected(user);
  });
  socket.on("disconnecting", () => {
    disconnecting();
  });
  socket.on("loaduser", (sql) => {
    loaduser(sql);
  });
  socket.on("loadtotal", (sql) => {
    loadtotal(sql);
  });
  socket.on("loaddiscrip", (sql) => {
    loaddiscrip(sql);
  });
  socket.on("profilePicture", (picture) => {
    user_profilePicture(picture);
  });
  socket.on("editProfileUsername", (username) => {
    user_profileUsername(username);
  });

  socket.on("mainpage", (message) => {
    addtomainpage(message);
  });

  socket.on("lastmainpage", (sql) => {
    loadLastMainpage(sql); 
  });

  socket.on("updatusersetting", (payload) => {
    updatusersetting(payload)
  });
  socket.on("updatediscrip", (payload) => {
    updatediscrip(payload)
  });
  
  socket.on("adddiscrip", (payload) => {
    adddiscrip(payload)
  });

  socket.on("delmainid", (payload) => {
    delmainid(payload)
  });

  socket.on("setPassShire", (payload) => {
    setPassShire(payload)
  });

  //////////////////////////////////////////////////////////

function setPassShire(payload) {
    let sql=""

    if(payload.password==="***") {
        sql = `UPDATE mainpage SET vlock='none', password='' WHERE id_main = '${payload.id_main}'`;

    } else {
        let hash = passhash.generate(payload.password);
        sql = `UPDATE mainpage SET vlock='pass', password='${hash}' WHERE id_main = '${payload.id_main}'`;
    }

    mysql(sql)
    .then((res) => {
        if(payload.password==="***") {
            socket.emit("server_msg", { res: "repassShaire", msg: "[server] cancle password shaire Cuccess." });
        } else {
            socket.emit("server_msg", { res: "passShaire", msg: "[server] set password shaire Cuccess." });

        }
    })
    .catch((err) => {
        socket.emit("server_msg", { res: "error", msg: sql });
    });
}

function delmainid(id) {
    let sql = `DELETE FROM mainpage WHERE id_main = ${id};`;
    mysql(sql)
    .then((res) => {
        socket.emit("server_msg", { res: "delmainid", msg: "[server] delete 1 row from mainpage Cuccess." });
    })
    .catch((err) => {
        socket.emit("server_msg", { res: "error", msg: sql });
    });
}

  function loadLastMainpage(sql) {
    mysql(sql)
      .then((res) => {
        socket.emit("mainpagelast", res);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
  }
  function addtomainpage(msg) {
    let payload = JSON.stringify(msg);
    let sql = `INSERT INTO mainpage (id_discrip,token,message) VALUE ('${msg.id_discrip}','${msg.id}','${payload}')`;
    mysql(sql)
      .then((res) => {
        socket.emit("mainpage", res);
        socket.broadcast.emit("mainserver", msg);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
  }
  function adddiscrip(discrip) {
   // let payload = JSON.stringify(msg);
    let sql = `INSERT INTO discrips (discrip,keyword) VALUE ('${discrip.discrip}','${discrip.keyword}')`;
    mysql(sql)
      .then((res) => {
        socket.emit("discription", {res: "discription", msg: res});
      })
      .catch((err) => {
        socket.emit("server_msg", { res: err, msg: sql });
      });
  }

  function addmessage(msg) {
    let payload = JSON.stringify(msg);
    let sql = `INSERT INTO total (message) VALUE ('${payload}')`;
    mysql(sql)
      .then((rows) => {
        socket.emit("rowsDb", rows);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
    socket.broadcast.emit("message", msg);
  }

  function addTosend(msg) {
    let payload = JSON.stringify(msg);
    let sql = `INSERT INTO tosend (uid,message) VALUE ('${msg.to.uid}','${payload}')`;
    mysql(sql)
      .then((res) => {
        socket.emit("userLeft", msg.to);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
  }

  function loaduser(sql) {
    mysql(sql)
      .then((res) => {
        socket.emit("loaduser", res);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
  }

  function loadtotal(sql) {
    mysql(sql)
      .then((res) => {
        socket.emit("loadtotal", res);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
  }

  function loaddiscrip(sql) {
    mysql(sql)
      .then((res) => {
        socket.emit("loaddiscrip", res);
      })
      .catch((err) => {
        socket.emit("server_msg", { res: err, msg: sql });
      });
  }

  function user_connected(user) {
    const idb = user.idb;
    let sql = `UPDATE users SET room='${user.socket_id}', online='${user.online}', onlinetime='${user.onlinetime}' WHERE id_user = '${idb}'`;
    users[socket.id] = user;
    rooms[user.uid] = socket.id;
    mysql(sql)
      .then((res) => {
        socket.broadcast.emit("user_connected", user);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });

    let sqltosend = `SELECT * from tosend WHERE uid='${user.uid}'`;
    mysql(sqltosend)
      .then((res) => {
        Object.keys(res).forEach(function (key) {
          var row = res[key];
          socket.emit("privateMissMessage", row.message);
        });

        if (res) {
          let sqldel = `DELETE FROM tosend WHERE uid='${user.uid}'`;
          mysql(sqldel)
            .then((res) => {
              socket.emit(
                "server_error",
                "[SERVERR] DELETE TOSEND " + user.uid
              );
            })
            .catch((err) => {
              socket.emit("server_error", err + sqldel);
              return;
            });
        }
      })
      .catch((err) => {
        socket.emit("server_error", err + sqltosend);
        return;
      });
  }

  function user_profilePicture(pic) {
    const idb = pic.id;
    let sql = `UPDATE users SET picture='${pic.pic}' WHERE id_user = '${idb}'`;
    mysql(sql)
      .then((res) => {
        socket.emit("server_msg", {
          res: "picture",
          msg: "[server] udate profile picture compleaate",
        });
      })
      .catch((err) => {
        socket.emit("server_msg", { res: err, msg: sql });
      });
  }

  function updatusersetting(payload) {
    let sql = `UPDATE users SET kind='${payload.kind}', allow='${payload.allow}' WHERE id_user = '${payload.id}'`;
    mysql(sql)
      .then((res) => {
        socket.emit("server_msg", {
          res: "KindAllow",
          msg: "[server] udate kind and Allow compleaate",
        });
      })
      .catch((err) => {
        socket.emit("server_msg", { res: err, msg: sql });
      });
  }

  function updatediscrip(payload) {
    let sql = `UPDATE discrips SET discrip='${payload.discrip}', keyword='${payload.keyword}' WHERE id_discrip = '${payload.id}'`;
    mysql(sql)
      .then((res) => {
        socket.emit("server_msg", {
          res: "discription",
          msg: "[server] udate discrip and keyword compleaate",
        });
      })
      .catch((err) => {
        socket.emit("server_msg", { res: err, msg: sql });
      });
  }

  function user_profileUsername(user) {
    const idb = user.id;
    let sql = `UPDATE users SET username='${user.pic}' WHERE id_user = '${idb}'`;
    mysql(sql)
      .then(() => {
        socket.emit("server_msg", {
          res: "username",
          msg: "[server] udate username compleaate",
        });
      })
      .catch((err) => {
        socket.emit("server_msg", { res: err, msg: sql });
      });
  }

  async function disconnecting() {
    const idb = users[socket.id].idb;
    let sql = `UPDATE users SET room='', online='offline' WHERE id_user = '${idb}'`;
    await mysql(sql)
      .then((res) => {
        socket.broadcast.emit("forceDisconnect", users[socket.id]);
      })
      .catch((err) => {
        socket.emit("server_error", err + sql);
      });
    let uid = users[socket.id].uid;
    delete rooms[uid];
    delete users[socket.id];
  }
};
