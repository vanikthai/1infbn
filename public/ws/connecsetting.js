import datetime from "../controls/datetime.js";
import Distription from "../controls/tablediscrip.js";
import socket from "./socket.js";
import BudgetTracker from "../controls/tabledata.js";
import { id, idb, username, email, picture } from "./theuser.js";
const load_user = {
  load: true,
  loadLast: false,
};
export default () => {
  const tabledata = new BudgetTracker("#app");
  const tablediscrip =  new Distription("#discrip");
  socket.on("connect", () => {
    connecedstart();
  });
  socket.on("server_error", (msg) => {
    console.log(msg);
  });
  socket.on("loaduser", (user) => {
    tabledata.load(user);
  });

  socket.on("loaddiscrip", (discrip) => {
   //   console.log(discrip);
      tablediscrip.load(discrip);
  });

  socket.on("discription", (discrip) => {
   console.log(discrip);
  });

  socket.on("server_msg", (msg) => {
    console.log(msg);
    switch (msg.res) {
      case "username":
        restart();
        break;
      case "picture":
        restart();
        break;
    }
  });
  socket.on("connect", () => {
    connecedstart();
  });

  socket.on("disconnect", () => {
    socketdisconnec();
  });

///////////////uploadpic/////////////////////////

  function connecedstart() {
    const user = {
      uid: id,
      idb,
      username,
      email,
      picture,
      online: "online",
      onlinetime: datetime(),
    };
    if (load_user.load !== load_user.loadLast) {


      socket.emit("user_connected", user);


      let payload = "select * from users LIMIT 10;";
      socket.emit("loaduser", payload);

      let paydis = "select * from discrips";
      socket.emit("loaddiscrip", paydis);


    }
    load_user.loadLast = true;
  }
};
function restart() {
  setTimeout(() => {
    window.location.href = "https://www.1inf.vanikthai.com/logout";
  }, 1000);
}
function socketdisconnec() {
  console.log("[Client Disconnect..]");
  window.location.href = "https://www.1inf.vanikthai.com/login";
}
