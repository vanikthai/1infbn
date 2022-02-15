import chatCss from "../css/c_chat.js";
import IDB from "../controls/indexdb_class.js";
const database = new IDB();
class formChat extends HTMLElement {
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
      "xmove",
      "chair"
    ];
  }
  get chair() {
    return this.getAttribute("chair");
  }
  get delindex() {
    return this.getAttribute("delindex");
  }
  get xmove() {
    return this.getAttribute("xmove");
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
  set xmove(val) {
    return this.setAttribute("xmove", val);
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
    if (prop === "chair") document.getElementById("message").value = this.chair;
    // if (prop === "xmove") this.loaddata();
  }

  deleteRecord(index) {
    const payload = JSON.parse(index);
    if (payload.to === "none") {
      database.deleteCurcur("message", payload.del);
      this.clearMsg();
      database.showLastMsg("message");
    } else if (payload.to === "offline") {
      console.log(index);
      return;
    } else {
      database.deleteCurcur(payload.to.uid, payload.del);
      this.clearMsg();
      database.showLastMsg(payload.to.uid);
    }
  }

  clearMsg() {
    const chatMsg = this.shadow.getElementById("chatmessages");
    chatMsg.innerHTML = "";
  }

  addmsgRight(payload) {
    const msg = JSON.parse(payload);
    let mass = decodeURIComponent(msg.message)
    const datamsg = mass.split("/");
    let mg;
    if (datamsg[0] === "data:image") {
      mg = `  <img class="direct-chat-pic" src="${mass}">`;
    } else {
      mg = `<div class="direct-chat-text">${mass}</div>` ;
    }
    const chatMsg = this.shadow.getElementById("chatmessages");
    const divR = document.createElement("DIV");
    divR.className = "direct-chat-msg right";

    let pic = `<img class="direct-chat-img" src="${msg.from.picture}">`;
    divR.innerHTML = `
    <div class="direct-chat-info clearfix">
      <span class="direct-chat-name pull-right">${msg.from.username}</span>
      <span class="direct-chat-timestamp pull-left">${msg.time}</span>
    </div>
    <!-- /.direct-chat-info -->
    ${pic}
    ${mg}
    `;
    const btndel = document.createElement("SPAN");
    btndel.style = "position:relative;float:right";
    btndel.className = "btn btn-box-tool";
    btndel.dataset.index = JSON.stringify({
      del: msg.index,
      to: msg.to,
    });
    btndel.addEventListener("click", (e) => {
      this.delindex = e.currentTarget.dataset.index;
    });
    btndel.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
    `;
    const btchair = this.createBtnChair(msg.message)
    divR.appendChild(btndel);
    divR.appendChild(btchair);
    chatMsg.appendChild(divR);
    // if (this.xmove === "false")
     chatMsg.scrollTop = chatMsg.scrollHeight;
    //this.loadmsg()
  }

  addmsgLeft(payload) {
    const msg = JSON.parse(payload);
    let mass = decodeURIComponent(msg.message)
    const datamsg = mass.split("/");
    let mg;
    if (datamsg[0] === "data:image") {
      mg = `  <img class="direct-chat-pic" src="${mass}">`;
    } else {
      mg = `<div class="direct-chat-text">${mass}</div>` ;
    }
    const chatMsg = this.shadow.getElementById("chatmessages");
    const divR = document.createElement("DIV");
    divR.dataset.private = JSON.stringify(msg.from);
    divR.className = "direct-chat-msg";
    divR.innerHTML = `
    <div class="direct-chat-info clearfix">
    <span class="direct-chat-name pull-left">${msg.from.username}</span>
    <span class="direct-chat-timestamp pull-right">${msg.time}</span>
    </div> 
    <img class="direct-chat-img" src="${msg.from.picture}">
    ${mg}
    </div>
    `;
    divR.addEventListener("click", (e) => {
      this.Sprivate = e.currentTarget.dataset.private;
    });

   
    const btndel = document.createElement("SPAN");
    btndel.style = "position:relative;float:right";
    btndel.className = "btn btn-box-tool";
    btndel.dataset.index = JSON.stringify({
      del: msg.index,
      to: msg.to,
    });
    btndel.addEventListener("click", (e) => {
      this.delindex = e.currentTarget.dataset.index;
    });
    btndel.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
    `;
    const btnChair = this.createBtnChair(msg.message)
    
    divR.appendChild(btndel);
    divR.appendChild(btnChair);
    chatMsg.appendChild(divR);
    // if (this.xmove === "false") 
    chatMsg.scrollTop = chatMsg.scrollHeight;
  }
  createBtnDel(msg) {
    const btndel = document.createElement("SPAN");
    btndel.style = "position:relative;float:right";
    btndel.className = "btn btn-box-tool";
    btndel.dataset.index = JSON.stringify({
      del: msg.index,
      to: msg.from,
    });
    btndel.addEventListener("click", (e) => {
      this.delindex = e.currentTarget.dataset.index;
    });
    btndel.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>
    `;
    return btndel
  }

  createBtnChair(message) {
    const btchair = document.createElement("SPAN");
    btchair.style = "position:relative;float:right";
    btchair.className = "btn btn-box-tool";
    btchair.dataset.data = message;
    btchair.addEventListener("click", (e) => {
      this.chair = e.currentTarget.dataset.data;
    });
    btchair.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-check" viewBox="0 0 16 16">
  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/>
  <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
    </svg>
    `;
    return btchair
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
    // this.loadmsg()
  }

  connectedCallback() {
    this.render();
    this.loaddata(); 
   // this.addcontacts();
    // btnedit.addEventListener('click', this.edit.bind(this))
    //this.loadmsg()
  }

  loaddata() {
   
    const chatMsg = this.shadow.getElementById("chatmessages");
    chatMsg.addEventListener("scroll", (e)=> {
      if (this.xmove === "false") return;
      let stop = e.currentTarget.scrollTop + 370;
      let sheitht = e.currentTarget.scrollHeight;
  
      let total = sheitht - stop;
      if (total === 0) console.log("Loadding...." + this.xmove);
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

export default function wsChat() {
  console.log("component formChat start..");
  customElements.define("ws-chat", formChat);
}
