import React, { useState } from 'react'
import { gql, useMutation, useSubscription } from '@apollo/client'

const MESSAGES_SUB = gql`
  subscription Messages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      role
      content
      created_at
    }
  }
`

const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $userId: uuid!, $content: String!) {
    insert_messages_one(object: {
      chat_id: $chatId,
      user_id: $userId,
      role: "user",
      content: $content
    }) {
      id
    }
  }
`

export default function ChatView({ chatId, userId }) {
  const [text, setText] = useState('')

  const { data, loading } = useSubscription(MESSAGES_SUB, {
    variables: { chatId }
  })

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => setText('')
  })

  const handleSend = async () => {
    if (!text.trim()) return
    await sendMessage({
      variables: { chatId, userId, content: text.trim() }
    })
  }

  const messages = data?.messages ?? []

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 border rounded p-3">
        {loading && <div>Loading messages…</div>}
        {!loading && messages.length === 0 && (
          <div className="text-sm text-gray-500">No messages yet. Say hello!</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded px-3 py-2 max-w-[80%] ${m.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
            title={new Date(m.created_at).toLocaleString()}
          >
            <div className="text-xs text-gray-500 mb-1">{m.role}</div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Type a message and press Enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  )
}
