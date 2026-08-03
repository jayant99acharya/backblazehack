import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('genmedia_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => {
    return localStorage.getItem('genmedia_token') || null
  })

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('genmedia_user', JSON.stringify(user))
      localStorage.setItem('genmedia_token', token)
    } else {
      localStorage.removeItem('genmedia_user')
      localStorage.removeItem('genmedia_token')
    }
  }, [user, token])

  const loginUser = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
  }

  const logoutUser = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}
