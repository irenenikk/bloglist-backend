const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const eventsRouter = require('./controllers/events')
const middleware = require('./utils/middleware')

const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.getToken)
app.use(middleware.logger)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/events', eventsRouter)

mongoose.connection.openUri(config.mongoUrl)
mongoose.Promise = global.Promise

const PORT = config.port
const server = http.createServer(app)

const io = require('socket.io')(server)

io.on('connection', () => {
  console.log('Socket is connected')
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
