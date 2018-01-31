const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const {
  initialUsers,
  usersInDatabase
} = require('./user-test-helper')
const formatUser = require('../utils/user-format')

const baseUrl = '/api/users'

beforeAll(async () => {
  await User.remove()

  const users = initialUsers.map(u => new User(u))
  const promises = users.map(u => u.save())
  await Promise.all(promises)
})

describe('when some users have been added to the database', () => {

  test('GET to root returns all users in database in JSON', async () => {
    const usersInDb = await usersInDatabase()
    const response = await api
      .get(baseUrl)
      .expect('Content-Type', /application\/json/)
    const usersInResponse = response.body.map(formatUser)
    usersInDb.forEach(u => expect(usersInResponse).toContainEqual(u))
  })

  describe('when adding a new user', () => {

    test('a valid user is created in database', async () => {
      const usersInDbBeforeOp = await usersInDatabase()
      const newUser = {
        username: '__LolFan__',
        name: 'Lol of Lollero',
        adult: true,
        password: 'lolOfTheRings1'
      }

      const response = await api
        .post(baseUrl)
        .send(newUser)
        .expect(200)

      const usersInDbAfterOp = await usersInDatabase()
      expect(usersInDbAfterOp.length).toBe(usersInDbBeforeOp.length + 1)
      expect(usersInDbAfterOp).toContainEqual(formatUser(response.body))
    })

    test('a user with too short a username is not saved and returns error message', async () => {
      const newUser = {
        username: 'lo',
        name: 'Lolleler',
        adult: false,
        password: 'lolOfTheRings1'
      }
      const usersInDbBeforeOp = await usersInDatabase()
      const response = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
      const usersInDbAfterOp = await usersInDatabase()

      expect(usersInDbAfterOp.length).toBe(usersInDbBeforeOp.length)
      expect(response.error.text).toContain('must be at least')
      expect(usersInDbAfterOp).not.toContainEqual(formatUser(response.body))
    })


    test('a user with too short a password is not saved and returns error message', async () => {
      const newUser = {
        username: 'assistantLolleler',
        name: 'Lolleler',
        adult: false,
        password: 'lo'
      }
      const usersInDbBeforeOp = await usersInDatabase()
      const response = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
      const usersInDbAfterOp = await usersInDatabase()

      expect(usersInDbAfterOp.length).toBe(usersInDbBeforeOp.length)
      expect(usersInDbAfterOp).not.toContainEqual(formatUser(response.body))
      expect(response.error.text).toContain('must be at least')
    })

  })

})


afterAll(() => {
  server.close()
})
