import { useState, useEffect } from 'react'
import { messagesRef, pushMessage } from '../firebase'
import Message from './Message'

const App = () => {
  const [data, setData] = useState({ name: 'default', text: 'text' })
  const [messages, setMessages] = useState([])

  const setNameFunc = (e) => {
    setData((prevData) => ({ ...prevData, name: e.target.value }))
  }

  const setTextFunc = (e) => {
    setData((prevData) => ({ ...prevData, text: e.target.value }))
  }

  const pushMessageToFirebase = () => {
    pushMessage({ ...data })
  }

  const setMessageFunc = (newMessage) => {
    setMessages((prevNewMessages) => (prevNewMessages = [...newMessage]))
  }

  useEffect(() => {
    messagesRef
      .orderByKey()
      .limitToLast(3)
      .on('value', (snapshot) => {
        const messages = snapshot.val()
        if (!messages) return
        const entries = Object.entries(messages)
        const newMessage = entries.map((data) => {
          const [key, message] = data
          return { key, ...message }
        })
        setMessageFunc(newMessage)
      })
  }, [])

  return (
    <>
      {messages.map((message) => (
        <Message key={message.key} message={message} />
      ))}
      <input type="text" value={data.name} onChange={(e) => setNameFunc(e)} />
      <input type="text" value={data.text} onChange={(e) => setTextFunc(e)} />
      <button onClick={() => pushMessageToFirebase()}>push</button>
    </>
  )
}

export default App