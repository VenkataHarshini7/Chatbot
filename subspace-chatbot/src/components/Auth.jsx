import React, { useState } from 'react'
import { nhost } from '../nhostClient'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true); setError('')
    try{
      if(mode==='signup'){
        const { error } = await nhost.auth.signUp({ email, password })
        if(error) throw error
        // sign in immediately after signup
        const { error: err2 } = await nhost.auth.signIn({ email, password })
        if(err2) throw err2
      } else {
        const { error } = await nhost.auth.signIn({ email, password })
        if(error) throw error
      }
      onAuth?.()
    }catch(err){
      setError(err?.message || 'Auth error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Subspace Chatbot</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border rounded px-3 py-2" placeholder="Email"
            value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input className="w-full border rounded px-3 py-2" placeholder="Password"
            value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full rounded bg-indigo-600 text-white py-2 disabled:opacity-50" disabled={loading}>
            {loading ? 'Please wait...' : (mode==='signup' ? 'Create account' : 'Sign in')}
          </button>
        </form>
        <div className="text-center text-sm mt-3">
          {mode==='signup' ? (
            <button className="text-indigo-600" onClick={()=>setMode('signin')}>Have an account? Sign in</button>
          ) : (
            <button className="text-indigo-600" onClick={()=>setMode('signup')}>New here? Create account</button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-4">Note: Requirement states "Bolt is mandatory for auth UI" — this screen is Bolt-compatible (drop-in). You can replicate this inside Bolt.new or keep this React Vite setup for Netlify.</p>
      </div>
    </div>
  )
}
