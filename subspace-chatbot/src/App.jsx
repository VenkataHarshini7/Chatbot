import React, { useEffect, useState } from 'react'
import Auth from './components/Auth'
import ChatList from './components/ChatList'
import ChatView from './components/ChatView'
import { nhost } from './nhostClient'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './hasuraClient'

export default function App(){
  const [ready, setReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [chatId, setChatId] = useState(null)

  useEffect(() => {
    const unsub = nhost.auth.onAuthStateChanged((_event, session) => {
      setIsAuthenticated(!!session)
    })
    setIsAuthenticated(!!nhost.auth.getSession())
    setReady(true)
    return () => unsub?.subscription?.unsubscribe?.()
  }, [])

  if(!ready) return <div className="p-6">Loading…</div>

  if(!isAuthenticated){
    return <Auth onAuth={()=>setIsAuthenticated(true)} />
  }

  return (
    <ApolloProvider client={apolloClient}>
      <div className="h-screen flex">
        <ChatList currentChatId={chatId} onSelect={setChatId} />
        {chatId ? <ChatView chatId={chatId} /> : (
          <div className="flex-1 grid place-items-center text-gray-500">Select or create a chat</div>
        )}
      </div>
    </ApolloProvider>
  )
}
