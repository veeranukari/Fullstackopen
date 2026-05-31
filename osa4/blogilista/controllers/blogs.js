const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request)

  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = new Blog({
    ...request.body,
    user: user.id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  const populatedBlog = await result.populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
    user,
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { returnDocument: 'after' })
    .populate('user', { username: 1, name: 1 })

  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)

  if (blog && blog.user) {
    await User.findByIdAndUpdate(blog.user, { $pull: { blogs: blog._id } })
  }

  response.status(204).end()
})

module.exports = blogsRouter
