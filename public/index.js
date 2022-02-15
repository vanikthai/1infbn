window.addEventListener("load", function () {
    function offOnlineStatus(event) {
      document.write("สัญญาณอินเตอร์เน็ต ไม่มีการเชื่อมต่อ" + event.type);
    }
    function OnlineStatus(event) {
      window.location.href = "https://www.1inf.vanikthai.com";
    }
    window.addEventListener("online", OnlineStatus);
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