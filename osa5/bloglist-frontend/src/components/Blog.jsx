import styled from 'styled-components'

const BlogCard = styled.div`
  background: white;
  border: 1px solid #d9e2ec;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(31, 41, 51, 0.08);
  max-width: 680px;
  padding: 24px;
`

const Title = styled.h2`
  margin: 0 0 12px;
`

const Detail = styled.div`
  border-top: 1px solid #edf2f7;
  padding: 12px 0;
`

const MutedLabel = styled.span`
  color: #52606d;
  display: inline-block;
  font-weight: 700;
  min-width: 72px;
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
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

const DangerButton = styled(Button)`
  background: #c62828;

  &:hover {
    background: #8e1b1b;
  }
`

const Blog = ({ blog, updateBlog, removeBlog, loggedUser }) => {
  const userName = blog.user
    ? blog.user.name || blog.user.username
    : ''
  const showRemoveButton = loggedUser && blog.user?.username === loggedUser.username

  const handleLike = () => {
    updateBlog(blog)
  }

  const handleRemove = () => {
    removeBlog(blog)
  }

  return (
    <BlogCard className="blog">
      <Title>{blog.title}</Title>
      <Detail>
        <MutedLabel>author</MutedLabel>
        {blog.author}
      </Detail>
      <Detail>
        <MutedLabel>url</MutedLabel>
        {blog.url}
      </Detail>
      <Detail>
        <MutedLabel>likes</MutedLabel>
        {' '}
        {blog.likes}
      </Detail>
      <Detail>
        <MutedLabel>user</MutedLabel>
        {userName}
      </Detail>
      <Actions>
        {loggedUser && (
          <Button onClick={handleLike}>like</Button>
        )}
        {showRemoveButton && (
          <DangerButton onClick={handleRemove}>delete</DangerButton>
        )}
      </Actions>
    </BlogCard>
  )
}

export default Blog
