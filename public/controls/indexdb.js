import IDB from "./indexdb_class.js";

export default () => {
  if (!window.indexedDB) {
    window.indexedDB =
      window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  }
  // prefixes of window.IDB objects
  window.IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
  window.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

  if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
  } else {
    const idb = new IDB();
     Promise.all([idb.create("users"),
     idb.create("senduser"),
     idb.create("recordRead"),
     idb.createMsg("message")])
     .then(msg=>{console.log(msg);})
     .catch(err=>{console.log(err);})
  }
};
