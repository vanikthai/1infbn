// import IDB from "../controls/indexdb_class.js";
import cropImage from "../controls/imagesize.js";
import datetime from "../controls/datetime.js";
// import uuid from "../controls/uuid.js";
import socket from "./socket.js";
import { id, idb, username, email, picture } from "./theuser.js";
export default () => {
  socket.on("connect", () => {
    connecedstart();
  });

  socket.on("server_msg", (msg) => {
    switch (msg.res) {
      case "username":
        restart();
        break;
      case "picture":
        restart();
        break;
      case "changpassword":
        if (msg.msg === "nomatch") showtose("รหัสผ่านไม่ตรงกัน", username);
        if (msg.msg === "passChanged") {
          showtose("ได้เปลี่ยนรหัสป่านเรียบร้อยแล้ว", username);
          document.getElementById("epass1").value = "";
          document.getElementById("epass2").value = "";
        }
        break;
      default:
        console.log(msg);
    }
  });
  socket.on("connect", () => {
    connecedstart();
  });

  socket.on("disconnect", () => {
    socketdisconnec();
  });

  ///////////////uploadpic/////////////////////////

  document.getElementById("movehome").addEventListener("click", (e) => {
    window.location.href = "https://www.1inf.vanikthai.com";
  });

  document.getElementById("editpass").addEventListener("submit", (e) => {
    e.preventDefault();
    let payload = {
      id: idb,
      pass1: document.getElementById("epass1").value,
      pass2: document.getElementById("epass2").value,
    };
    if (payload.pass1 === "" || payload.pass2 === "") return;
    console.log(payload);
    socket.emit("eidtuserpassword", payload);
  });

  document.getElementById("editusername").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = e.currentTarget.querySelector("input").value;
    if (!username) return;
    let payload = {
      id: idb,
      pic: username,
    };
    console.log(payload);
    socket.emit("editProfileUsername", payload);
  });

  document
    .getElementById("setprofilepic")
    .addEventListener("change", handleProfilePicture, false);
  //////////////////////////////////////////////////////////////////

  function showtose(msg, usname) {
    document.getElementById("tosehead").innerText = usname;
    document.getElementById("tosebody").innerHTML = msg;
    new bootstrap.Toast(document.querySelector("#basicToast")).show();
  }

  function handleProfilePicture(e) {
    if (!this.files.length) return;

    postimageprofile(this.files[i]);
  }

  function postimageprofile(file) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        const uri = reader.result;
        cropImage(uri, 100)
          .then((img) => {
            document.getElementById("editprofilePicture").src = img;
            //  picture = img;
            socket.emit("profilePicture", {
              id: idb,
              pic: img,
            });
            restart();
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
    socket.emit("user_connected", user);
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
