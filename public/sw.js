
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/index.js',
        '/js/main.js'
      ])
    })
  ) 
})

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    if (response !== undefined) {
      return response
    } else {
      return fetch(event.request).then(function (response) {
        const responseClone = response.clone()
        caches.open('v1').then(function (cache) {
         //  cache.put(event.request, responseClone)
        })
        return response || responseClone
      }).catch(function () {
        return caches.match('/images/icon-512x512.png')
      })
    }
  }))
})

self.addEventListener('push', e => {
  
  const data = e.data
  console.log(data) 
  self.registration.showNotification(data.title, {
    icon: '/images/favicon-128x128.png',
    body: data.message
  })
})
