const formatUser = (user) => {
  return {
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }
}

module.exports = formatUser
