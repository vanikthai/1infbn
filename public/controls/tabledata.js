import socket from "../ws/socket.js";
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
        const row = this.root.querySelector(".entries tr:last-of-type");

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
    const row = e.target.closest("tr"); 
    // row.remove()
    const id = row.querySelector("#username").dataset.id
    const kind = row.querySelector("#kind").value
    const allow = row.querySelector("#allow").value
    const payload = {
        id,
        kind,
        allow
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