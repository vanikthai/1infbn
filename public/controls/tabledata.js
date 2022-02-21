import socket from "../ws/socket.js";
import { id as uid, username as vname, picture } from "../ws/theuser.js";
import datetime from "../controls/datetime.js";
export default class BudgetTracker {
    constructor(querySelectorString) {
        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();
    }
 
    static html() {
        return `
        <form class="d-flex" id="findUser">
             <input id="fname" class="form-control me-2" autocomplete="off" type="search" placeholder="Search" aria-label="Search">
             <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
            <table class="budget-tracker">
                <thead>
                    <tr>
                        <th>ชื่อผู้ใช้</th>
                        <th>สิทธิ์</th>
                        <th>อนุญาต</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
        `;
    }

    static entryHtml() {
        return `
            <tr>
                <td>
                    <div id="username" > </div
                </td>
                <td>
                    <select id="kind" class="input input-type">
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                    </select>
                </td>
                <td>
                    <select id="allow" class="input input-type">
                        <option value="none">none</option>
                        <option value="allow">allow</option>
                    </select>
                </td>
                <td>
                <div id="updateby" >No update </div
                </td>
            </tr>
        `;
    }

    load(entries) {
        for (const entry of entries) {
            this.addEntry(entry);
        }
       this.finduserfromdb()
    }

    addEntry(entry = {}) {

        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());
        let row = this.root.querySelector(".entries tr:last-of-type");
        if(entry.updateby) {
               let updateby =  JSON.parse(entry.updateby)
               let msg = `${updateby.username}: ${updateby.time}`
               row.querySelector("#updateby").innerHTML =  msg || "none";
              
        }
      
        row.querySelector("#username").innerHTML = entry.username || "";
        row.querySelector("#username").dataset.id = entry.id_user || 0;
        row.querySelector("#kind").value = entry.kind || "user";
        row.querySelector("#allow").value = entry.allow || "none";

        row.querySelectorAll(".input").forEach(input => {
            input.addEventListener("change", (e) => {
                this.save(e)
            });
        });
    }

    save(e) {
    let row = e.target.closest("tr"); 
    let id = row.querySelector("#username").dataset.id
    let kind = row.querySelector("#kind").value
    let allow = row.querySelector("#allow").value
    let user = {
        uid, 
        username: vname,
        picture,
        time: datetime(),
        send: function() {
            return JSON.stringify(this)
        } 
    }
    let payload = {
        id,
        kind,
        allow,
        updateby:  user.send()
    }
    socket.emit("updatusersetting", payload);
    }

    finduserfromdb() {
        this.root.querySelector("#findUser").addEventListener("click", (e) => {
            e.preventDefault();
            let fname = this.root.querySelector("#fname").value;
            if(fname==="") return
            this.root.innerHTML = BudgetTracker.html();
            let payload = `SELECT * FROM users WHERE username LIKE "${fname}%";`;
            socket.emit("loaduser", payload);
         });
    }
}