-- Departments (Cơ cấu / Ban chuyên môn)
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Điều hành câu lạc bộ',
  icon_name TEXT DEFAULT 'Shield',
  color TEXT DEFAULT 'from-red-500 to-pink-500',
  card_gradient TEXT DEFAULT 'from-red-500 to-pink-500',
  photos TEXT[] DEFAULT '{}',
  quick_features JSONB DEFAULT '[]',
  responsibilities TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read departments" ON departments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Service full access departments" ON departments
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Seed dữ liệu từ hardcode hiện tại
INSERT INTO departments (title, category, icon_name, color, card_gradient, photos, quick_features, responsibilities, sort_order) VALUES
(
  'BAN ĐIỀU HÀNH', 'Điều hành câu lạc bộ', 'Shield',
  'from-red-500 to-pink-500', 'from-red-500 to-pink-500',
  ARRAY[]::TEXT[],
  '[{"icon":"Target","text":"Chiến lược","color":"text-red-400"},{"icon":"Zap","text":"Lãnh đạo","color":"text-pink-400"},{"icon":"TrendingUp","text":"Đối ngoại","color":"text-orange-400"}]',
  ARRAY['Định hướng phát triển và đưa ra chiến lược dài hạn','Điều phối và giám sát hoạt động của các ban, bảo đảm vận hành hiệu quả','Phê duyệt kế hoạch, ngân sách và nhân sự','Đại diện câu lạc bộ làm việc với các doanh nghiệp và đối tác'],
  0
),
(
  'BAN HỌC THUẬT', 'Phụ trách chuyên môn học thuật', 'BookOpen',
  'from-blue-500 to-cyan-500', 'from-blue-500 to-cyan-500',
  ARRAY['/BAN HỌC THUẬT.JPG'],
  '[{"icon":"Search","text":"Nghiên cứu về lĩnh vực Fintech","color":"text-blue-400"},{"icon":"Target","text":"Đảm bảo chuyên môn","color":"text-cyan-400"},{"icon":"BookOpen","text":"Trau dồi kiến thức học thuật","color":"text-indigo-400"}]',
  ARRAY['Phụ trách nội dung chuyên môn cho các buổi workshop, talkshow','Chuẩn bị câu hỏi cho các buổi tọa đàm và chuyên đề, xây dựng ngân hàng câu hỏi','Ra đề và đánh giá đề cho cuộc thi ATTACKER','Nghiên cứu và cập nhật xu hướng FinTech mới nhất'],
  1
),
(
  'BAN SỰ KIỆN', 'Phụ trách xử lý hồ sơ giấy tờ', 'Calendar',
  'from-green-500 to-emerald-500', 'from-green-500 to-emerald-500',
  ARRAY['/BAN SỰ KIỆN.JPG'],
  '[{"icon":"FileText","text":"Chuẩn bị hồ sơ","color":"text-green-400"},{"icon":"Settings","text":"Xử lý giấy tờ","color":"text-emerald-400"},{"icon":"Calendar","text":"Lên kịch bản và timeline sự kiện","color":"text-teal-400"}]',
  ARRAY['Viết kế hoạch, báo cáo và các giấy tờ liên quan tới câu lạc bộ','Xây dựng kịch bản MC và timeline cho sự kiện','Điều phối logistics và venue cho các hoạt động','Quản lý chất lượng và tiến độ thực hiện sự kiện'],
  2
),
(
  'BAN TRUYỀN THÔNG', 'Phụ trách mảng truyền thông', 'Megaphone',
  'from-purple-500 to-violet-500', 'from-purple-500 to-violet-500',
  ARRAY['/BAN TRUYỀN THÔNG.JPG'],
  '[{"icon":"TrendingUp","text":"Phát triển truyền thông","color":"text-purple-400"},{"icon":"Palette","text":"Thiết kế ấn phẩm","color":"text-violet-400"},{"icon":"Video","text":"Sản xuất nội dung truyền thông","color":"text-fuchsia-400"}]',
  ARRAY['Thiết kế ấn phẩm và truyền thông cho câu lạc bộ','Quản lý các kênh truyền thông của câu lạc bộ và lên kế hoạch đăng bài truyền thông','Phát triển hình ảnh và thương hiệu của câu lạc bộ','Sản xuất nội dung video, podcast và multimedia'],
  3
),
(
  'BAN TÀI CHÍNH CÁ NHÂN', 'Phụ trách chuyên môn về mảng tài chính cá nhân', 'Wallet',
  'from-amber-700 to-yellow-800', 'from-amber-700 to-yellow-800',
  ARRAY['/BAN TÀI CHÍNH CÁ NHÂN.JPG'],
  '[{"icon":"GraduationCap","text":"Giáo dục về tài chính cá nhân","color":"text-amber-400"},{"icon":"Wallet","text":"Làm việc với bộ bài MoneyWe","color":"text-yellow-400"},{"icon":"DollarSign","text":"Hỗ trợ giảng dạy về tài chính cá nhân","color":"text-orange-400"}]',
  ARRAY['Tổ chức đào tạo, nâng cao hiểu biết tài chính cá nhân cho sinh viên','Phát triển và cập nhật nội dung cho bộ bài MoneyWe','Hỗ trợ giảng viên giảng dạy các môn học liên quan đến mảng tài chính cá nhân','Tư vấn và hướng dẫn quản lý tài chính cho sinh viên'],
  4
),
(
  'BAN NHÂN SỰ', 'Phụ trách quản lý phân công nhân sự', 'Users',
  'from-indigo-500 to-blue-500', 'from-indigo-500 to-blue-500',
  ARRAY['/BAN NHÂN SỰ.JPG'],
  '[{"icon":"UserCheck","text":"Quản lý nhân sự","color":"text-indigo-400"},{"icon":"Calculator","text":"Xây dựng dự trù kinh phí","color":"text-blue-400"},{"icon":"Heart","text":"Duy trì văn hóa câu lạc bộ","color":"text-cyan-400"}]',
  ARRAY['Phân công công việc và quản lý tiến độ công việc','Triển khai hoạt động gắn kết, gìn giữ văn hóa tổ chức','Lập dự trù kinh phí cho từng hoạt động','Tuyển dụng, đào tạo và phát triển nhân lực'],
  5
);
