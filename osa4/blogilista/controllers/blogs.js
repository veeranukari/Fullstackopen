const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({})

  if (!user) {
    return response.status(400).json({ error: 'user missing' })
  }

  const blog = new Blog({
    ...request.body,
    user: user.id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)

  if (blog && blog.user) {
    await User.findByIdAndUpdate(blog.user, { $pull: { blogs: blog._id } })
  }

  response.status(204).end()
})

module.exports = blogsRouter
