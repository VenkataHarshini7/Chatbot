import { gql, useSubscription, useMutation } from '@apollo/client'
import { useState } from 'react'

const GET_CHATS = gql`
  subscription {
    chats(order_by: { created_at: desc }) {
      id
      message
      created_at
    }
  }
`

const ADD_CHAT = gql`
  mutation AddChat($message: String!) {
    insert_chats_one(object: { message: $message }) {
      id
      message
      created_at
    }
  }
`

export default function Chat() {
  const { data, loading, error } = useSubscription(GET_CHATS)
  const [addChat] = useMutation(ADD_CHAT)
  const [message, setMessage] = useState('')

  const handleSend = async () => {
    if (!message.trim()) return
    await addChat({ variables: { message } })
    setMessage('')
  }

  if (loading) return <p>Loading chats...</p>
  if (error) return <p>Error loading chats: {error.message}</p>

  return (
    <div style={{ padding: 20 }}>
      <h2>Subspace Chatbot</h2>
      <div style={{ marginBottom: 20 }}>
        {data?.chats?.map((chat) => (
          <div key={chat.id}>
            <strong>{chat.id}</strong>: {chat.message}
          </div>
        ))}
      </div>
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={handleSend}>+</button>
      </div>
    </div>
  )
}
