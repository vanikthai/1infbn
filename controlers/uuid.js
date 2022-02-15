module.exports = {
    uuid: function () {
      let dt = new Date().getTime()
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          const r = (dt + Math.random() * 16) % 16 | 0
          dt = Math.floor(dt / 16)
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
        }
      )
      return uuid
    },
    thaiDate: function () {
        const dateObj = new Date()
      const hhr = dateObj.getHours() || 12
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
  }
  