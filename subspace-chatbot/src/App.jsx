import React, { useState } from 'react'
import { useAuthenticationStatus, useUserId } from '@nhost/react'
import Auth from './components/Auth'
import ChatList from './components/ChatList'
import ChatView from './components/ChatView'

export default function App() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const userId = useUserId()
  const [activeChatId, setActiveChatId] = useState(null)

  if (isLoading) return <div className="p-6">Loading...</div>

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">🚀 Subspace Chatbot</h1>
        <Auth />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚀 Subspace Chatbot</h1>
      <p className="mb-4">Welcome! You are logged in.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 border rounded p-3">
          <ChatList
            userId={userId}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onChatCreated={(id) => setActiveChatId(id)}
          />
        </div>

        <div className="md:col-span-2 border rounded p-3">
          {activeChatId ? (
            <ChatView chatId={activeChatId} userId={userId} />
          ) : (
            <div>Select a chat to start messaging.</div>
          )}
        </div>
      </div>
    </div>
  )
}
