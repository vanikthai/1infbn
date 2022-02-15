const users = [];
const showusers = document.getElementById("showusers");
const processbar = document.getElementById("processbar");
export default class dbuser {
  constructor() {}
  create(dbname) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        resolve("HAVE db.." + dbname);
      } else {
        const request = window.indexedDB.open(dbname);
        request.onerror = function (event) {
          reject("ERROR: create" + dbname);
        };
        request.onupgradeneeded = function (event) {
          users[dbname] = request.result;
          const store = users[dbname].createObjectStore(dbname, {
            keyPath: "uid",
          });
          store.transaction.onconplete = function (event) {
            resolve(`${dbname}[STORE] successfully complete.`);
          };
          store.clear();
        };
        request.onsuccess = function (event) {
          users[dbname] = request.result;
          resolve("success: [CREATED]" + dbname);
        };
      }
    });
  }

  createMsg(dbname) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        resolve("[INDEXDB] DB Has been created.");
      } else {
        const request = window.indexedDB.open(dbname);
        request.onerror = function (event) {
          reject("ERROR: create" + dbname);
        };
        request.onupgradeneeded = function (event) {
          users[dbname] = request.result;
          const store = users[dbname].createObjectStore(dbname, {
            autoIncrement: true,
          });
          store.transaction.onconplete = function (event) {
            resolve(`${dbname}[STORE] successfully complete.`);
          };
          store.clear();
        };
        request.onsuccess = function (event) {
          users[dbname] = request.result;
          resolve("success: [CREATED]" + dbname);
        };
      }
    });
  }

  insert(dbname, payload) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.add(payload);
      request.onerror = function (event) {
        privateUpdate(dbname, payload);
      };
      request.onsuccess = function (event) {
        console.log("success [ADDED]:" + dbname);
        privateShow(dbname);
      };
    }
  }
  insertOther(dbname, payload) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        const insertTran = users[dbname].transaction(dbname, "readwrite");
        const store = insertTran.objectStore(dbname);
        const request = store.add(payload);
        request.onerror = function (event) {
          reject("Error [ADDED]:" + event);
        };
        request.onsuccess = function (event) {
          resolve("success [ADDED]:" + dbname);
        };
      } else {
        reject("Error [NODBNAE]:" + dbname);
      }
    });
  }

  static update(dbname, payload) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.put(payload);
      request.onerror = function (event) {
        console.log("ERROR to update:" + payload.uid);
      };
      request.onsuccess = function (event) {
        console.log("success: [UPDATED]" + payload.uid);
      };
    }
  }

  updateOther(dbname, payload) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        const insertTran = users[dbname].transaction(dbname, "readwrite");
        const store = insertTran.objectStore(dbname);
        const request = store.put(payload);
        request.onerror = function (event) {
          reject("ERROR to update:" + payload.uid);
        };
        request.onsuccess = function (event) {
          resolve("success: [UPDATED]" + payload.uid);
        };
      } else {
        reject("NO DBNAME" + dbname);
      }
    });
  }

  static updateSendUser1(dbname, payload) {
    this.updateSendUser(dbname, payload);
  }

  updateSendUser(dbname, payload) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);

      const rows = store.openCursor();
      rows.onerror = function (event) {
        console.log("ERROR ROWS SENDUSER to update:" + payload.uid);
      };
      rows.onsuccess = function (event) {
        const curcer = event.target.result;
        try {
          if (curcer.value.uid === payload.uid) updatered();
        } catch {
          console.log("ERROR ROWS SENDUSER to update:");
        }
      };
      function updatered() {
        const upSendUser = store.put({
          ...payload,
          room: payload.socket_id,
        });
        let vcolor = "green";
        if (payload.online === "offline") vcolor = "red";
        let msghead = document.getElementById("boxtitle");
        let st = `<img class="direct-chat-img" src="${payload.picture}">
          ${payload.username}
          <span style="color:${vcolor}" class="direct-chat-name pull-left">[${payload.online}]</span>
          </img>`;
        msghead.innerHTML = st;
        msghead.dataset.data = JSON.stringify({
          ...payload,
          room: payload.socket_id,
        });
        upSendUser.onerror = function (event) {
          console.log("ERROR SENDUSER to update:" + payload.uid);
        };
        upSendUser.onsuccess = function (event) {
          console.log("success: [SENDUSER UPDATED]" + payload.uid);
        };
      }
    }
  }

  deleteUid(dbname, uid) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        const insertTran = users[dbname].transaction(dbname, "readwrite");
        const store = insertTran.objectStore(dbname);
        const request = store.delete(uid);
        request.onerror = function (event) {
          reject("ERROR to delete:" + uid);
        };
        request.onsuccess = function (event) {
          resolve("success [DELETED]:" + uid);
        };
      } else {
        resolve("HAVE DB " + dbname);
      }
    });
  }

  deleteDb(dbname) {
    const request = window.indexedDB.deleteDatabase(dbname);
    request.onsuccess = function (event) {
      console.log(`${dbname} subcessfull [DELETED]..`);
    };
  }

  clearDb(dbname) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        const insertTran = users[dbname].transaction(dbname, "readwrite");
        const store = insertTran.objectStore(dbname);
        const request = store.clear();
        request.onerror = function (event) {
          reject("ERROR to clear Table: " + dbname);
        };
        request.onsuccess = function (event) {
          resolve("success [CLEARED] table:" + dbname);
        };
      } else {
        resolve("ARADY DB" + dbname);
      }
    });
  }

  offline(dbname, socketid) {
    if (users[dbname]) {
      showofline(dbname, socketid);
    }
  }

  showall(dbname) {
    privateShow(dbname);
  }

  showMessageUser(dbname) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readonly");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {};
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        if (curcer) {
          let vcolor = "green";
          if (curcer.value.online === "offline") vcolor = "red";
          let msghead = document.getElementById("boxtitle");
          let st = `<img class="direct-chat-img" src="${curcer.value.picture}">
            ${curcer.value.username}
            <span style="color:${vcolor}" class="direct-chat-name pull-left">[${curcer.value.online}]</span>
            </img>`;
          msghead.innerHTML = st;
          msghead.dataset.data = JSON.stringify({
            ...curcer.value,
            room: curcer.value.socket_id,
          });
          curcer.continue();
        }
      };
    }
  }

  showLastMsg(dbname) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        const showmsg = document.getElementById("showmsg");
        showmsg.xmove = "false";
        const insertTran = users[dbname].transaction(dbname, "readonly");
        const store = insertTran.objectStore(dbname);
        const totalRecord = store.count()
        
        const request = store.openCursor();
     
        request.onerror = function (event) {
          reject("[ERROR on showMassage] " + event);
        };
        let index=1
        request.onsuccess = function (event) {
            try {
                processbar.style.width = index / totalRecord.result * 100 + "%"
            }
            catch{}
          const curcer = event.target.result;
          
          try {
            let key = curcer.primaryKey;
            let payload = {
              ...curcer.value,
              index: key,
            };
            payload = JSON.stringify(payload);
            if (curcer) {
              if (curcer.value.action === "me") {
                showmsg.rmsg = payload;
              } else {
                showmsg.lmsg = payload;
              }
              index ++
              curcer.continue();
            }
          } catch {}
          resolve("[SUCCESS] Show last maessage " + dbname);
        };
      } else {
        reject("NO DATABASE NAME " + dbname);
      }
    });
  }

  getLastMsg(dbname, uid, callback) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {};
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        try {
          // let key = curcer.primaryKey;
          if (curcer) {
            if (curcer.value.to.uid === uid) {
              callback(curcer.value);
              curcer.delete();
            }
            curcer.continue();
          }
        } catch {}
      };
    }
  }

  getLastTotalRecord(dbname, uid, callback) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {};
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        try {
          if (curcer) {
            if (curcer.value.uid === uid) {
              callback(curcer.value);
            }
            curcer.continue();
          }
        } catch {}
      };
    }
  }

  static showdba(dbname) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readonly");
      const store = insertTran.objectStore(dbname);
      const totalRecord = store.count()
      const request = store.openCursor();
      request.onerror = function (event) {};
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        if (curcer) {
            try {
                processbar.style.width = index / totalRecord.result * 100 + "%"
            }
            catch{}
          showusers.user = vuser(curcer, "online");
          curcer.continue();
        } else {
          // console.log(`end data ${dbname}`)
          //  showusers.cuser = "false"
        }
      };
    }
  }
  loadUsers(dbname, uid) {
    return new Promise((resolve, reject) => {
      if (users[dbname]) {
        const insertTran = users[dbname].transaction(dbname, "readonly");
        const store = insertTran.objectStore(dbname);
        const request = store.openCursor();
        request.onerror = function (event) {
          reject("Error on load Users" + event);
        };
        request.onsuccess = function (event) {
          const curcer = event.target.result;
          if (curcer) {
            if (uid !== curcer.value.uid) {
              showusers.user = vuser(curcer, "online");
            }
            curcer.continue();
            resolve("USERS LOADED.    ");
          }
        };
      } else {
        reject("No DB users");
      }
    });
  }

  showdbb(dbname) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readonly");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {};
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        if (curcer) {
          showusers.user = vuser(curcer, "online");
          curcer.continue();
        } else {
          // console.log(`end data ${dbname}`)
          //  showusers.cuser = "false"
        }
      };
    }
  }

  static setOfline(dbname, uid) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {
        console.log(event);
      };
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        if (curcer) {
          if (uid === curcer.value.uid) {
            store.put(vuser(curcer, "offline"));

            return;
          }

          curcer.continue();
        }
      };
    }
  }
  deleteCurcur(dbname, uid) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {
        console.log(event);
      };
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        if (curcer) {
          if (uid == curcer.primaryKey) {
            curcer.delete();
            console.log(`[SUCCESS DELETE CURSER] ${curcer.primaryKey}`);
            return;
          }
          curcer.continue();
        }
      };
    }
  }

  setOflineAll(dbname) {
    if (users[dbname]) {
      const insertTran = users[dbname].transaction(dbname, "readwrite");
      const store = insertTran.objectStore(dbname);
      const request = store.openCursor();
      request.onerror = function (event) {
        console.log(event);
      };
      request.onsuccess = function (event) {
        const curcer = event.target.result;
        if (curcer) {
          store.put(vuser(curcer, "offline"));
          curcer.continue();
        } else {
        }
      };
    }
  }
}

