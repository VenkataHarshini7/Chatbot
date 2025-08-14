import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_CHATS } from '../graphql/queries'
import { CREATE_CHAT } from '../graphql/mutations'

export default function ChatList({ currentChatId, onSelect }){
  const { data, loading, error, refetch } = useQuery(GET_CHATS, { fetchPolicy: 'cache-and-network' })
  const [createChat] = useMutation(CREATE_CHAT, { onCompleted: ()=>refetch() })

  async function handleNew(){
    const title = prompt('Chat title (optional)') || null
    await createChat({ variables: { title } })
  }

  if(loading) return <div className="p-4">Loading chats...</div>
  if(error) return <div className="p-4 text-red-600">Error loading chats</div>

  const chats = data?.chats ?? []
  return (
    <div className="border-r w-64 h-full flex flex-col">
      <div className="p-3 flex justify-between items-center border-b">
        <h2 className="font-semibold">Your Chats</h2>
        <button onClick={handleNew} className="text-sm px-2 py-1 bg-indigo-600 text-white rounded">New</button>
      </div>
      <div className="flex-1 overflow-auto">
        {chats.map(c => (
          <button key={c.id} onClick={()=>onSelect(c.id)}
            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${currentChatId===c.id?'bg-gray-100':''}`}>
            <div className="text-sm font-medium">{c.title || 'Untitled chat'}</div>
            <div className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</div>
          </button>
        ))}
        {chats.length===0 && <div className="p-3 text-sm text-gray-500">No chats yet</div>}
      </div>
    </div>
  )
}
