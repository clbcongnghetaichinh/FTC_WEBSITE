-- ============================================================
-- FTC WEBSITE V2 - Admin Panel Database Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. ACTIVITIES (Hoạt động / Sự kiện)
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  img_url TEXT,
  alt TEXT,
  category TEXT NOT NULL DEFAULT 'Học thuật',
  duration TEXT,
  participants TEXT,
  status TEXT DEFAULT 'Sắp diễn ra',
  status_color TEXT DEFAULT 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  highlights TEXT[] DEFAULT '{}',
  color TEXT DEFAULT 'from-blue-500 to-cyan-500',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MEMBERS (Thành viên & Cơ cấu)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL DEFAULT 'Ban Chấp Hành',
  avatar_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  bio TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ACHIEVEMENTS (Thành tích & Dự án)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  year INT DEFAULT EXTRACT(YEAR FROM NOW())::INT,
  category TEXT NOT NULL DEFAULT 'Giải thưởng',
  img_url TEXT,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RECRUITMENT (Tuyển thành viên)
CREATE TABLE IF NOT EXISTS recruitment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season TEXT NOT NULL,
  is_open BOOLEAN DEFAULT false,
  deadline TIMESTAMPTZ,
  form_url TEXT,
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  departments TEXT[] DEFAULT '{}',
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLUB INFO (Thông tin CLB)
CREATE TABLE IF NOT EXISTS club_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed club_info with defaults
INSERT INTO club_info (key, value, label) VALUES
  ('club_name', 'Câu Lạc Bộ Công Nghệ Tài Chính FTC', 'Tên câu lạc bộ'),
  ('slogan', 'Nơi kết nối những người đam mê công nghệ tài chính', 'Slogan'),
  ('facebook_url', 'https://www.facebook.com/ftc.club', 'Facebook URL'),
  ('instagram_url', 'https://www.instagram.com/ftc.club', 'Instagram URL'),
  ('email', 'ftc@example.com', 'Email liên hệ'),
  ('phone', '0901234567', 'Số điện thoại'),
  ('address', 'Trường Đại học Tài chính – Marketing', 'Địa chỉ'),
  ('member_count', '100', 'Số thành viên'),
  ('project_count', '10', 'Số dự án'),
  ('partner_count', '50', 'Số đối tác'),
  ('event_count', '100', 'Số sự kiện')
ON CONFLICT (key) DO NOTHING;

-- 6. ADMIN SESSIONS (simple password-based auth)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruitment_updated_at BEFORE UPDATE ON recruitment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: Disable for service role access from API routes
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read activities" ON activities FOR SELECT USING (is_published = true);
CREATE POLICY "Public read members" ON members FOR SELECT USING (is_active = true);
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public read recruitment" ON recruitment FOR SELECT USING (true);
CREATE POLICY "Public read club_info" ON club_info FOR SELECT USING (true);

-- Service role full access (used by API routes with service key)
CREATE POLICY "Service full access activities" ON activities USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service full access members" ON members USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service full access achievements" ON achievements USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service full access recruitment" ON recruitment USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service full access club_info" ON club_info USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Service full access admin_sessions" ON admin_sessions USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
