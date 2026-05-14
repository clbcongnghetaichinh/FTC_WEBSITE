'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

export type ToastData = {
  id: string
  type: ToastType
  message: string
}

type Props = { toast: ToastData; onDismiss: (id: string) => void }

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
}

const COLORS = {
  success: 'border-green-500/40 bg-green-500/10 text-green-300',
  error: 'border-red-500/40 bg-red-500/10 text-red-300',
  warning: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
}

const ICON_COLORS = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
}

export function Toast({ toast, onDismiss }: Props) {
  const Icon = ICONS[toast.type]
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    timer.current = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer.current)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-sm animate-in slide-in-from-right-4 duration-300 ${COLORS[toast.type]}`}
      style={{ minWidth: 260, maxWidth: 400 }}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${ICON_COLORS[toast.type]}`} />
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map(t => <Toast key={t.id} toast={t} onDismiss={onDismiss} />)}
    </div>
  )
}
