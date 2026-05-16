/**
 * useAdminCrud — Generic CRUD hook with optimistic updates
 *
 * Cách dùng:
 *   const { items, loading, save, remove, reload } = useAdminCrud<Member>('/api/admin/members')
 *
 * Optimistic update:
 *   - Khi save/delete: cập nhật state ngay, không chờ API
 *   - Nếu API lỗi: tự động rollback về state cũ
 *   - Kết quả: UI phản hồi tức thì, không bị lag
 */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CrudOptions {
  /** Sort key sau khi optimistic insert (default: 'sort_order') */
  sortKey?: string
  /** Redirect nếu 401 (default: '/admin/login') */
  loginPath?: string
}

interface CrudResult<T> {
  items: T[]
  loading: boolean
  saving: boolean
  /** Reload data từ server */
  reload: () => Promise<void>
  /** Tạo mới (POST) hoặc cập nhật (PUT) tùy theo có id không */
  save: (item: Partial<T>) => Promise<{ ok: boolean; error?: string; data?: T }>
  /** Xoá theo id */
  remove: (id: string) => Promise<{ ok: boolean; error?: string }>
}

export function useAdminCrud<T extends { id: string }>(endpoint: string, options: CrudOptions = {}): CrudResult<T> {
  const { sortKey = 'sort_order', loginPath = '/admin/login' } = options
  const router = useRouter()
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // Ref giữ items hiện tại để rollback khi optimistic update thất bại
  const itemsRef = useRef<T[]>([])

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(endpoint)
      if (r.status === 401) { router.push(loginPath); return }
      const data = await r.json()
      const list = Array.isArray(data) ? data : []
      setItems(list)
      itemsRef.current = list
    } catch {
      // network error — giữ nguyên state cũ
    } finally {
      setLoading(false)
    }
  }, [endpoint, loginPath, router])

  useEffect(() => { reload() }, [reload])

  const save = useCallback(async (item: Partial<T>): Promise<{ ok: boolean; error?: string; data?: T }> => {
    setSaving(true)
    const isNew = !item.id
    const prevItems = itemsRef.current

    // --- Optimistic update ---
    if (isNew) {
      // Tạm thêm với id giả để UI hiển thị ngay
      const tempId = `temp_${Date.now()}`
      const optimistic = { ...item, id: tempId } as T
      const next = [...prevItems, optimistic]
      setItems(next)
      itemsRef.current = next
    } else {
      const next = prevItems.map(i => i.id === item.id ? { ...i, ...item } as T : i)
      setItems(next)
      itemsRef.current = next
    }

    try {
      const method = isNew ? 'POST' : 'PUT'
      const body = isNew ? (({ id: _id, ...rest }) => rest)(item as any) : item
      const r = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!r.ok) {
        // Rollback
        setItems(prevItems)
        itemsRef.current = prevItems
        const d = await r.json().catch(() => ({}))
        return { ok: false, error: d.error || `Lỗi ${r.status}` }
      }

      const data: T = await r.json()
      // Thay item tạm bằng item thật từ server
      const synced = isNew
        ? [...prevItems, data].sort((a, b) => ((a as any)[sortKey] ?? 0) - ((b as any)[sortKey] ?? 0))
        : prevItems.map(i => i.id === (item.id) ? data : i)
      setItems(synced)
      itemsRef.current = synced
      return { ok: true, data }
    } catch (err) {
      // network error — rollback
      setItems(prevItems)
      itemsRef.current = prevItems
      return { ok: false, error: 'Lỗi kết nối mạng' }
    } finally {
      setSaving(false)
    }
  }, [endpoint, sortKey])

  const remove = useCallback(async (id: string): Promise<{ ok: boolean; error?: string }> => {
    const prevItems = itemsRef.current
    // Optimistic: xoá ngay khỏi UI
    const next = prevItems.filter(i => i.id !== id)
    setItems(next)
    itemsRef.current = next

    try {
      const r = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!r.ok) {
        setItems(prevItems)
        itemsRef.current = prevItems
        const d = await r.json().catch(() => ({}))
        return { ok: false, error: d.error || `Lỗi ${r.status}` }
      }
      return { ok: true }
    } catch {
      setItems(prevItems)
      itemsRef.current = prevItems
      return { ok: false, error: 'Lỗi kết nối mạng' }
    }
  }, [endpoint])

  return { items, loading, saving, reload, save, remove }
}
