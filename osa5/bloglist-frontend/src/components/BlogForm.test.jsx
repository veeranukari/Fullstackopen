import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Testing React forms')
  await user.type(screen.getByLabelText('author'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('url'), 'https://example.com/testing-react-forms')
  await user.click(screen.getByText('create'))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing React forms',
    author: 'Ada Lovelace',
    url: 'https://example.com/testing-react-forms'
  })
})
