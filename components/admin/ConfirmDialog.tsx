/**
 * ConfirmDialog — Dialog xác nhận xóa, thay thế window.confirm()
 *
 * Dùng:
 *   <ConfirmDialog
 *     open={deleteId !== null}
 *     title="Xóa thành viên?"
 *     description="Hành động không thể hoàn tác."
 *     onConfirm={handleDelete}
 *     onCancel={() => setDeleteId(null)}
 *   />
 */
'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xóa',
  cancelLabel = 'Hủy',
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmDialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#001829] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            danger ? 'bg-red-500/20' : 'bg-amber-500/20'
          }`}>
            <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">{title}</h3>
            {description && <p className="text-white/50 text-sm mt-1">{description}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all hover:bg-white/5"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all ${
              danger
                ? 'bg-red-500 hover:bg-red-400'
                : 'bg-amber-500 hover:bg-amber-400'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
