const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('users api', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })

    const savedUser = await user.save()
    const blog = new Blog({
      title: 'Root user blog',
      author: 'Superuser',
      url: 'https://fullstackopen.com/',
      likes: 1,
      user: savedUser._id,
    })
    const savedBlog = await blog.save()

    savedUser.blogs = savedUser.blogs.concat(savedBlog._id)
    await savedUser.save()
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

  test('users include blogs added by them', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body[0].blogs.length, 1)
    assert.strictEqual(response.body[0].blogs[0].title, 'Root user blog')
  })
})

after(async () => {
  await mongoose.connection.close()
})
