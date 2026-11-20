import React, { useState } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './admin-auth.css'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/user/admin-login`, { email, password })
      if (!response.data.success) throw new Error(response.data.message || 'Login failed')
      onLogin(response.data.token)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }
  return <main className='admin-login-page'><form className='admin-login-card' onSubmit={submit}><span>MEALMATE ADMINISTRATION</span><h1>Welcome back</h1><p>Sign in to manage food, orders, and store operations.</p><label htmlFor='admin-email'>Admin email</label><input id='admin-email' type='email' value={email} onChange={e => setEmail(e.target.value)} autoComplete='username' required/><label htmlFor='admin-password'>Password</label><input id='admin-password' type='password' value={password} onChange={e => setPassword(e.target.value)} autoComplete='current-password' required/><button disabled={loading}>{loading ? 'Signing in…' : 'Sign in securely'}</button></form></main>
}

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('mealmate_admin_token') || '')
  if (token) axios.defaults.headers.common.token = token
  else delete axios.defaults.headers.common.token
  const login = (value) => { localStorage.setItem('mealmate_admin_token', value); setToken(value) }
  const logout = () => { localStorage.removeItem('mealmate_admin_token'); setToken('') }
  return <div className='app'><ToastContainer />{!token ? <AdminLogin onLogin={login}/> : <><Navbar onLogout={logout}/><hr/><div className='app-content'><Sidebar/><Routes><Route path='/' element={<Orders/>}/><Route path='/add' element={<Add/>}/><Route path='/list' element={<List/>}/><Route path='/orders' element={<Orders/>}/></Routes></div></>}</div>
}
export default App
