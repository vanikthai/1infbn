import socket from "../ws/socket.js";
export default class Distription {
  
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = Distription.html();

    this.root.querySelector(".new-entry").addEventListener("click", () => {
      this.onNewEntryBtnClick();
    });
  }

  static html() {
    return `
            <table class="budget-tracker">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody class="entries"></tbody>
                <tbody>
                    <tr>
                        <td colspan="2" class="controls">
                            <button type="button" class="new-entry">New Entry</button>
                        </td>
                    </tr>
                </tbody>
             
            </table>
        `;
  }

  static entryHtml() {
    return `
            <tr>
                <td>
                <input id="discrip" class="input input-description" type="text" placeholder="Add a Description">
                <input id="keyword" class="input input-description" type="text" placeholder="Add a Description keys">
                </td>
                <td>
                    <button type="button" id="saveentry" class="delete-entry">✔</button>
                </td>
                <td>
                    <button type="button" id="deleteentry" class="delete-entry">&#10005;</button>
                </td>
            </tr>
        `;
  }

  load(entries) {
    for (const entry of entries) {
      console.log(entry);
      this.addEntry(entry);
    }
    //  this.finddistripfromdb()
  }

  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("beforeend", Distription.entryHtml());
    const row = this.root.querySelector(".entries tr:last-of-type");

    row.querySelector("#discrip").dataset.id = entry.id_discrip || 0;
    row.querySelector("#discrip").value = entry.discrip || "";
    row.querySelector("#keyword").value = entry.keyword || "";

    row.querySelectorAll(".input").forEach((input) => {
      input.addEventListener("change", (e) => {
        this.update(e);
      });
      input.addEventListener("keypress", (e) => {
        this.updateflag(e); 
      });
    });
  }

  addNewEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("beforeend", Distription.entryHtml());
    const row = this.root.querySelector(".entries tr:last-of-type");

    row.querySelector("#discrip").dataset.id = entry.id_discrip || 0;
    row.querySelector("#discrip").value = entry.discrip || "";
    row.querySelector("#keyword").value = entry.keyword || "";

    row.querySelector("#deleteentry").addEventListener("click", (e) => {
      this.onDeleteEntryBtnClick(e);
    });
    row.querySelector("#saveentry").addEventListener("click", (e) => {
      this.onSaveEntryBtnClick(e);
    });
  }

  save(e) {
    const row = e.target.closest("tr");
    const discrip = row.querySelector("#discrip").value;
    const keyword = row.querySelector("#keyword").value;
    const payload = {
      discrip,
      keyword,
    };
    console.log(payload);
    socket.emit("adddiscrip", payload);
  }
  update(e) {
    const row = e.target.closest("tr");
    row.querySelector("#discrip").style = "color:green";
    row.querySelector("#keyword").style = "color:green";
    // row.remove()
    const id = row.querySelector("#discrip").dataset.id || 0;
    const discrip = row.querySelector("#discrip").value;
    const keyword = row.querySelector("#keyword").value;
    // var word = key.split(',');
    if (discrip === "") return;
    row.querySelector("#saveentry").style = "color:green";
    const payload = {
      id,
      discrip,
      keyword,
    };
    socket.emit("updatediscrip", payload);
  }

  updateflag(e) {
    const flag = e.target.closest("tr")
   // console.log(flag);
    flag.querySelector("#saveentry").style = "color:red";
  }

  onNewEntryBtnClick() {
    this.addNewEntry();
  }
  onDeleteEntryBtnClick(e) {
    e.target.closest("tr").remove();
  }
  onSaveEntryBtnClick(e) {
    e.target.closest("tr").querySelector("#saveentry").style = "color:green";
    this.save(e);
  }

  finddistripfromdb() {
    this.root.querySelector("#finddiscrip").addEventListener("click", (e) => {
      e.preventDefault();
      let fname = this.root.querySelector("#fdiscrip").value;
      if (fname === "") return;
      this.root.innerHTML = BudgetTracker.html();
      let payload = `SELECT * FROM discrips WHERE discrip LIKE "${fname}%";`;
      socket.emit("loaddiscrip", payload);
    });
  }
}
