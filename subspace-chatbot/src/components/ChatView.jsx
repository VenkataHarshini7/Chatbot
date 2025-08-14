import React, { useEffect, useRef, useState } from 'react'
import { useSubscription, useMutation } from '@apollo/client'
import { GET_MESSAGES_SUB } from '../graphql/queries'
import { INSERT_MESSAGE, CALL_SEND_MESSAGE_ACTION } from '../graphql/mutations'

export default function ChatView({ chatId }){
  const { data, loading } = useSubscription(GET_MESSAGES_SUB, { variables: { chat_id: chatId } })
  const [insertMessage] = useMutation(INSERT_MESSAGE)
  const [callAction] = useMutation(CALL_SEND_MESSAGE_ACTION)
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [data])

  async function send(){
    if(!text.trim()) return
    const res = await insertMessage({ variables: { chat_id: chatId, content: text.trim(), role: 'user' } })
    const messageId = res.data.insert_messages_one.id
    setText('')
    await callAction({ variables: { input: { chat_id: chatId, message_id: messageId } } })
  }

  const messages = data?.messages ?? []

  return (
    <div className="flex-1 h-full flex flex-col">
      <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
        {loading && <div>Loading messages…</div>}
        {messages.map(m => (
          <div key={m.id} className={`max-w-prose ${m.role==='user'?'ml-auto text-right':''}`}>
            <div className={`inline-block px-3 py-2 rounded-2xl ${m.role==='user'?'bg-indigo-600 text-white':'bg-gray-100'}`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" placeholder="Type your message…" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} />
        <button onClick={send} className="px-4 py-2 rounded bg-indigo-600 text-white">Send</button>
      </div>
    </div>
  )
}
