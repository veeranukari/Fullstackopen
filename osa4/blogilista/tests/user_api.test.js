const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('users api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })

    await user.save()
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid user can be added', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    const usernames = usersAtEnd.body.map((user) => user.username)

    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1)
    assert(usernames.includes(newUser.username))
    assert.strictEqual(response.body.passwordHash, undefined)
    assert.strictEqual(response.body.password, undefined)
  })

  test('password hashes are not returned', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body[0].passwordHash, undefined)
  })
})

after(async () => {
  await mongoose.connection.close()
})
