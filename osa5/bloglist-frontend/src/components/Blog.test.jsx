import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'https://fullstackopen.com/',
  likes: 7,
  user: {
    username: 'mluukkai',
    name: 'Matti Luukkainen'
  }
}

test('renders blog details and likes for anonymous user without buttons', () => {
  const { container } = render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      loggedUser={null}
    />
  )

  expect(container).toHaveTextContent(blog.title)
  expect(container).toHaveTextContent(blog.author)
  expect(container).toHaveTextContent(blog.url)
  expect(container).toHaveTextContent(`likes ${blog.likes}`)
  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument()
})

test('renders only like button for logged in user who did not create the blog', () => {
  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      loggedUser={{ username: 'hellas', name: 'Arto Hellas' }}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument()
})

test('renders delete button for the user who created the blog', () => {
  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      loggedUser={{ username: 'mluukkai', name: 'Matti Luukkainen' }}
    />
  )

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
})
