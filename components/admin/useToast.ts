'use client'

import { useState, useCallback } from 'react'
import type { ToastData, ToastType } from './Toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, type, message }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, dismiss }
}
