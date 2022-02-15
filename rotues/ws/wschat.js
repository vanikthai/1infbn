/* eslint-disable no-case-declarations */
const users = []
function sendUsers (method, parames) {
  Object.keys(users).forEach((key) => {
    try {
      send(users[key].ws, { method: method, parames: parames })
    } catch (error) {
      console.log(`[server]: ${users[key].user.username} ERROR to send has been deleted`)
      delete users[key]
    }
  })
}
const send = (ws, data) => {
  const d = JSON.stringify({
    jsonrpc: '2.0',
    ...data
  })
  ws.send(d)
}
module.exports = (ws, res) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg)
    switch (data.method) {
      case 'login':
        const { uid, username } = data.params
        users[uid] = {
          user: { uid, username },
          ws: ws
        }
        const payload = {
          uid: uid,
          username: username,
          msg: `[server] ${username}- login`
        }
        sendUsers('login', payload)
        break
    }
  })
  ws.on('close', (e) => {
    console.log('[server] Some client was closed..' + e)
  })
}
