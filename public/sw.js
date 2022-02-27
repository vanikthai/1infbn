self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      cache.addAll([
        "/",
        "/index.js",
        "/ws.js",
        "/manifest.json",
        "/ws/connecmain.js",
        "/ws/connecprofile.js",
        "/ws/connecresetpass.js",
        "/ws/connecsetting.js",
        "/ws/connect.js",
        "/ws/connectionstart.js",
        "/ws/socket.js",
        "/ws/theuser.js",
        "/ws/wsload.js",
        "/js/main.js",
        "/js/mainpage.js",
        "/js/profile.js",
        "/js/resetpass.js",
        "/js/setting.js",
        "/images/icon-129x129.png",
        "/images/icon-256x256.png",
        "/images/icon-384x384.png",
        "/images/icon-512x512.png",
        "/css/c_chat.js",
        "/css/chat.css",
        "/css/table.css",
        "/controls/datetime.js",
        "/controls/discriplist.js",
        "/controls/imagesize.js",
        "/controls/indexdb_class.js",
        "/controls/indexdb.js",
        "/controls/tabledata.js",
        "/controls/tablediscrip.js",
        "/controls/uuid.js",
        "/components/comusers.js",
        "/components/formChat.js",
        "/components/formChatRight.js",
        "/components/formMain.js",
        "/avatars/avatar1.png",
        "/avatars/avatar2.png",
        "/avatars/avatar3.png",
        "/avatars/avatar4.png",
        "/avatars/avatar5.png",
        "/avatars/avatar6.png",
        "/avatars/avatar7.png",
        "/avatars/avatar8.png",
        "/avatars/user_1.jpg",
        "/avatars/user_2.jpg",
        "/avatars/user_3.jpg",
        "/avatars/user_5.jpg",
        "/avatars/user_6.jpg",
        "/avatars/user_7.jpg",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches
              .open("v1")
              .then((cache) => {
                // cache.put(event.request, responseClone);
              })
              .catch((err) => {
                console.log(err);
              });
            return response || responseClone;
          })
          .catch(() => {
            return caches.match("/images/icon-512x512.png");
          });
      }
    })
  );
});

self.addEventListener("push", (e) => {
  const data = e.data;
  console.log(data);
  self.registration.showNotification(data.title, {
    icon: "/images/favicon-128x128.png",
    body: data.message,
  });
});
