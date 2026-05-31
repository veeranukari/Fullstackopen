import styled from 'styled-components'

const Message = styled.div`
  background: #e3fcef;
  border: 1px solid #57ae5b;
  border-left: 6px solid #2f8132;
  border-radius: 6px;
  color: #1b5e20;
  font-weight: 700;
  margin-bottom: 20px;
  padding: 12px 16px;
`

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Message>
      {message}
    </Message>
  )
}

export default Notification
