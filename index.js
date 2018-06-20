const http = require('http')
const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const eventsRouter = require('./controllers/events')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const socket = require('./utils/socket')

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

app.use(cors(corsOptions))
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
const server = http.createServer(app).listen(PORT)

socket.createConnection(server)

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}
