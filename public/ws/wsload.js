/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-case-declarations */

// import DBUSER from '../js/indexdb.js'
const theuser = document.getElementById('userset').dataset.user
const { id, username, email } = JSON.parse(theuser)

function formatDate () {
  const dateObj = new Date()
  const hhr = dateObj.getHours()
  const parts = {
    date: dateObj.getDate().toString().padStart(2, '0'),
    mont: dateObj.getMonth().toString().padStart(2, '0'),
    year: dateObj.getFullYear() + 543,
    hour: hhr.toString().padStart(2, '0'),
    minute: dateObj.getMinutes().toString().padStart(2, '0'),
    amOrPm: dateObj.getHours() < 12 ? 'AM' : 'PM'
  }
  return `${parts.date}-${parts.mont}-${parts.year} ${parts.hour}:${parts.minute} ${parts.amOrPm}`
}

function locate () {
  let col = ''
  if (location.host === 'localhost:3000') {
    col = `ws://${location.host}/chat`
  } else {
    col = `wss://${location.host}/chat`
  }
  console.log(col)
  return col
}
export function startWs () {
  // const dbp = new DBUSER()
  console.log('[WS] start')
  const bottonmsg = document.getElementById('bottonmsg')
  // const toggleOnline = document.getElementById('toggleOnline')
  const ws = new WebSocket(locate())
  window.send = (data) => {
    try {
      ws.send(JSON.stringify(data))
    } catch (e) {
      bottonmsg.innerHTML = e.message
    }
  }

  ws.onopen = () => {
    bottonmsg.innerHTML = `[client ${username}] ทำกาเชื่อมต่อแล้ว..`
    const payload = {
      uid: id,
      username: username,
      email: email
    }
    // eslint-disable-next-line no-undef
    send({ method: 'login', params: payload })
  }

  ws.onmessage = (e) => {
    const res = JSON.parse(e.data)
    switch (res.method) {
      case 'login':
        const { username } = res.parames
        // const noitfi = () =>
        //   new Notification('welcome', {
        //     body: username,
        //     icon: '../images/icon-192x192.png'
        //   })
        bottonmsg.innerHTML =
          '[server] ' + username + ' เข้าใช้้งาน ' + formatDate()
        // noitfi()
        break
      
    }
  }

  ws.onclose = async () => {
    bottonmsg.innerHTML = '[client] ตัดการเชื่อมต่อ'
    location.reload()
  }
}
