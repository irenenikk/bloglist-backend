const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

const validateUser = async (user) => {
  const errors = []
  if (!user.username || user.username.length < 3) {
    errors.push('Username must be at least 3 characters long')
  }
  if (!user.password || user.password.length < 3) {
    errors.push('Password must be at least 3 characters long')
  }
  const users = await User.find()
  const usernames = users.map(u => u.username)
  if (usernames.includes(user.username)) {
    errors.push('Username must be unique')
  }
  return errors
}

const createPasswordHash = async (password) => {
  const saltRounds = 10
  const hash = await bcrypt.hash(password, saltRounds)
  return hash
}

usersRouter.get('/', async (request, response) => {
  try {
    const users = await User.find().populate('blogs')
    response.json(users)
  } catch (e) {
    response.status(500).send('Could not get users')
  }
})


usersRouter.post('/', async (request, response) => {
  const userInfo = request.body
  const errors = await validateUser(userInfo)
  if (errors.length > 0) {
    return response.status(400).send(errors.join('\n'))
  }
  try {
    const passwordHash = await createPasswordHash(userInfo.password)
    const user = new User({ ...userInfo, passwordHash })
    const savedUser = await user.save()
    response.json(savedUser)
  } catch (e) {
    response.status(400).send('Could not save user')
  }
})

module.exports = usersRouter
