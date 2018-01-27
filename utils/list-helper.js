const totalLikes = (blogs) => {
  return blogs.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.sort((b1, b2) => {
    return b2.likes - b1.likes
  })[0]
}

const orderAuthorsByBlogCount = (blogs) => {
  const blogCountByAuthor = blogs.reduce((groups, curr) => {
    const author = curr.author
    groups[author] = groups[author] || 0
    groups[author] += 1
    return groups
  }, {})
  return Object.entries(blogCountByAuthor)
    .map(o => {
      return { author: o[0], blogs: o[1] }
    })
    .sort((o1, o2) => o2.blogs - o1.blogs)
}

const orderAuthorsByLikeCount = (blogs) => {
  const blogCountByAuthor = blogs.reduce((groups, curr) => {
    const author = curr.author
    const likes = curr.likes
    groups[author] = groups[author] || 0
    groups[author] += likes
    return groups
  }, {})
  return  Object.entries(blogCountByAuthor)
    .map(o => {
      return { author: o[0], likes: o[1] }
    })
    .sort((o1, o2) => o2.likes - o1.likes)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  return orderAuthorsByBlogCount(blogs)[0]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  return orderAuthorsByLikeCount(blogs)[0]
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
