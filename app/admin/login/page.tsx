'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Zap } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Đăng nhập thất bại')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('Không thể kết nối server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001829] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,191,255,0.08) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 shadow-2xl shadow-cyan-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-wide">FTC ADMIN</h1>
          <p className="text-cyan-400/70 mt-1 text-sm">Quản trị website câu lạc bộ</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="admin@ftc.club"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm tracking-wide hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang đăng nhập...</>
              ) : (
                <><Zap className="w-4 h-4" /> Đăng nhập</>  
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          FTC Website Admin Panel v2.0
        </p>
      </div>
    </div>
  )
}
