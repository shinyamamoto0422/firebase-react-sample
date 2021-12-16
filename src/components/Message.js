import { memo } from 'react'

const Message = memo(({ message }) => {
  return (
    <div>
      {message.name}:{message.text}
    </div>
  )
})

export default Message