import cropImage from "../controls/imagesize.js";
import datetime from "../controls/datetime.js";
import uuid from "../controls/uuid.js";
import socket from "./socket.js";
import DiscripList from "../controls/discriplist.js";
import { id, idb, username, email, picture } from "./theuser.js";
export default () => {
  const dislist = new DiscripList("#dislist");
  const showmsg = document.getElementById("showmainpage");
  const pictrueSend = [];
  const cerrentRecord = {
    value: 0,
    last: 1,
  };
  const newMessage = {
    value: {},
  };
  const noitfi = (msg, user) =>
    new Notification(user.username, {
      body: decodeURIComponent(msg),
      icon: user.picture,
    });

  socket.on("connect", () => {
    connecedstart();
   console.log(datetime())
  });
  socket.on("mainpage", (message) => {
    // console.log(message.insertId);
    let payload = {
      index: message.insertId,
      ...newMessage.value,
    };
    showmsg.lmsg = JSON.stringify(payload);
  });
  socket.on("user_connected", (user) => {
    // console.log(user);
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

  socket.on("mainpagelast", (message) => {
    message.forEach((data, index) => {
      setTimeout(() => {
        cerrentRecord.value = data.id_main;
        try {
          let msg = JSON.parse(data.message);
          let paylaod = {
            index: data.id_main,
            vlock: data.vlock,
            ...msg,
          };
          showmsg.rmsg = JSON.stringify(paylaod);
        } catch {
          console.log("error load rsmg");
        }
      }, index * 500);
    });
  });

  socket.on("mainserver", (msg) => {
    showmsg.lmsg = JSON.stringify(msg);
    let Android = /Android/.test(navigator.userAgent);
    let ms = decodeURIComponent(msg.message);
    if (Android) {
      let mess = `
        <img class="direct-chat-img" src="${msg.from.picture}">
        <p>${ms.substring(0, 60)}...</p>
        `;
      showtose(mess, msg.from.username);
    } else {
      noitfi(msg.message, msg.from);
    }
  });

  socket.on("server_error", (error) => {
    console.log(error);
  });

  socket.on("userLeft", (user) => {
    console.log("userLeft" + user);
  });

  socket.on("disconnect", () => {
    socketdisconnec();
  });

  socket.on("loaddiscrip", (discrip) => {
    dislist.load(discrip);
  });

  //////////////////////////event click 13 send form///////////////////////////////////////

  function submitOnEnter(event) {
    if (event.which === 13 && event.shiftKey) {
      event.target.form.dispatchEvent(
        new Event("submit", { cancelable: true })
      );
      event.preventDefault();
      sendClientMessage();
    }
  }

  document
    .getElementById("message")
    .addEventListener("keypress", submitOnEnter);
  //////////////send msg form/////////////////////////////////////////////////////

  document.getElementById("message").addEventListener("input", (e) => {
    resizetext(e);
  });

  document.getElementById("message").addEventListener("focus", (e) => {
    resizetext(e);
  });

  document.getElementById("formsendmsg").addEventListener("submit", (e) => {
    e.preventDefault();
    loadstatus(e, "block");
    sendClientMessage();
    loadstatus(e, "none");
    movetop();
  });

  document.getElementById("btnSetPass").addEventListener("submit", (e) => {
    e.preventDefault();
    let passtext = document.getElementById("setPass");
    if (passtext.value === "") return;
    let payload = {
        id_main: passtext.dataset.id,
        password: passtext.value,
    }
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
    socket.emit("setPassShire", payload);
  });
  const chatmsg = document
    .getElementById("showmainpage")
    .shadowRoot.getElementById("chatmessages");

  chatmsg.addEventListener("scroll", (e) => {
    let stop = e.currentTarget.scrollTop + 505;
    let sheitht = e.currentTarget.scrollHeight;
    let total = sheitht - stop;
    if (total < 0) loadnext();
  });

  document.getElementById("movetoadd").addEventListener("click", (e) => {
    let toadd = document.getElementById("mainchat");
    toadd.scrollLeft = toadd.scrollWidth;
  });

  document.getElementById("movehome").addEventListener("click", (e) => {
    movetop();
  });

  document.getElementById("copylink").addEventListener("click", (e) => {
    const text = document.getElementById("message-text");
    const cb = navigator.clipboard;
    cb.writeText(text.value).then(() => {
      showtose("ข้อความคัดลอกแล้ว", username);
      var myModalEl = document.getElementById("exampleModal");
      var modal = bootstrap.Modal.getInstance(myModalEl);
      setTimeout(() => {
        modal.hide();
      }, 500);
    });
  });

  document.getElementById("formselect").addEventListener("change", () => {
    showmsg.vclear = "true";
    loadlastmainpageDiscrip();
  });
  ///////////////uploadpic/////////////////////////
  document
    .getElementById("addpicture")
    .addEventListener("change", handleFiles, false);

  ////////////////////function///////////////////////////////////////////////////////////
  function testOs() {
    // console.log(JSON.stringify({
    //     isAndroid: /Android/.test(navigator.userAgent),
    //     isCordova: !!window.cordova,
    //     isEdge: /Edge/.test(navigator.userAgent),
    //     isFirefox: /Firefox/.test(navigator.userAgent),
    //     isChrome: /Google Inc/.test(navigator.vendor),
    //     isChromeIOS: /CriOS/.test(navigator.userAgent),
    //     isChromiumBased: !!window.chrome && !/Edge/.test(navigator.userAgent),
    //     isIE: /Trident/.test(navigator.userAgent),
    //     isIOS: /(iPhone|iPad|iPod)/.test(navigator.platform),
    //     isOpera: /OPR/.test(navigator.userAgent),
    //     isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
    //     isTouchScreen: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    //     isWebComponentsSupported: 'registerElement' in document && 'import' in document.createElement('link') && 'content' in document.createElement('template')
    //   }, null, '  '));

    const Android = /Android/.test(navigator.userAgent);
    console.log(Android);
  }

  function resizetext(e) {
    e.currentTarget.setAttribute(
      "style",
      "height:" + e.currentTarget.scrollHeight + "px;overflow-y:hidden;"
    );
  }

  function loadstatus(e, status) {
    let spinner = e.currentTarget.getElementsByTagName("span");
    spinner[1].style.display = `"${status}"`;
  }

  function movetop() {
    document.getElementById("mainchat").scrollLeft = 0;
    document
      .getElementById("showmainpage")
      .shadowRoot.getElementById("chatmessages").scrollTop = 0;
  }

  function loadnext() {
    if (cerrentRecord.value <= 5) return;
    if (cerrentRecord.value === cerrentRecord.last) return;
    let id_discrip = document.getElementById("formselect").value || 1;

    let sql = `SELECT * FROM mainpage WHERE id_main < ${cerrentRecord.value}  ORDER BY id_main DESC LIMIT 5;`;
    if (id_discrip != 1) {
      sql = `SELECT * FROM mainpage WHERE id_discrip=${id_discrip} and id_main < ${cerrentRecord.value}  ORDER BY id_main DESC LIMIT 5;`;
    }
    socket.emit("lastmainpage", sql);
    cerrentRecord.last = cerrentRecord.value;
  }

  function handleFiles(e) {
    document.getElementById("spinx").style.display = "block";
    reloadpic();
    let totalpic = this.files.length;
    for (let i = 0; i < totalpic; i++) {
      setTimeout(postimage(this.files[i], i, totalpic), i * 1000);
    }
  }
  function postimage(file, index, total) {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        const uri = reader.result;
        cropImage(uri, 250)
          .then((img) => {
            pictrueSend.push(img);
            createPeviewPicture(img, index);
            if (index === total - 1)
              document.getElementById("spinx").style.display = "none";
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

  function createPeviewPicture(img, index) {
    const showpicture = document.getElementById("showpicture");
    const pic = document.createElement("img");
    pic.src = img;
    pic.style.width = "100px";
    pic.className = "img-thumbnail rounded float-start";
    pic.addEventListener("click", (e) => {
      delete pictrueSend[index];
      e.currentTarget.style = "display:none";
      reloadpic();
    });
    showpicture.appendChild(pic);
  }

  function reloadpic() {
    if (pictrueSend.length === 0) return;
    document.getElementById("showpicture").innerHTML = "";
    pictrueSend.forEach((pic, index) => {
      createPeviewPicture(pic, index);
    });
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

    loadlastmainpage();

    let paydis = "select * from discrips";
    socket.emit("loaddiscrip", paydis);
  }

  function loadlastmainpage() {
    let sql = `SELECT * FROM mainpage ORDER BY id_main DESC LIMIT 10;`;
    socket.emit("lastmainpage", sql);
  }
  function loadlastmainpageDiscrip() {
    let id_discrip = document.getElementById("formselect").value || 3;
    let sql = `SELECT * FROM mainpage WHERE id_discrip=${id_discrip}  ORDER BY id_main DESC LIMIT 5;`;
    socket.emit("lastmainpage", sql);
  }

 async function sendClientMessage() {
    const message = document.getElementById("message");
    if (message.value === "") return;
    const payload =  sendMessage(message.value);
     sendSelecter(payload);
    message.value = "";
    
    // pictrueSend.forEach((el,index) => {
    //     pictrueSend.splice(index, 1);
    // });

    pictrueSend.splice(0, 1);

    document.getElementById("showpicture").innerHTML = "";
  }
  function showtose(msg, usname) {
    document.getElementById("tosehead").innerText = usname;
    document.getElementById("tosebody").innerHTML = msg;
    new bootstrap.Toast(document.querySelector("#basicToast")).show();
  }

  function sendSelecter(payload) {
    newMessage.value = payload;
    socket.emit("mainpage", payload);
  }

  function sendMessage(msg) {
    let getpic = [];
    const id_discrip = document.getElementById("formselect").value || 1;
    pictrueSend.forEach((pic) => {
      getpic.push(pic);
    });

    let sendfrom = {
      uid: id,
      username,
      picture,
    };

    let data = {
      id: uuid(),
      id_discrip,
      from: sendfrom,
      pictrueSend: getpic,
      message: encodeURIComponent(msg),
      time: datetime(),
    };
    return data;
  }
};

function socketdisconnec() {
  console.log("[Client Disconnect..]");
  window.location.href = "https://www.1inf.vanikthai.com/login";
}
