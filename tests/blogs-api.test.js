const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const  formatBlog = require('../utils/blog-format')
const {
  initialBlogs,
  blogsInDb,
  nonExistingBlogId,
  getExistingBlog
} = require('./blog-test-helper')
const baseUrl = '/api/blogs'

beforeAll(async () => {
  await Blog.remove()

  const blogs = initialBlogs.map(b => new Blog(b))
  const promises = blogs.map(b => b.save())
  await Promise.all(promises)
})

describe('when some blogs have already been added to the database', () => {

  test('blogs are returned in json', async () => {
    await api
      .get(baseUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all initial blogs are returned in root url', async () => {
    const blogsInDatabase = await blogsInDb()
    const response = await api.get(baseUrl)
    const content = response.body
      .map(formatBlog)
    blogsInDatabase.forEach(b => expect(content).toContainEqual(b))
  })

  describe('when adding a new blog', () => {

    test('if it\'s valid it is added', async () => {
      const blogsInDatabase = await blogsInDb()
      const newBlog =   {
        title: 'The Rise of \'Worse is Better\'\'',
        author: 'Richard Gabriel',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Worse_is_Better',
        likes: 3,
      }
      await api
        .post(baseUrl)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const blogsInDatabaseAfterOp = await blogsInDb()
      expect(blogsInDatabaseAfterOp.length).toBe(blogsInDatabase.length + 1)
      expect(blogsInDatabaseAfterOp).toContainEqual(newBlog)
    })

    test('if it\'s likes is empty it is set to zero', async () => {
      const newBlogWithoutLikes =   {
        title: 'The Rise of Lollero',
        author: 'Lollero Lolled',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/lollero.html',
      }
      await api
        .post(baseUrl)
        .send(newBlogWithoutLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      await api.get(baseUrl)
      const blogsInDatabase = await blogsInDb()
      newBlogWithoutLikes.likes = 0
      expect(blogsInDatabase).toContainEqual(newBlogWithoutLikes)
    })

    test('it is not saved without a title and an url and api returns 400 with error messages', async () => {
      const newBlogWithoutTitleOrUrl = {
        author: 'Lollero von Lollerson'
      }
      const response = await api
        .post(baseUrl)
        .send(newBlogWithoutTitleOrUrl)
      expect(response.status).toBe(400)
      expect(response.error.text).toContain('title')
      expect(response.error.text).toContain('url')
    })
  })

  describe('when deleting a blog', () => {

    test('removes a blog by valid id from database and returns removed blog if creator logged in', async () => {
      const blog = await getExistingBlog()
      const blogsBeforeOp = await blogsInDb()

      const response = await api
        .delete(`${baseUrl}/${blog._id}`)
      const blogsAfterOp = await blogsInDb()

      expect(formatBlog(response.body)).toEqual(formatBlog(blog))
      expect(blogsAfterOp.length).toBe(blogsBeforeOp.length - 1)
      expect(blogsAfterOp).not.toContain(blog)
    })

    test('returns 400 and error message if called with a non valid id', async () => {
      const id = await nonExistingBlogId()
      const response = await api
        .delete(`${baseUrl}/${id}`)
      expect(response.status).toBe(400)
      expect(response.error.text).toContain('Could not remove')
    })

  })

  describe('updating a blog', () => {

    test('is saved to database with valid updates', async () => {
      const blog = await getExistingBlog()
      blog.likes = blog.likes + 1
      const response = await api
        .put(`${baseUrl}/${blog._id}`)
        .send(blog)
      expect(response.status).toBe(201)
      expect(formatBlog(response.body)).toEqual(formatBlog(blog))
    })

  })
})

afterAll(() => {
  server.close()
})
