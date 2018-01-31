const User = require('../models/user')
const formatUser = require('../utils/user-format')

const initialUsers = [
  {
    username: 'lollero96',
    name: 'Lollero von Lollerson',
    adult: true,
    passwordHash: '$2a$10$JIoApn2oDnFcwBJ4bTF7meMPm6upJJaNHMJe2PbzSo8GKLcidKj8C'
  }
]

const usersInDatabase = async () => {
  const users = await User.find()
  return users.map(formatUser)
}

module.exports = {
  initialUsers,
  usersInDatabase
}
