const formatUser = require('../utils/user-format')

const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: formatUser(blog.user)
  }
}

module.exports = formatBlog
