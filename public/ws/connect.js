import IDB from "../controls/indexdb_class.js";
import socket from "./socket.js";
import cropImage from "../controls/imagesize.js";
import { id, idb, username, email, picture } from "./theuser.js";
import datetime from "../controls/datetime.js";
const indexdb = new IDB();
export default () => {
  
  const showmsg = document.getElementById("showmsg");
  const showusers = document.getElementById("showusers");

  socket.on("connect", () => {
    connecedstart();
  });
  socket.on("server_error", (error) => {
    console.log(error);
  });
  socket.on("user_connected", (user) => {
    userConnectingfromServer(user);
  });
  socket.on("userLeft", (user) => {
    user.online = "offline";
    setUserSender(user);
  });
  socket.on("forceDisconnect", (user) => {
    somClientonServerDisconnected(user);
  });
  socket.on("loaduser", (user) => {
    loaduserfromdb(user);
  });
  socket.on("loadtotal", (user) => {
    loadtotalfromdb(user);
  });
  socket.on("privateMessage", (message) => {
    privateMessageFromServer(message);
  });
  socket.on("privateMissMessage", (message) => {
    privateMessageFromServer1(message);
  });
  socket.on("message", (message) => {
    totalRoomMessage(message);
  });
  socket.on("rowsDb", (rows) => {
    setCurentRowsInDb(rows);
  });
  socket.on("disconnect", () => {
    socketdisconnec();
  });

  //////////////////////////event click///////////////////////////////////////
  function submitOnEnter(event) {
   // if (event.shiftKey) return;
    if (event.which === 13 && event.shiftKey ) {
      event.target.form.dispatchEvent(
        new Event("submit", { cancelable: true })
      );
      event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
      sendClientMessage();
    }
  }

  document
    .getElementById("message")
    .addEventListener("keypress", submitOnEnter);

  document.getElementById("form_send_msg").addEventListener("submit", (e) => {
    e.preventDefault();

    let spinner = e.currentTarget.getElementsByTagName('span')
    spinner[1].style.display = 'block'; //'hidden' //visible
      sendClientMessage();
    spinner[1].style.display = 'none'; //'hidden' //visible
  });

  document.getElementById("showusers").addEventListener("click", (e) => {
    const user = JSON.parse(e.target.currentroom);
    setUserSender(user);
  });

  document.getElementById("boxtitle1").addEventListener("click", (e) => {
    clearUserSender();
  });

  document.getElementById("clearMsg").addEventListener("click", (e) => {
    clearChatBox();
  });
  document.getElementById("findusers").addEventListener("click", (e) => {
    e.preventDefault();
    const fuser = document.getElementById("findUserText").value
    let payload = `SELECT * FROM users WHERE username LIKE "${fuser}%";`;
    if(fuser==="") payload = "select * from users;";
    socket.emit("loaduser", payload);
  });

  document.getElementById("loaduser").addEventListener("click", (e) => {
    let payload = "select * from users;";
    socket.emit("loaduser", payload);
  });
  document.getElementById("loadMsgDb").addEventListener("click", (e) => {
    getLastPost();
  });

  document
    .getElementById("file")
    .addEventListener("change", handleFiles, false);
  document
    .getElementById("pictureProfile")
    .addEventListener("change", handleProfilePicture, false);

  //////////////////////////function///////////////////////////////////////
  function getLastPost() {
    indexdb.getLastTotalRecord("recordRead", id, (row) => {
      if (row.row === 0) return;
      let payload = `select * from total WHERE id_total > ${row.row};`;
      socket.emit("loadtotal", payload);
    });
  }
  function setCurentRowsInDb(rows) {
    if (!rows) return;
    const payload = {
      uid: id,
      row: rows.insertId,
    };
    indexdb
      .insertOther("recordRead", payload)
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => {
        // console.log(err)
        indexdb
          .updateOther("recordRead", payload)
          .then((msg) => {
            console.log(msg);
          })
          .catch((err) => {
            console.log(err);
          });
      });
      document.getElementById("spinx").style.display = 'none'
  }
  function handleProfilePicture(e) {
    if (!this.files.length) return;
   
    postimageprofile(this.files[i]);
    
  }
  function handleFiles(e) {
    if (!this.files.length) return;
    document.getElementById("spinx").style.display = 'block'
    for (let i = 0; i < this.files.length; i++) {
      setTimeout(postimage(this.files[i]), i * 1000);
    }
   
  }

  function postimageprofile(file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        const uri = reader.result;
        cropImage(uri, 100)
          .then((img) => {
            document.getElementById("profilePicture").src = img;
            picture = img;
            socket.emit("profilePicture", {
              id: idb,
              pic: img,
            });
          })
          .catch((e) => {
            console.log(e);
          });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  function postimage(file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        const uri = reader.result;
        cropImage(uri, 250)
          .then((img) => {
            const payload = sendMessage(img);
            sendSelecter(payload);
          })
          .catch((e) => {
            console.log(e);
          });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function sendSelecter(payload) {
    if (payload.to === "none") {
      sendtoTotalRoom(payload);
    } else if (payload.to.online === "offline") {
      payload.to.online = "online";
      sendtoPrivateRoom(payload);
    } else {
      sendtoPrivateRoom(payload);
    }
  }

  
  function totalRoomMessage(message) {
    let payload = {
      ...message,
      action: "other",
    };
    let tomsg = getToSmg();
    if (tomsg) {
    } else {
      showmsg.xmove = "false";
      showmsg.lmsg = JSON.stringify(message);
    }
    indexdb.insertOther("message", payload);
  }

  function userConnectingfromServer(user) {
    newuser(user);
    indexdb.updateSendUser("senduser", user);
    // create indexdb for new user
    indexdb
      .createMsg(user.uid)
      .then((message) => {
        console.log(message);
        // indexdb.getLastMsg("tosend", user.uid, function (data) {
        //   socket.emit("privateMessage", data);
        // });
      })
      .catch((error) => {
        console.log(error);
      });

    let tomsg = getToSmg();
    if (tomsg.uid === user.uid) {
      getPrivateChat({
        ...user,
        room: user.socket_id,
      });
      // clear chat box
      showmsg.vclear = "true";
      indexdb.showLastMsg(user.uid);
    }
  }
  function sendClientMessage() {
    const message = document.getElementById("message");
  //  const mainchat = document.getElementById("mainchat");
    if (message.value === "") return;
    const payload = sendMessage(message.value);
    sendSelecter(payload);
    message.value = "";
    message.focus();
 //   mainchat.scrollTop = mainchat.scrollHeight
  }

  function clearChatBox() {
    let tomsg = getToSmg();
    if (tomsg) {
      indexdb
        .clearDb(tomsg.uid)
        .then((msg) => {
          console.log(msg);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      indexdb
        .clearDb("message")
        .then((msg) => {
          console.log(msg);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    showmsg.vclear = "true";
  }

  function clearUserSender() {
    document.getElementById("processbar").style.width = "0%"
    indexdb
      .clearDb("senduser")
      .then((msg) => {
        console.log(msg);
        document.getElementById("boxtitle").innerText = "ห้องรวม";
        document.getElementById("boxtitle").dataset.data = "totalroom";
        showmsg.vclear = "true";
        indexdb
          .showLastMsg("message")
          .then((msg) => {
            msg;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getToSmg() {
    let tomsg = "";
    try {
      tomsg = JSON.parse(document.getElementById("boxtitle").dataset.data);
    } catch {}
    return tomsg;
  }

  function privateMessageFromServer(message) {
    const tomsg = getToSmg();
    let payload = {
      ...message,
      action: "other",
      newmsg: "",
    };

    indexdb
      .createMsg(message.from.uid)
      .then((msg) => {
        console.log(msg);
      })
      .catch((error) => {
        console.log(error);
      });
    indexdb
      .insertOther(message.from.uid, payload)
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => {
        console.log(err);
      });

    if (message.from.uid === tomsg.uid) {
      showmsg.xmove = "false";
      showmsg.lmsg = JSON.stringify(message);
    } else {
      payload = {
        ...message,
        action: "other",
        newmsg: "New message",
      };
      showusers.userid = message.from.uid;
      showusers.mscount = "1+";
    }
  }

  function privateMessageFromServer1(data) {
    let message = JSON.parse(data);
    const tomsg = getToSmg();
    let payload = {
      ...message,
      action: "other",
      newmsg: "",
    };

    indexdb
      .createMsg(message.from.uid)
      .then((msg) => {
        console.log(msg);
        indexdb.insertOther(message.from.uid, payload);
      })
      .catch((error) => {
        console.log(error);
      });

    if (message.from.uid === tomsg.uid) {
      showmsg.xmove = "false";
      showmsg.lmsg = JSON.stringify(message);
    } else {
      payload = {
        ...message,
        action: "other",
        newmsg: "New message",
      };
      showusers.userid = message.from.uid;
      showusers.mscount = "1+";
    }
  }

  function setUserSender(user) {
    if (user) {
      indexdb
        .createMsg(user.uid)
        .then((msg) => {
          console.log(msg);
          indexdb
            .showLastMsg(user.uid)
            .then((msg) => {
              console.log(msg);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log(err));

      indexdb
        .clearDb("senduser")
        .then((msg) => {
          console.log(msg);
          indexdb
            .insertOther("senduser", user)
            .then((msg) => {
              console.log(msg);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
      // clear chat box
      showmsg.vclear = "true";
      // set new private chat headder
      getPrivateChat(user);
      // delete new message in user box
      showusers.userid = user.uid;
      showusers.mscount = "";
    }
  }

  function sendtoPrivateRoom(payload) {
    indexdb.createMsg(payload.to.uid).then((msg) => {
      console.log(msg);
      indexdb
        .insertOther(payload.to.uid, {
          ...payload,
          action: "me",
        })
        .then((msg) => {
          console.log(msg);
          showmsg.rmsg = JSON.stringify(payload);
          socket.emit("privateMessage", payload);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  function sendtoTotalRoom(payload) {
    console.log("sendtoTotalRoom");
    indexdb
      .insertOther("message", {
        ...payload,
        action: "me",
        remark: "sendtoTotalRoom",
      })
      .then((msg) => {
        console.log(msg);
        showmsg.xmove = "false";
        showmsg.rmsg = JSON.stringify(payload);
        socket.emit("message", payload);
      });
  }

  function loaduserfromdb(user) {
    indexdb
      .clearDb("users")
      .then((msg) => {
        console.log(msg);
        showusers.cuser = "true";
        indexdb.showdbb("users");
      })
      .catch((err) => {
        console.log(err);
      });
    user.forEach((data) => {
      if (data.uid !== id) indexdb.insertOther("users", data);
    });
  }

  function loadtotalfromdb(payload) {
    let idRows = 0;
    let msg = "none";

    payload.forEach((data) => {
      idRows = data.id_total;
      showmsg.xmove = "true";
      try {
        msg = JSON.parse(data.message);
      } catch {
        msg = "none";
      }
    });

    if (msg == "none") return;
    if (idRows == 0) return;
    const totalrow = {
      uid: id,
      row: idRows,
    };
    indexdb
      .insertOther("recordRead", totalrow)
      .then((msg) => {
        console.log(msg);
      })
      .catch(() => {
        indexdb
          .updateOther("recordRead", totalrow)
          .then((msg) => {
            console.log(msg);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }

  function getPrivateChat(user) {
    const msghead = document.getElementById("boxtitle");
    if (user) {
      let vcolor = "green";
      if (user.online === "offline") vcolor = "red";
      msghead.innerHTML = `<img class="direct-chat-img" src="${user.picture}">
      ${user.username}
      <span style="color:${vcolor}" class="direct-chat-name pull-left">[${user.online}]</span>
       </img>`;
      msghead.dataset.data = JSON.stringify(user);
    } else {
      msghead.innerHTML = "ห้องรวม";
      msghead.dataset.data = {};
    }
  }

  function sendMessage(msg) {
    let sendfrom = {
      room: socket.id,
      uid: id,
      username,
      picture,
    };

    if (document.getElementById("boxtitle").dataset.data === "totalroom") {
      let data = {
        from: sendfrom,
        to: "none",
        message: encodeURIComponent(msg),
        time: datetime(),
      };
      return data;
    } else {
      let tomsg = JSON.parse(document.getElementById("boxtitle").dataset.data);

      let sendto = {
        room: tomsg.room,
        uid: tomsg.uid,
        username: tomsg.username,
        picture: tomsg.picture,
        online: tomsg.online,
      };
      let payload = {
        from: sendfrom,
        to: sendto,
        message: encodeURIComponent(msg),
        time: datetime(),
      };
      return payload;
    }
  }

  function connecedstart() {
    const user = {
      socket_id: socket.id,
      uid: id,
      idb,
      username,
      email,
      picture,
      online: "online",
      onlinetime: datetime(),
    };
    socket.emit("user_connected", user);
    indexdb
      .loadUsers("users", id)
      .then((msg) => {
        console.log(msg);
      })
      .catch((err) => {
        console.log(err);
      });
    indexdb.showMessageUser("senduser");

    /// checking in private Chat or not
    indexdb
      .showLastMsg("message")
      .then((msg) => {
        console.log(msg);
        getLastPost();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

function newuser(payload) {
  indexdb.insert("users", payload);
}

function socketdisconnec() {
  console.log("[Client Disconnect..]");
  indexdb.setOflineAll;
  indexdb.setOflineAll("users");
  window.location.href = "https://www.1inf.vanikthai.com/login";
}

function somClientonServerDisconnected(user) {
  try {
    indexdb.offline("users", user.uid);
    console.log(`[server disconnecting Id ] ${user.uid}`);
  } catch {
    console.log("[server Error to conneced..]" + user.uid);
  }
  user.online = "offline";
  indexdb.updateSendUser("senduser", user);
}

