import { useState, useEffect, useCallback } from 'react'
import { messagesRef, pushMessage } from '../firebase'

const useHooks = () => {
  const [data, setData] = useState({ name: 'default', text: 'text' })
  const [messages, setMessages] = useState([])

  const setNameFunc = useCallback(
    (e) => {
      setData((prevData) => ({ ...prevData, name: e.target.value }))
    },
    [setData]
  )

  const setTextFunc = useCallback(
    (e) => {
      setData((prevData) => ({ ...prevData, text: e.target.value }))
    },
    [setData]
  )

  const pushMessageToFirebase = useCallback(() => {
    pushMessage({ ...data })
  }, [data])

  const setMessageFunc = useCallback((newMessage) => {
    setMessages((prevNewMessages) => (prevNewMessages = [...newMessage]))
  }, [])

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
  }, [setMessageFunc])

  return { setNameFunc, setTextFunc, pushMessageToFirebase, messages, data }
}

export default useHooks