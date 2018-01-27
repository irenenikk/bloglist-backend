const blogsRouter = require('express').Router()
const formatBlog = require('../utils/blog-format')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const validateBlog = (blog) => {
  let errors = []
  if (!blog.title) {
    errors.push('Blog must have a title')
  }
  if (!blog.url) {
    errors.push('Blog must have an url')
  }
  return errors
}

const saveBlogToUser = async (blog, user) => {
  user.blogs = user.blogs.concat(blog)
  await user.save()
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find().populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.token) {
    return response.status(401).send('Missing token')
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).send('Invalid token')
  }
  try {
    const blog = request.body
    const errors = validateBlog(blog)
    if (errors.length > 0) {
      return response.status(400).send(errors.join('\n'))
    }
    const user = await User.findById(decodedToken.id)
    const blogObj = await
      new Blog({
        ...blog,
        likes: (blog.likes? blog.likes : 0),
        user: user._id
      })
        .save()
    saveBlogToUser(blogObj, user)
    response.json(formatBlog(blogObj))
  } catch (e) {
    response.status(400).send('Could not create blog')
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).send('Invalid or missing token')
  }
  try {
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (blog.user && decodedToken.id !== blog.user.toString()) {
      return response.status(401).send('You can only delete blogs created by you.')
    }
    await blog.remove()
    response.json(blog)
  } catch (e) {
    response.status(400).send('Could not remove blog')
  }
})

blogsRouter.put('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).send('Missing token')
  }
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response.status(401).send('Invalid token')
  }
  try {
    const newBlog = request.body
    const errors = validateBlog(newBlog)
    if (errors.length > 0) {
      return response.status(400).send(errors.join('\n'))
    }
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (blog.user && decodedToken.id !== blog.user.toString()) {
      return response.status(401).send('You can only update blogs created by you.')
    }
    await Blog.findByIdAndUpdate(id, newBlog)
    const updatedBlog = await Blog.findById(id)
    response.status(201).json(updatedBlog)
  } catch (e) {
    response.status(400).send('Could not update blog: ' + e)
  }
})

module.exports = blogsRouter
