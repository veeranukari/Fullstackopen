import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, loggedUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const userName = blog.user
    ? blog.user.name || blog.user.username
    : ''
  const showRemoveButton = blog.user?.username === loggedUser.username

  const handleLike = () => {
    updateBlog(blog)
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  if (!visible) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)}>view</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(false)}>hide</button>
      </div>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        <button onClick={handleLike}>like</button>
      </div>
      <div>{userName}</div>
      {showRemoveButton && (
        <button onClick={handleRemove}>delete</button>
      )}
    </div>
  )
}

export default Blog
