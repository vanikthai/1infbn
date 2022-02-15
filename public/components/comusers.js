import chatCss from "../css/c_chat.js";
class formUser extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.username = "";
    this.room = "";
    this.uid = "";
    this.online = "";
    this.onlinetime = "";
    this.clear = "";
    this.picture = "";
  }

  static get observedAttributes() {
    return ["user", "cuser", "vonline", "currentroom","mscount", "userid"];
  }
  get userid() {
    return this.getAttribute("userid");
  }
  get mscount() {
    return this.getAttribute("mscount");
  }
  get currentroom() {
    return this.getAttribute("currentroom");
  }
  get vonline() {
    return this.getAttribute("online");
  }
  get user() {
    return this.getAttribute("user");
  }
  get cuser() {
    return this.getAttribute("cuser");
  }
  set user(val) {
    this.username = val.username;
    this.room = val.room;
    this.uid = val.uid;
    this.online = val.online;
    this.onlinetime = val.onlinetime;
    this.picture = val.picture;
    return this.setAttribute("user", val);
  }
  set vonline(val) {
    this.username = val.username;
    this.room = val.room;
    this.uid = val.uid;
    this.online = val.online;
    this.onlinetime = val.onlinetime;
    this.picture = val.picture;
    return this.setAttribute("online", val);
  }
  set currentroom(val) {
    return this.setAttribute("currentroom", val);
  }
  set cuser(val) {
    return this.setAttribute("cuser", val);
  }
  set userid(val) {
    return this.setAttribute("userid", val);
  }
  set mscount(val) {
    return this.setAttribute("mscount", val);
  }
    

  attributeChangedCallback(prop, oldVal, newVal) {
    if (prop === "") this.render();
    if (prop === "user") {
      this.adduser();
      this.getdataitem();
    }
    if (prop === "vonline") this.vonline();
    if (prop === "mscount") this.setMsgCount();
    if (prop === "cuser") {
      this.clearuser();
    }
  }

  clearuser() {
    this.render();
  }

  vonline() {
    const divR = this.shadow.getElementById(this.uid);
    divR.dataset.room = this.room;
    let vcolor = "green";
    if (this.online === "offline") vcolor = "red";
    if (this.room === undefined) vcolor = "red";

    divR.innerHTML = `
        <div class="direct-chat-info clearfix">
        <span style="color:${vcolor}" class="direct-chat-name pull-left">${this.online}</span>
        <span class="direct-chat-timestamp pull-right">${this.onlinetime}</span>
        </div>
        <img class="direct-chat-img" src="${this.picture}" alt="Message User Image">
        <div class="direct-chat-text1">
        ${this.username}
        </div>
        </div>`;
  }

  adduser() {
    const chatMsg = this.shadow.getElementById("chatmessages");
    if (this.clear === "true") chatMsg.innerHTML = "";
    const divR = document.createElement("DIV");
    divR.className = "direct-chat-msg";
    divR.id = this.uid;
    divR.dataset.room = this.room;
    divR.dataset.uid = this.uid;
    divR.dataset.username = this.username;
    divR.dataset.online = this.online;
    divR.dataset.picture = this.picture;
    let vcolor = "green";
    let st = `<span style="position:absolute;font-size:small;color:white;background-color:red;border-radius:20px; padding:5px;">${this.mscount}</span>`
    if(this.mscount==null||this.mscount ==="") st = ""
    if (this.online === "offline") vcolor = "red";
    divR.innerHTML = `
        <div class="direct-chat-info clearfix">
        <span style="color:${vcolor}" class="direct-chat-name pull-left">${this.online}</span>
        <span class="direct-chat-timestamp pull-right">${this.onlinetime}</span>
        </div>
        <img class="direct-chat-img" src="${this.picture}" alt="Message User Image">
        <div class="direc0">
        ${this.username}
        </div>
        <div id="count${this.uid}" class="new-msg">${st}</div>
        </div>
    `;

    divR.addEventListener("click", (e) => {
      this.currentroom = JSON.stringify(e.currentTarget.dataset);
      const menux = this.shadow.querySelectorAll(".direc1");

      menux.forEach((menuData) => {
        menuData.className = "direc0";
      });
     // if (e.target.className === "direc0") {
        e.target.className = "direc1";
     // }
    });

    chatMsg.appendChild(divR);
    chatMsg.scrollTop = chatMsg.scrollHeight;
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
            </a>
          </li>
        </ul>
    `;
    chatMsg.appendChild(divR);
    chatMsg.scrollTop = chatMsg.scrollHeight;
  }

  setMsgCount() {
    try {
     let newmsg =  this.shadow.getElementById(`${this.userid}`).children[3]
     if(this.mscount ==="") {
      newmsg.innerHTML = "" 
      return
     } 
     newmsg.innerHTML = `
     <span style="position:absolute;font-size:small;color:white;background-color:red;border-radius:20px; padding:5px;">${this.mscount}</span>
     `
    } catch{}
  }

  getdataitem() {
    const menux = this.shadow.querySelectorAll(".direct-chat-text");
    menux.forEach((menuData) => {
      menuData.addEventListener("click", (e) => {
        console.log("TOOL: " + JSON.stringify(e.currentTarget.dataset));
      });
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML =
      chatCss + `<div id="chatmessages" class="direct-chat-messages"></div>`;
    this.getdataitem();
  }
}

export default function wsChat() {
  console.log("component comuser start..");
  customElements.define("ws-users", formUser);
}
