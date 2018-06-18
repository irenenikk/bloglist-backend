const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

const isPasswordCorrect = async (password, user) => {
  return (user === null ?
    false :
    await bcrypt.compare(password, user.passwordHash))
}

loginRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    const user = await User.findOne({ username: body.username })
    const passwordCorrect = await isPasswordCorrect(body.password, user)
    if (!(user && passwordCorrect)) {
      return response.status(401).send('Username or password is invalid')
    }
    const userForToken = {
      username: user.username,
      id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (e) {
    response.status(500).send('Login failed')
  }
})

module.exports = loginRouter
