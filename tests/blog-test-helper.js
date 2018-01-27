const Blog = require('../models/blog')
const formatBlog = require('../utils/blog-format')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'The paternity of an Index',
    author: 'Albert O. Hirschman',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Paternity_of_an_Index.pdf',
    likes: 4,
  },
  {
    title: 'The Elements Of Style: UNIX As Literature',
    author: 'Thomas Scoville',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Unix_as_Literature',
    likes: 2,
  }
]

const nonExistingBlogId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const validBlogId = async () => {
  const blogs = await Blog.find()
  return blogs[0]._id
}

const blogById = async (id) => {
  const blog = await Blog.findById(id)
  return formatBlog(blog)
}

const blogsInDb = async () => {
  const blogs = await Blog.find()
  return blogs.map(formatBlog)
}

const getExistingBlog = async () => {
  const blogs = await Blog.find()
  return blogs[0]
}

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingBlogId,
  validBlogId,
  blogById,
  getExistingBlog
}