function showdel(dbname, uid) {
  showusers.cuser = "true";
  dbuser.deleteUid(dbname, uid);
  dbuser.showdba(dbname);
}
function showofline(dbname, uid) {
  showusers.cuser = "true";
  dbuser.setOfline(dbname, uid);
  dbuser.showdba(dbname);
  // dbuser.updateSendUser1("senduser", uid)
}

function privateShow(dbname) {
  showusers.cuser = "true";
  dbuser.showdba(dbname);
}
function privateUpdate(dbname, payload) {
  showusers.cuser = "true";
  dbuser.update(dbname, payload);
  dbuser.showdba(dbname);
}

function vuser(curcer, online) {
  const user = {
    username: curcer.value.username,
    uid: curcer.value.uid,
    room: curcer.value.socket_id,
    online: curcer.value.online,
    onlinetime: curcer.value.onlinetime,
    picture: curcer.value.picture,
  };
  if (online === "offline") user.online = "offline";
  // updatetitle(user)
  return user;
}

function updatetitle(payload) {
  console.log("set offlie update title");

  let vcolor = "green";
  if (payload.online === "offline") vcolor = "red";
  let msghead = document.getElementById("boxtitle");
  let st = `<img class="direct-chat-img" src="${payload.picture}">
      ${payload.username}
      <span style="color:${vcolor}" class="direct-chat-name pull-left">[${payload.online}]</span>
      </img>`;
  msghead.innerHTML = st;
  msghead.dataset.data = JSON.stringify(payload);
}
