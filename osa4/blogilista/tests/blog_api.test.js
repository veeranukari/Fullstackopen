const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const loginAsRoot = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret',
    })

  return response.body.token
}

describe('blogs api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })

    const savedUser = await user.save()
    const blogs = initialBlogs.map((blog) => ({
      ...blog,
      user: savedUser._id,
    }))
    const savedBlogs = await Blog.insertMany(blogs)

    savedUser.blogs = savedBlogs.map((blog) => blog._id)
    await savedUser.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a unique identifier property of the blog is named id', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  test('blogs include information about the user who added them', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body[0].user.username, 'root')
    assert.strictEqual(response.body[0].user.name, 'Superuser')
  })

  test('a valid blog can be added', async () => {
    const token = await loginAsRoot()
    const newBlog = {
      title: 'Async await cleans up promise code',
      author: 'Test Writer',
      url: 'https://fullstackopen.com/',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('Async await cleans up promise code'))
    assert(response.body.find((blog) => blog.title === newBlog.title).user)
  })

  test('adding a blog fails with status 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No token, no blog',
      author: 'Test Writer',
      url: 'https://fullstackopen.com/',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')
    const titles = response.body.map((blog) => blog.title)

    assert.strictEqual(response.body.length, initialBlogs.length)
    assert(!titles.includes(newBlog.title))
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const titles = blogsAtEnd.body.map((blog) => blog.title)

    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
    assert(!titles.includes(blogToDelete.title))
  })
})

after(async () => {
  await mongoose.connection.close()
})
