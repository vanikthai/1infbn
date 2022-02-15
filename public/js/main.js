import connect from "../ws/connect.js";
import indexdb from "../controls/indexdb.js";
import msgChat from "../components/formChat.js";
import comusers from "../components/comusers.js";
async function start() {
  indexdb();
  await msgChat(); 
  await comusers();
  connect();
}

window.addEventListener("load", function () {
  start();
});

