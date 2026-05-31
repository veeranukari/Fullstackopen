import { useState, useEffect } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const Page = styled.div`
  min-height: 100vh;
  background: #f6f7f9;
  color: #1f2933;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`

const Container = styled.main`
  width: min(920px, calc(100% - 32px));
  margin: 0 auto;
  padding: 28px 0 48px;
`

const Navigation = styled.nav`
  background: #263238;
  color: white;
  box-shadow: 0 2px 10px rgba(31, 41, 51, 0.16);
`

const NavInner = styled.div`
  width: min(920px, calc(100% - 32px));
  min-height: 56px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`

const NavLink = styled(Link)`
  color: white;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const UserStatus = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

const Button = styled.button`
  border: 0;
  border-radius: 4px;
  background: #1565c0;
  color: white;
  cursor: pointer;
  font-weight: 700;
  padding: 8px 14px;

  &:hover {
    background: #0d47a1;
  }
`

const FormPanel = styled.div`
  max-width: 480px;
  background: white;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(31, 41, 51, 0.08);
`

const StyledForm = styled.form`
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

const BlogListGrid = styled.div`
  display: grid;
  gap: 10px;
`

const BlogListItem = styled.div`
  background: white;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  padding: 14px 16px;

  a {
    color: #1565c0;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => (
  <FormPanel>
    <h2>Log in to application</h2>
    <StyledForm onSubmit={handleLogin}>
      <Field>
        <label htmlFor="username">username</label>
        <input
          id="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </Field>
      <Field>
        <label htmlFor="password">password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </Field>
      <div>
        <Button type="submit">login</Button>
      </div>
    </StyledForm>
  </FormPanel>
)

const BlogList = ({ blogs }) => (
  <div>
    <h2>blogs</h2>
    <BlogListGrid>
      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <BlogListItem className="blog" key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
          </Link>
        </BlogListItem>
      )}
    </BlogListGrid>
  </div>
)

const BlogView = ({ blogs, updateBlog, removeBlog, loggedUser }) => {
  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return null
  }

  return (
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
      loggedUser={loggedUser}
    />
  )
}

const CreateBlogView = ({ createBlog, user }) => {
  if (!user) {
    return <Navigate replace to="/login" />
  }

  return (
    <FormPanel>
      <h2>create new</h2>
      <BlogForm createBlog={createBlog} />
    </FormPanel>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  const showNotification = message => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      showNotification('wrong username/password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const createBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      navigate('/')
    } catch {
      showNotification('creating blog failed')
    }
  }

  const updateBlog = async blog => {
    const user = blog.user
      ? blog.user.id || blog.user._id || blog.user
      : undefined

    const blogObject = {
      user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    const returnedBlog = await blogService.update(blog.id, blogObject)
    setBlogs(blogs.map(item => item.id !== blog.id ? item : returnedBlog))
  }

  const removeBlog = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(item => item.id !== blog.id))
      navigate('/')
    }
  }

  return (
    <Page>
      <Navigation>
        <NavInner>
          <NavLink to="/">blogs</NavLink>
        {user && (
          <>
              <NavLink to="/create">create new</NavLink>
          </>
        )}
        {!user && (
            <NavLink to="/login">login</NavLink>
        )}
        {user && (
            <UserStatus>
            {user.name} logged in
              <Button onClick={handleLogout}>logout</Button>
            </UserStatus>
        )}
        </NavInner>
      </Navigation>

      <Container>
        <Notification message={notification} />

        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/login"
            element={
              user
                ? <Navigate replace to="/" />
                : (
                  <LoginForm
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                  />
                )
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <BlogView
                blogs={blogs}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
                loggedUser={user}
              />
            }
          />
          <Route
            path="/create"
            element={<CreateBlogView createBlog={createBlog} user={user} />}
          />
        </Routes>
      </Container>
    </Page>
  )
}

export default App
