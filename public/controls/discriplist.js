export default class DiscripList {
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = DiscripList.html();
  }

  static html() {
    return `
        <select class="form-select" id="formselect" size="10" aria-label="size 1 select example">
        </select>
        `;
  }
  static entryHtml() {
    return `
            <option value="1">One</option>
        `;
  }

  addEntry(entry = {}) {
    this.root
      .querySelector(".form-select")
      .insertAdjacentHTML("beforeend", DiscripList.entryHtml());
    const row = this.root.querySelector(".form-select option:last-of-type");
    if(entry.id_discrip===1) row.selected = true;
    row.dataset.id = entry.keyword || "";
    row.value = entry.id_discrip || "";
    row.innerHTML = entry.discrip || "";
  }

  load(entries) {
    for (const entry of entries) {
      this.addEntry(entry);
    }
  }
}
