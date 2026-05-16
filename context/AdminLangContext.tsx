/**
 * AdminLangContext — Song ngữ EN/VI cho Admin Panel
 *
 * Dùng:
 *   const { t, lang, setLang } = useAdminLang()
 *   t('save')          // → 'Lưu' hoặc 'Save'
 *   t('members.title') // → 'Thành viên' hoặc 'Members'
 *
 * Thêm <AdminLangProvider> vào app/admin/layout.tsx
 */
'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type Lang = 'vi' | 'en'

// --- Translation dictionary ---
const dict = {
  // Common actions
  save:       { vi: 'Lưu', en: 'Save' },
  cancel:     { vi: 'Hủy', en: 'Cancel' },
  delete:     { vi: 'Xóa', en: 'Delete' },
  edit:       { vi: 'Sửa', en: 'Edit' },
  add:        { vi: 'Thêm', en: 'Add' },
  search:     { vi: 'Tìm kiếm', en: 'Search' },
  loading:    { vi: 'Đang tải...', en: 'Loading...' },
  saving:     { vi: 'Đang lưu...', en: 'Saving...' },
  confirm_delete: { vi: 'Xác nhận xóa?', en: 'Confirm delete?' },
  confirm_delete_desc: { vi: 'Hành động này không thể hoàn tác.', en: 'This action cannot be undone.' },
  no_data:    { vi: 'Chưa có dữ liệu.', en: 'No data yet.' },
  status:     { vi: 'Trạng thái', en: 'Status' },
  active:     { vi: 'Đang hoạt động', en: 'Active' },
  inactive:   { vi: 'Không hoạt động', en: 'Inactive' },
  published:  { vi: 'Hiển thị', en: 'Published' },
  hidden:     { vi: 'Ẩn', en: 'Hidden' },
  sort_order: { vi: 'Thứ tự', en: 'Order' },
  image_url:  { vi: 'URL hình ảnh', en: 'Image URL' },
  all:        { vi: 'Tất cả', en: 'All' },
  manage:     { vi: 'Quản lý', en: 'Manage' },
  view_site:  { vi: 'Xem website', en: 'View site' },
  logout:     { vi: 'Đăng xuất', en: 'Logout' },
  logging_out: { vi: 'Đang thoát...', en: 'Logging out...' },
  saved_ok:   { vi: 'Đã lưu thành công!', en: 'Saved successfully!' },
  deleted_ok: { vi: 'Đã xóa thành công!', en: 'Deleted successfully!' },
  error_save: { vi: 'Lỗi khi lưu', en: 'Error saving' },
  error_delete: { vi: 'Lỗi khi xóa', en: 'Error deleting' },

  // Nav labels
  nav_dashboard:    { vi: 'Dashboard', en: 'Dashboard' },
  nav_activities:   { vi: 'Hoạt động', en: 'Activities' },
  nav_departments:  { vi: 'Cơ cấu / Ban', en: 'Departments' },
  nav_members:      { vi: 'Thành viên', en: 'Members' },
  nav_achievements: { vi: 'Thành tích', en: 'Achievements' },
  nav_recruitment:  { vi: 'Tuyển dụng', en: 'Recruitment' },
  nav_club_info:    { vi: 'Thông tin CLB', en: 'Club Info' },

  // Members
  'members.title':      { vi: 'Thành viên & Cơ cấu', en: 'Members & Structure' },
  'members.add':        { vi: 'Thêm thành viên', en: 'Add member' },
  'members.edit':       { vi: 'Chỉnh sửa thành viên', en: 'Edit member' },
  'members.full_name':  { vi: 'Họ và tên', en: 'Full name' },
  'members.position':   { vi: 'Chức vụ', en: 'Position' },
  'members.department': { vi: 'Ban ngành', en: 'Department' },
  'members.avatar':     { vi: 'Ảnh đại diện', en: 'Avatar' },
  'members.email':      { vi: 'Email', en: 'Email' },
  'members.facebook':   { vi: 'Facebook URL', en: 'Facebook URL' },
  'members.linkedin':   { vi: 'LinkedIn URL', en: 'LinkedIn URL' },
  'members.bio':        { vi: 'Giới thiệu', en: 'Bio' },

  // Activities
  'activities.title':        { vi: 'Hoạt động & Sự kiện', en: 'Activities & Events' },
  'activities.add':          { vi: 'Thêm hoạt động', en: 'Add activity' },
  'activities.edit':         { vi: 'Chỉnh sửa hoạt động', en: 'Edit activity' },
  'activities.act_title':    { vi: 'Tiêu đề', en: 'Title' },
  'activities.body':         { vi: 'Nội dung mô tả', en: 'Description' },
  'activities.category':     { vi: 'Danh mục', en: 'Category' },
  'activities.duration':     { vi: 'Thời lượng', en: 'Duration' },
  'activities.participants': { vi: 'Số người tham gia', en: 'Participants' },
  'activities.highlights':   { vi: 'Điểm nổi bật (mỗi dòng 1 điểm)', en: 'Highlights (one per line)' },

  // Achievements
  'achievements.title':       { vi: 'Thành tích & Dự án', en: 'Achievements & Projects' },
  'achievements.add':         { vi: 'Thêm thành tích', en: 'Add achievement' },
  'achievements.ach_title':   { vi: 'Tên thành tích', en: 'Achievement title' },
  'achievements.description': { vi: 'Mô tả', en: 'Description' },
  'achievements.year':        { vi: 'Năm', en: 'Year' },
  'achievements.category':    { vi: 'Loại', en: 'Category' },

  // Recruitment
  'recruitment.title':        { vi: 'Mùa tuyển dụng', en: 'Recruitment Season' },
  'recruitment.add':          { vi: 'Thêm mùa tuyển', en: 'Add season' },
  'recruitment.season':       { vi: 'Tên mùa tuyển', en: 'Season name' },
  'recruitment.deadline':     { vi: 'Hạn nộp', en: 'Deadline' },
  'recruitment.form_url':     { vi: 'Link form đăng ký', en: 'Registration form URL' },
  'recruitment.description':  { vi: 'Mô tả', en: 'Description' },
  'recruitment.is_open':      { vi: 'Đang mở tuyển', en: 'Open for registration' },

  // Club info
  'club_info.title':  { vi: 'Thông tin CLB', en: 'Club Info' },
  'club_info.key':    { vi: 'Khóa', en: 'Key' },
  'club_info.value':  { vi: 'Giá trị', en: 'Value' },
  'club_info.label':  { vi: 'Nhãn hiển thị', en: 'Display label' },

  // Departments
  'departments.title':      { vi: 'Các Ban', en: 'Departments' },
  'departments.add':        { vi: 'Thêm ban', en: 'Add department' },
  'departments.dept_title': { vi: 'Tên ban', en: 'Department name' },
  'departments.category':   { vi: 'Danh mục', en: 'Category' },
  'departments.icon':       { vi: 'Tên icon (lucide)', en: 'Icon name (lucide)' },
  'departments.color':      { vi: 'Màu gradient', en: 'Gradient color' },
  'departments.photos':     { vi: 'Danh sách ảnh (mỗi dòng 1 URL)', en: 'Photos (one URL per line)' },
  'departments.responsibilities': { vi: 'Nhiệm vụ (mỗi dòng 1 mục)', en: 'Responsibilities (one per line)' },
} as const

type Key = keyof typeof dict

interface AdminLangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: Key) => string
}

const AdminLangContext = createContext<AdminLangContextValue>({
  lang: 'vi',
  setLang: () => {},
  t: (key) => dict[key]?.vi ?? key,
})

export function AdminLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('vi')

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    // Persist preference
    try { localStorage.setItem('ftc_admin_lang', l) } catch {}
  }, [])

  const t = useCallback((key: Key): string => {
    return dict[key]?.[lang] ?? key
  }, [lang])

  return (
    <AdminLangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </AdminLangContext.Provider>
  )
}

export function useAdminLang() {
  return useContext(AdminLangContext)
}
