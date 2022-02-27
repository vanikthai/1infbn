//import indexdb from "../controls/indexdb.js";
import connecmain from "../ws/connecmain.js";
import msgMain from "../components/formMain.js";
//import comusers from "../components/comusers.js";
async function start() {
  //  indexdb();
  console.log("main start..");
  msgMain();
  connecmain();
}
window.addEventListener("offline", offOnlineStatus);

window.addEventListener("load", function () {
  start();
});

function offOnlineStatus(event) {
  // window.addEventListener("online", OnlineStatus);
  showmsg("offline", "ไม่สามารถเชื่อมต่ออินเตอร์เน็ตได้กรุณาตรวจสอบ");
  window.addEventListener("online", OnlineStatus);
}
function OnlineStatus(event) {
  showmsg("online", "อินเตอร์เน็ตของคุณได้รับการเชื่อมต่อแล้ว");
}

function showmsg(title, msg) {
  document.getElementById("tosehead").innerText = title;
  document.getElementById("tosebody").innerHTML = msg;

  new bootstrap.Toast(document.querySelector("#basicToast")).show();
}
