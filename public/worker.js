self.addEventListener('push', e => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    icon: '/images/favicon-128x128.png',
    body: data.message
  })
})
