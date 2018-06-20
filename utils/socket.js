
let io

const createConnection = (server) => {
  io = require('socket.io')(server)
}

const emitEvent = (event) => {
  if (io === undefined) {
    console.log('No socket connection established')
    return
  }
  console.log('Emitting event: ' + JSON.stringify(event))
  io.emit('newEvent', event)
}

module.exports = {
  createConnection,
  emitEvent
}