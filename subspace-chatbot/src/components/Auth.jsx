import React, { useState } from 'react'
import { nhost } from '../nhostClient'
import { useAuthenticationStatus } from '@nhost/react'

export default function Auth() {
  const { isAuthenticated } = useAuthenticationStatus()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const signIn = async () => {
    setBusy(true)
    setError('')
    const { error } = await nhost.auth.signIn({ email, password })
    if (error) setError(error.message || 'Sign-in failed')
    setBusy(false)
  }

  const signUp = async () => {
    setBusy(true)
    setError('')
    const { error } = await nhost.auth.signUp({ email, password })
    if (error) setError(error.message || 'Sign-up failed')
    setBusy(false)
  }

  const signOut = async () => {
    await nhost.auth.signOut()
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={signOut}
        className="bg-gray-200 rounded px-3 py-1"
      >
        Sign out
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        <input
          className="border rounded px-3 py-2"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-2">
        <button
          onClick={signIn}
          disabled={busy}
          className="bg-blue-600 text-white rounded px-3 py-1"
        >
          Sign in
        </button>
        <button
          onClick={signUp}
          disabled={busy}
          className="bg-green-600 text-white rounded px-3 py-1"
        >
          Sign up
        </button>
      </div>
    </div>
  )
}
