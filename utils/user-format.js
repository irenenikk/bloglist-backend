const formatUser = (user) => {
  return {
    username: user.username,
    name: user.name,
    adult: user.adult,
    passwordHash: user.passwordHash,
    blogs: user.blogs
  }
}

module.exports = formatUser
