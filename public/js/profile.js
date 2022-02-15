import connecmain from "../ws/connecprofile.js";
async function start() {
console.log("Profile script start..");
  connecmain();
}

window.addEventListener("load", function () {
  start();
});

