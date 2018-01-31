const formatUser = (user) => {
  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    adult: user.adult,
    blogs: user.blogs
  }
}

module.exports = formatUser
