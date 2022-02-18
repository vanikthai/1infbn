import connecmain from "../ws/connecresetpass.js";

async function start() {
console.log("Resetpass script start..");
  connecmain();
}
 
window.addEventListener("load", function () {
  start();
});

