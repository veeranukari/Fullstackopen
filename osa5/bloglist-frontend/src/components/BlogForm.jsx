import { useState } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  display: grid;
  gap: 16px;
`

const Field = styled.div`
  display: grid;
  gap: 6px;

  label {
    font-weight: 700;
  }

  input {
    border: 1px solid #bcccdc;
    border-radius: 4px;
    font-size: 1rem;
    padding: 10px 12px;
  }

  input:focus {
    border-color: #1565c0;
    outline: 2px solid rgba(21, 101, 192, 0.16);
  }
`

const Button = styled.button`
  border: 0;
  border-radius: 4px;
  background: #1565c0;
  color: white;
  cursor: pointer;
  font-weight: 700;
  padding: 10px 16px;

  &:hover {
    background: #0d47a1;
  }
`

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Form onSubmit={addBlog}>
      <Field>
        <label htmlFor="title">title</label>
        <input
          id="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </Field>
      <Field>
        <label htmlFor="author">author</label>
        <input
          id="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </Field>
      <Field>
        <label htmlFor="url">url</label>
        <input
          id="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </Field>
      <div>
        <Button type="submit">create</Button>
      </div>
    </Form>
  )
}

export default BlogForm
