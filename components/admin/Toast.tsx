/**
 * Toast — Thông báo nhỏ góc màn hình
 *
 * Dùng:
 *   import { useToast, Toaster } from '@/components/admin/Toast'
 *   const toast = useToast()
 *   toast.success('Đã lưu!')
 *   toast.error('Có lỗi xảy ra')
 *
 *   // Thêm <Toaster /> vào layout admin một lần duy nhất
 */
'use client'

import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}_${Math.random()}`
    setToasts(prev => [...prev, { id, type, message }])
    // Tự xoá sau 3.5s
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const ctx: ToastContextValue = {
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast container — fixed góc phải dưới */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

const STYLES: Record<ToastType, { bg: string; border: string; icon: typeof CheckCircle; iconClass: string }> = {
  success: {
    bg: 'bg-[#001829]',
    border: 'border-green-500/40',
    icon: CheckCircle,
    iconClass: 'text-green-400',
  },
  error: {
    bg: 'bg-[#001829]',
    border: 'border-red-500/40',
    icon: XCircle,
    iconClass: 'text-red-400',
  },
  info: {
    bg: 'bg-[#001829]',
    border: 'border-cyan-500/40',
    icon: AlertCircle,
    iconClass: 'text-cyan-400',
  },
}

function ToastItem({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false)
  const style = STYLES[toast.type]
  const Icon = style.icon

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl shadow-black/40 min-w-[260px] max-w-[360px] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${style.bg} ${style.border}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${style.iconClass}`} />
      <span className="text-white/90 text-sm flex-1">{toast.message}</span>
      <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors ml-1">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
