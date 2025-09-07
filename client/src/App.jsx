import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Dashboard from './components/Dashboard/Dashboard'

export const AuthContext = createContext()

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.id, username: payload.username })
        localStorage.setItem('token', token)
      } catch (error) {
        setUser(null)
        localStorage.removeItem('token')
      }
    } else {
      setUser(null)
      localStorage.removeItem('token')
    }
  }, [token])

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }
  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }} >
      {!token ? <AuthSwitcher /> : <Dashboard />}
    </AuthContext.Provider>
  )
}

const AuthSwitcher = () => {
  const [isLogin, setIsLogin] = useState(true)
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-400 p-4'>
      {isLogin ? (
        <Login switchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}

export default App