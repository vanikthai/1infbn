import chatCss from "../css/c_chat.js";
import { id } from "../ws/theuser.js";
import socket from "../ws/socket.js";

class formMain extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "rmsg",
      "lmsg",
      "room",
      "vclear",
      "Sprivate",
      "delindex",
      "tokenshair",
      "chair",
    ];
  }
  get chair() {
    return this.getAttribute("chair");
  }
  get delindex() {
    return this.getAttribute("delindex");
  }
  get tokenshair() {
    return this.getAttribute("tokenshair");
  }
  get Sprivate() {
    return this.getAttribute("Sprivate");
  }
  get room() {
    return this.getAttribute("rmsg");
  }
  get rmsg() {
    return this.getAttribute("rmsg");
  }
  get lmsg() {
    return this.getAttribute("lmsg");
  }
  get vclear() {
    return this.getAttribute("vclear");
  }
  set vclear(val) {
    return this.setAttribute("vclear", val);
  }
  set delindex(val) {
    return this.setAttribute("delindex", val);
  }
  set rmsg(val) {
    return this.setAttribute("rmsg", val);
  }
  set lmsg(val) {
    return this.setAttribute("lmsg", val);
  }
  set room(val) {
    return this.setAttribute("lmsg", val);
  }
  set Sprivate(val) {
    return this.setAttribute("Sprivate", val);
  }
  set tokenshair(val) {
    return this.setAttribute("tokenshair", val);
  }
  set chair(val) {
    return this.setAttribute("chair", val);
  }

  attributeChangedCallback(prop, oldVal, newVal) {
    if (prop === "") this.render();
    if (prop === "vclear") this.clearMsg();
    if (prop === "rmsg") this.addmsgRight(this.rmsg);
    if (prop === "lmsg") this.addmsgLeft(this.lmsg);
    if (prop === "delindex") this.deleteRecord(this.delindex);
    if (prop === "chair") this.toedit();
    if (prop === "tokenshair") this.toShair();
  }

  toShair() {
    let exampleModal = document.getElementById("exampleModal");
    let message = document.getElementById("message-text");
    let setPass = document.getElementById("setPass");
    let btnSetPass = document.getElementById("btnSetPass");
    let ModalPopup = new bootstrap.Modal(exampleModal, {});
    let modalTitle = exampleModal.querySelector(".modal-title");
    modalTitle.textContent = "Shaire Messaage";
    let payload = JSON.parse(this.tokenshair);
    if (payload.ownlist) {
      setPass.style.display = "inline";
      setPass.dataset.id = payload.id;
      btnSetPass.style.display = "inline";
      document.getElementById("bnset").className="btn btn-primary"
    } else {
      setPass.style.display = "none";
      btnSetPass.style.display = "none";
    }
    message.value = `https://www.1inf.vanikthai.com/data/${payload.index}`;
    ModalPopup.show();
  }

  toedit() {
    document.getElementById("message").value = this.chair;
    let toadd = document.getElementById("mainchat");
    toadd.scrollLeft = toadd.scrollWidth;
  }

  deleteRecord(index) {
    socket.emit("delmainid", index);
  }

  clearMsg() {
    const chatMsg = this.shadow.getElementById("chatmessages");
    chatMsg.innerHTML = "";
  }

  msgload(payload) {
    this.msg;
    return new Promise((res, rej) => {
      try {
        this.msg = JSON.parse(payload);
        res(this.msg);
      } catch {
        rej("Error on load data fromd db");
      }
    });
  }
  ///////////////////////////////////////////////addmsgRight/////////////////////
  addmsgRight(payload) {
    const msg = JSON.parse(payload);
    const chatMsg = this.shadow.getElementById("chatmessages");
    const divR = document.createElement("DIV");
    divR.className = "direct-chat-msg";
    divR.innerHTML = `
    <div class="direct-chat-info clearfix">
    <span class="direct-chat-name pull-left">${msg.from.username}</span>
    <span class="direct-chat-timestamp pull-right">${msg.time}</span>
    </div> 
    <img class="direct-chat-img" src="${msg.from.picture}">
    <div style="margin-left:50px;white-space:pre-wrap;">${decodeURIComponent(
      msg.message
    )}</div>
    `;

    const btndel = this.createBtnDel(msg.index, msg.from);
    const btnEdit = this.createBtnEdit(msg.message);
    const ownlist = id === msg.from.uid ? true : false;
    const btnShair = this.createBtnShair(msg.id, msg.index, ownlist);
    const picfram = document.createElement("div");
    picfram.className = "media-scroller snaps-inline";
    if (msg.pictrueSend.length > 0) {
      msg.pictrueSend.forEach((element) => {
        const pic = document.createElement("div");
        pic.className = "media-element";
        pic.innerHTML = `
          <img src="${element}" >
          `;
        picfram.appendChild(pic);
      });
      divR.appendChild(picfram);
    }

    if (id === msg.from.uid) {
      divR.appendChild(btnEdit);
      divR.appendChild(btndel);
    //  divR.appendChild(btnShair);
    }
    divR.appendChild(btnShair);
    chatMsg.appendChild(divR);
  }
  ////////////////////////////////////////////addmsgLeft/////////////////////////
  addmsgLeft(payload) {
    const msg = JSON.parse(payload);
    const chatMsg = this.shadow.getElementById("chatmessages");
    const divR = document.createElement("DIV");
    divR.className = "direct-chat-msg";
    divR.innerHTML = `
    <div class="direct-chat-info clearfix">
    <span class="direct-chat-name pull-left">${msg.from.username}</span>
    <span class="direct-chat-timestamp pull-right">${msg.time}</span>
    </div> 
    <img class="direct-chat-img" src="${msg.from.picture}">
    <div style="margin-left:50px;white-space:pre-wrap;">
    ${decodeURIComponent(msg.message)}</div>
    `;

    const btndel = this.createBtnDel(msg.index, msg.from);
    const btnEdit = this.createBtnEdit(msg.message);
    const btnShair = this.createBtnShair(msg.id, msg.index, true);
    const picfram = document.createElement("div");
    picfram.className = "media-scroller snaps-inline";
    if (msg.pictrueSend.length > 0) {
      msg.pictrueSend.forEach((element) => {
        const pic = document.createElement("div");
        pic.className = "media-element";
        pic.innerHTML = `
            <img src="${element}" >
            `;
        picfram.appendChild(pic);
      });

      divR.appendChild(picfram);
    }

    divR.appendChild(btnEdit);
    divR.appendChild(btndel);
    divR.appendChild(btnShair);
    chatMsg.insertBefore(divR, chatMsg.firstChild);
  }

  createBtnDel(index, from) {
    const btndel = document.createElement("SPAN");
    btndel.style = "position:relative;float:right";
    btndel.className = "btn btn-box-tool";
    btndel.dataset.index = JSON.stringify({
      idDel: index,
      from: from.uid,
    });
    btndel.addEventListener("click", async (e) => {
      let ondel = JSON.parse(e.currentTarget.dataset.index);
      if (id === ondel.from) {
        this.delindex = await ondel.idDel;
        e.target.parentElement.parentElement.innerHTML = "[ลบแล้ว]";
      } else {
        console.log("deffent user Can't deleting...");
      }
    });
    btndel.innerHTML = this.btnDelete();
    return btndel;
  }

  createBtnShair(index, id, ownlist) {
    const btnshair = document.createElement("SPAN");
    btnshair.style = "position:relative;float:right";
    btnshair.className = "btn btn-box-tool";
    let payload = {
      index,
      id,
      ownlist,
    };
    btnshair.dataset.index = JSON.stringify(payload);
    btnshair.addEventListener("click", async (e) => {
      this.tokenshair = e.currentTarget.dataset.index;
    });
    btnshair.innerHTML = this.btnShair();
    return btnshair;
  }

  btnedit() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
       </svg>
      `;
  }
  btnDelete() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
      `;
  }
  btnShair() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-check" viewBox="0 0 16 16">
      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/>
      <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
     </svg>
      `;
  }
  msgalert(title = "", msg = "") {
    return `
      <div class="alert ${title}">
      <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span> 
      <strong>${title}!</strong> ${msg}
       </div>
      `;
  }
  createBtnEdit(message) {
    const btchair = document.createElement("SPAN");
    btchair.style = "position:relative;float:right";
    btchair.className = "btn btn-box-tool";
    btchair.dataset.data = message;
    btchair.addEventListener("click", (e) => {
      this.chair = decodeURIComponent(e.currentTarget.dataset.data);
    });
    btchair.innerHTML = this.btnedit();
    return btchair;
  }
  addcontacts(message) {
    const chatMsg = this.shadow.getElementById("chatmessages");
    const divR = document.createElement("DIV");
    divR.className = "direct-chat-contacts";
    divR.innerHTML = `
        <ul class="contacts-list">
          <li>
            <a href="#">
              <img class="contacts-list-img" src="https://bootdey.com/img/Content/user_1.jpg">

              <div class="contacts-list-info">
                    <span class="contacts-list-name">
                      ${message}
                      <small class="contacts-list-date pull-right">2/28/2015</small>
                    </span>
                <span class="contacts-list-msg">How have you been? I was...</span>
              </div>
              <!-- /.contacts-list-info -->
            </a>
          </li>
          <!-- End Contact Item -->
        </ul>
    `;
    chatMsg.appendChild(divR);
    chatMsg.scrollTop = chatMsg.scrollHeight;
  }

  connectedCallback() {
    this.render();
  }

  loaddata() {
    const chatMsg = this.shadow.getElementById("chatmessages");
    chatMsg.addEventListener("scroll", (e) => {
      let stop = e.currentTarget.scrollTop + 500;
      let sheitht = e.currentTarget.scrollHeight;

      let total = sheitht - stop;

      if (total === 0) {
        let sql = `SELECT * FROM mainpage ORDER BY id_main DESC LIMIT 5;`;
        socket.emit("lastmainpage", sql);
        console.log("Loadding....");
      }
    });
  }

  render() {
    this.shadow.innerHTML =
      chatCss +
      `
      <div id="chatmessages" class="direct-chat-contacts" xmove="false" >
      </div>
    `;
  }
}

export default function wsMain() {
  console.log("component formMain start..");
  customElements.define("ws-main", formMain);
}
