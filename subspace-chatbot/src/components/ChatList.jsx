import React, { useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'

const GET_CHATS = gql`
  query GetChats($userId: uuid!) {
    chats(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }) {
      id
      title
      created_at
    }
  }
`

const CREATE_CHAT = gql`
  mutation CreateChat($userId: uuid!, $title: String!) {
    insert_chats_one(object: { user_id: $userId, title: $title }) {
      id
      title
      created_at
    }
  }
`

export default function ChatList({ userId, activeChatId, onSelectChat, onChatCreated }) {
  const [title, setTitle] = useState('')
  const { data, loading, error, refetch } = useQuery(GET_CHATS, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  })

  const [createChat, { loading: creating }] = useMutation(CREATE_CHAT, {
    onCompleted: (res) => {
      const id = res?.insert_chats_one?.id
      if (id) {
        onChatCreated?.(id)
        refetch()
        setTitle('')
      }
    }
  })

  const handleCreate = async () => {
    if (!title.trim()) return
    await createChat({ variables: { userId, title: title.trim() } })
  }

  if (loading) return <div>Loading chats...</div>
  if (error) return <div className="text-red-600">Error loading chats</div>

  const chats = data?.chats ?? []

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Chats</h2>

      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="New chat title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          className="bg-blue-600 text-white rounded px-3 py-1"
          onClick={handleCreate}
          disabled={creating}
          title="Create chat"
        >
          +
        </button>
      </div>

      <ul className="space-y-1">
        {chats.map((c) => (
          <li
            key={c.id}
            onClick={() => onSelectChat(c.id)}
            className={`cursor-pointer rounded px-2 py-1 ${activeChatId === c.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`}
          >
            {c.title || 'Untitled'}
          </li>
        ))}
        {chats.length === 0 && <li className="text-sm text-gray-500">No chats yet</li>}
      </ul>
    </div>
  )
}
