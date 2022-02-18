window.addEventListener("load", function () {
  function offOnlineStatus(event) {
    document.write(`offline`)
    window.addEventListener("online", OnlineStatus);

  }
  function OnlineStatus(event) {
    window.location.href = "https://www.1inf.vanikthai.com";
    window.setTimeout(() => {
      window.location.reload(true); 
      alert("reload");
    }, 200);
  }
 // window.addEventListener("online", OnlineStatus);
  window.addEventListener("offline", offOnlineStatus);
  settingStart();
});

function settingStart() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((registration) => {
        console.log("SW Registered!");
      })
      .catch((error) => {
        console.log("SW Registeration Fail");
        console.log(error);
      });
  }

  if (Notification.permission === "granted") {
    console.log("We have permission!");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });
  }
}
(function () {
  if (typeof EventTarget !== "undefined") {
    let func = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, capture) {
      this.func = func;
      if (typeof capture !== "boolean") {
        capture = capture || {};
        capture.passive = false;
      }
      this.func(type, fn, capture);
    };
  }
})();


