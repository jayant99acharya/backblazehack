import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useLocation as useRouteLocation } from 'react-router-dom'
import { Sparkles, Moon, Sun, Database, User, LogOut, KeyRound, Mail, Lock, UserPlus } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import { checkHealth, loginUser, registerUser } from '../services/api'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, loginUser: setAuthUser, logoutUser } = useAuth()
  const location = useRouteLocation()
  const [healthStatus, setHealthStatus] = useState('checking')
  
  // Auth modal states
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    let isMounted = true
    checkHealth()
      .then((data) => {
        if (isMounted) setHealthStatus(data.status === 'healthy' ? 'online' : 'degraded')
      })
      .catch(() => {
        if (isMounted) setHealthStatus('offline')
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      if (authMode === 'register') {
        const data = await registerUser(email, password, fullName)
        setAuthUser(data.user, data.access_token)
      } else {
        const data = await loginUser(email, password)
        setAuthUser(data.user, data.access_token)
      }
      setShowAuthModal(false)
      setEmail('')
      setPassword('')
      setFullName('')
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/generate', label: 'Studio' },
    { path: '/gallery', label: 'Vault Gallery' },
  ]

  return (
    <header class="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <RouterLink to="/" class="flex items-center space-x-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-red-500 p-0.5 shadow-glow-indigo transition-transform group-hover:scale-105">
            <div class="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sparkles class="w-5 h-5 text-indigo-400 group-hover:text-pink-400 transition-colors" />
            </div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-extrabold text-lg tracking-tight gradient-text">GenMedia</span>
              <span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-600/20 text-red-500 border border-red-500/30 uppercase tracking-wider flex items-center gap-1">
                <Database class="w-2.5 h-2.5" /> B2
              </span>
            </div>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Genblaze Orchestrated</p>
          </div>
        </RouterLink>

        {/* Navigation Links */}
        <nav class="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <RouterLink
                key={link.path}
                to={link.path}
                class={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </RouterLink>
            )
          })}
        </nav>

        {/* Action Controls & User Account */}
        <div class="flex items-center space-x-3">
          
          {/* Health Status Indicator */}
          <div
            title={`Backend status: ${healthStatus}`}
            class="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80"
          >
            <span
              class={`w-2 h-2 rounded-full ${
                healthStatus === 'online'
                  ? 'bg-emerald-500 animate-pulse'
                  : healthStatus === 'degraded'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
            <span class="text-slate-600 dark:text-slate-300 capitalize font-medium text-[11px]">
              API {healthStatus}
            </span>
          </div>

          {/* User Account Controls */}
          {user ? (
            <div class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[11px] font-bold">
                {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
                {user.full_name || user.email}
              </span>
              <button
                onClick={logoutUser}
                title="Log Out"
                class="text-slate-400 hover:text-red-500 transition-colors ml-1"
              >
                <LogOut class="w-4 h-4" />
              </button>
            </div>
          ) : (
            <RouterLink
              to="/login"
              class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center space-x-1.5"
            >
              <User class="w-3.5 h-3.5" />
              <span>Sign In</span>
            </RouterLink>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark/Light Mode"
            class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {theme === 'dark' ? (
              <Sun class="w-5 h-5 text-amber-400" />
            ) : (
              <Moon class="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

      </div>

      {/* User Login & Registration Modal */}
      {showAuthModal && (
        <div class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative bg-white dark:bg-slate-900">
            <button
              onClick={() => setShowAuthModal(false)}
              class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              ✕
            </button>

            <div class="text-center space-y-1">
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mx-auto flex items-center justify-center mb-2">
                <KeyRound class="w-6 h-6" />
              </div>
              <h3 class="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                {authMode === 'login' ? 'Welcome Back' : 'Create B2 Account'}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {authMode === 'login'
                  ? 'Sign in to access your isolated Backblaze B2 assets'
                  : 'Register your account — user profile saved to B2'}
              </p>
            </div>

            {authError && (
              <div class="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} class="space-y-4">
              {authMode === 'register' && (
                <div class="space-y-1">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <div class="relative">
                    <User class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Creator"
                      required
                      class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <div class="relative">
                  <Mail class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@genmedia.ai"
                    required
                    class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                <div class="relative">
                  <Lock class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                class="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {authLoading ? (
                  <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : authMode === 'login' ? (
                  <span>Sign In to Account</span>
                ) : (
                  <span>Create B2 Account</span>
                )}
              </button>
            </form>

            <div class="text-center text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('register'); setAuthError(null); }}
                    class="text-indigo-500 font-bold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(null); }}
                    class="text-indigo-500 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>
      )}

    </header>
  )
}
