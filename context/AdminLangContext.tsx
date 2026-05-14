'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type Lang = 'vi' | 'en'

// === Translation dictionary ===
// Thêm key mới vào đây khi cần
const dict: Record<string, Record<Lang, string>> = {
  // Nav
  dashboard:        { vi: 'Dashboard',          en: 'Dashboard' },
  activities:       { vi: 'Hoạt động',          en: 'Activities' },
  departments:      { vi: 'Cơ cấu / Ban',        en: 'Departments' },
  members:          { vi: 'Thành viên',           en: 'Members' },
  achievements:     { vi: 'Thành tích',           en: 'Achievements' },
  recruitment:      { vi: 'Tuyển dụng',          en: 'Recruitment' },
  club_info:        { vi: 'Thông tin CLB',        en: 'Club Info' },
  logout:           { vi: 'Đăng xuất',            en: 'Logout' },
  view_site:        { vi: 'Xem website',         en: 'View site' },
  // Actions
  add:              { vi: 'Thêm',               en: 'Add' },
  edit:             { vi: 'Sửa',               en: 'Edit' },
  delete:           { vi: 'Xóa',               en: 'Delete' },
  save:             { vi: 'Lưu',               en: 'Save' },
  cancel:           { vi: 'Hủy',               en: 'Cancel' },
  saving:           { vi: 'Đang lưu...',        en: 'Saving...' },
  loading:          { vi: 'Đang tải...',        en: 'Loading...' },
  loggingOut:       { vi: 'Đang thoát...',      en: 'Logging out...' },
  confirm_delete:   { vi: 'Xác nhận xóa?',      en: 'Confirm delete?' },
  cannot_undo:      { vi: 'Hành động này không thể hoàn tác.', en: 'This action cannot be undone.' },
  // Status
  active:           { vi: 'Đang hoạt động',    en: 'Active' },
  inactive:         { vi: 'Không hoạt động',  en: 'Inactive' },
  published:        { vi: 'Đang hiển thị',      en: 'Published' },
  draft:            { vi: 'Náp',               en: 'Draft' },
  // Members
  full_name:        { vi: 'Họ và tên',         en: 'Full name' },
  position:         { vi: 'Chức vụ',           en: 'Position' },
  department:       { vi: 'Ban ngành',          en: 'Department' },
  avatar_url:       { vi: 'Ảnh đại diện',      en: 'Avatar' },
  bio:              { vi: 'Giới thiệu',         en: 'Bio' },
  email:            { vi: 'Email',              en: 'Email' },
  facebook_url:     { vi: 'Facebook URL',       en: 'Facebook URL' },
  linkedin_url:     { vi: 'LinkedIn URL',       en: 'LinkedIn URL' },
  sort_order:       { vi: 'Thứ tự',            en: 'Sort order' },
  status:           { vi: 'Trạng thái',         en: 'Status' },
  // Activities
  title:            { vi: 'Tiêu đề',            en: 'Title' },
  body:             { vi: 'Nội dung',           en: 'Content' },
  category:         { vi: 'Danh mục',           en: 'Category' },
  duration:         { vi: 'Thời gian',          en: 'Duration' },
  participants:     { vi: 'Số tham gia',        en: 'Participants' },
  highlights:       { vi: 'Điểm nổi bật',      en: 'Highlights' },
  img_url:          { vi: 'Ảnh',                en: 'Image' },
  // Achievements
  description:      { vi: 'Mô tả',             en: 'Description' },
  year:             { vi: 'Năm',               en: 'Year' },
  // Recruitment
  season:           { vi: 'Mùa tuyển dụng',    en: 'Season' },
  deadline:         { vi: 'Hạn nộp',           en: 'Deadline' },
  form_url:         { vi: 'Link form đăng ký',  en: 'Registration form URL' },
  requirements:     { vi: 'Yêu cầu',            en: 'Requirements' },
  is_open:          { vi: 'Đang tuyển',         en: 'Open' },
  // Club info
  club_name:        { vi: 'Tên câu lạc bộ',    en: 'Club name' },
  slogan:           { vi: 'Slogan',             en: 'Slogan' },
  phone:            { vi: 'Số điện thoại',     en: 'Phone' },
  address:          { vi: 'Địa chỉ',            en: 'Address' },
  member_count:     { vi: 'Số thành viên',      en: 'Member count' },
  project_count:    { vi: 'Số dự án',          en: 'Project count' },
  partner_count:    { vi: 'Số đối tác',         en: 'Partner count' },
  event_count:      { vi: 'Số sự kiện',        en: 'Event count' },
  // Toast messages
  saved_ok:         { vi: 'Đã lưu thành công', en: 'Saved successfully' },
  deleted_ok:       { vi: 'Đã xóa thành công', en: 'Deleted successfully' },
  save_error:       { vi: 'Lỗi khi lưu',       en: 'Save failed' },
  delete_error:     { vi: 'Lỗi khi xóa',       en: 'Delete failed' },
  // Misc
  all:              { vi: 'Tất cả',            en: 'All' },
  no_data:          { vi: 'Chưa có dữ liệu',   en: 'No data yet' },
  manage:           { vi: 'Quản lý',           en: 'Manage' },
  add_new:          { vi: 'Thêm mới',          en: 'Add new' },
  add_member:       { vi: 'Thêm thành viên',   en: 'Add member' },
  add_activity:     { vi: 'Thêm hoạt động',  en: 'Add activity' },
  add_achievement:  { vi: 'Thêm thành tích',  en: 'Add achievement' },
  add_department:   { vi: 'Thêm ban',          en: 'Add department' },
}

// === Context ===
type LangCtx = {
  lang: Lang
  toggle: () => void
  t: (key: string) => string
}

const LangContext = createContext<LangCtx>({
  lang: 'vi',
  toggle: () => {},
  t: (k) => k,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ftc_admin_lang') as Lang) || 'vi'
    }
    return 'vi'
  })

  const toggle = useCallback(() => {
    setLang(prev => {
      const next = prev === 'vi' ? 'en' : 'vi'
      localStorage.setItem('ftc_admin_lang', next)
      return next
    })
  }, [])

  const t = useCallback((key: string) => {
    return dict[key]?.[lang] ?? key
  }, [lang])

  return <LangContext.Provider value={{ lang, toggle, t }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
