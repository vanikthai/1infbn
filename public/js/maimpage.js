//import indexdb from "../controls/indexdb.js";
import connecmain from "../ws/connecmain.js";
import msgMain from "../components/formMain.js";
//import comusers from "../components/comusers.js";
async function start() {
//  indexdb();
console.log("main start..");
  msgMain()
  connecmain();
}

window.addEventListener("load", function () {
  start();
});

