import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Database, Mail, Lock, User, KeyRound, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { loginUser, registerUser } from '../services/api'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginUser: setAuthUser } = useAuth()

  const from = location.state?.from?.pathname || '/generate'

  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'register') {
        const data = await registerUser(email, password, fullName)
        setAuthUser(data.user, data.access_token)
      } else {
        const data = await loginUser(email, password)
        setAuthUser(data.user, data.access_token)
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Decorative Glow Backdrop */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-red-600/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div class="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div class="text-center space-y-3">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Database class="w-3.5 h-3.5 text-red-500" />
            <span>Backblaze B2 Authenticated Studio</span>
          </div>

          <div class="flex items-center justify-center space-x-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-red-500 p-0.5 shadow-glow-indigo">
              <div class="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles class="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight gradient-text">GenMedia</h1>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {mode === 'login'
              ? 'Sign in to access your private Backblaze B2 Media Vault & AI Studio'
              : 'Create an account to start generating and storing assets on Backblaze B2'}
          </p>
        </div>

        {/* Auth Card Container */}
        <div class="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 bg-white/80 dark:bg-slate-900/80">
          
          {/* Sign In / Register Tabs */}
          <div class="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              class={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              class={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start space-x-2">
              <ShieldCheck class="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} class="space-y-4">
            {mode === 'register' && (
              <div class="space-y-1">
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <div class="relative">
                  <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Creator"
                    required
                    class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div class="relative">
                <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@genmedia.ai"
                  required
                  class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <div class="relative">
                <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  class="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Studio' : 'Create B2 Account'}</span>
                  <ArrowRight class="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Key Feature Callouts */}
          <div class="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
            <div class="flex items-center space-x-1.5">
              <Database class="w-3.5 h-3.5 text-red-500" />
              <span>B2 User Isolation</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <Cpu class="w-3.5 h-3.5 text-indigo-500" />
              <span>Genblaze AI Engine</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
