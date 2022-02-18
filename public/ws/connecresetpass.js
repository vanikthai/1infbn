// import IDB from "../controls/indexdb_class.js";
//import cropImage from "../controls/imagesize.js";
import datetime from "../controls/datetime.js";
// import uuid from "../controls/uuid.js";
import socket from "./socket.js";
import { id, idb, username, email, picture } from "./theuser.js";
const connected = {
    start: 0,
    end: 0
}
export default () => {
  socket.on("connect", () => {
       connecedstart();
      
  });

  socket.on("server_msg", (message) => {
    switch (message.res) {
      case "delmainid":
        showtose("ได้ลบข้อมูลเรียบร้อย", username);
        break;
        case "passShaire":
            document.getElementById("bnset").className="btn btn-success"
            showtose("บันทึกรหัสผ่านแล้ว",username)
        break;
        case "repassShaire":
            document.getElementById("bnset").className="btn btn-primary"
            showtose("ยกเลิกรหัสผ่านแล้ว",username)
        break;
      default:
        console.log(message);
    }
  });

  socket.on("connect", () => {
    connecedstart();
  });

  socket.on("disconnect", () => {
    socketdisconnec();
  });

  ///////////////uploadpic/////////////////////////
  document.getElementById("btnSetPass").addEventListener("submit", (e) => {
    e.preventDefault();
    let passtext = document.getElementById("setPass");
    if (passtext.value === "") return;
    let payload = {
        id_main: passtext.dataset.id,
        password: passtext.value,
    }
    console.log(payload);
    socket.emit("setPassShire", payload);
    passtext.value=""
  });

  document.getElementById("bnunset").addEventListener("click", (e) => {
    e.preventDefault();
    let passtext = document.getElementById("setPass");
    let payload = {
        id_main: passtext.dataset.id,
        password: "***",
    }
   // console.log(payload);
    socket.emit("setPassShire", payload);
  });
  function onload() {
    let { message } = JSON.parse(document.getElementById("data").dataset.message);
     let title = document.getElementById("title");
    let intime = document.getElementById("intime");
    let userpic = document.getElementById("userpic");
    let msg = JSON.parse(message);
    
    title.innerHTML = msg.from.username;
    intime.innerHTML =  msg.time;
    userpic.src = msg.from.picture;
    if(msg.from.uid !== id) {
        document.querySelectorAll("input").forEach(el => el.disabled=true);
        document.querySelectorAll("button").forEach(el => el.disabled=true);
        title.innerHTML="[ไม่สามารถดำเนินการได้ เนื่องจากไม่ใช่เจ้าของข้อมูล]"
    }
  }

  function showtose(msg, usname) {
    document.getElementById("tosehead").innerText = usname;
    document.getElementById("tosebody").innerHTML = msg;
    new bootstrap.Toast(document.querySelector("#basicToast")).show();
  }

  function connecedstart() {
    if(connected.start!==connected.end) return
    const user = {
      uid: id,
      idb,
      username, 
      email,
      picture,
      online: "online",
      onlinetime: datetime(),
    };
    socket.emit("user_connected", user);
    onload();
    connected.end = 1
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
