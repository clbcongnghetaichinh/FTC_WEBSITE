"use client"

import { useEffect, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import QuestionCard from "@/components/forum/QuestionCard";
import NewQuestionForm from "@/components/forum/NewQuestionForm";
import LoadingSpinner from "@/components/forum/LoadingSpinner";
import SearchAndFilter from "@/components/forum/SearchAndFilter";
import { useAuth } from "@/context/AuthContext";

export default function ForumPage() {
  // --- STATES ---
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalResponses: 0,
    totalLikes: 0,
    activeUsers: 0
  });
  
  // State dùng để sửa lỗi Hydration (hiệu ứng random)
  const [isMounted, setIsMounted] = useState(false);
  
  // Lấy dữ liệu user từ AuthContext (Lúc này chắc chắn sẽ có user là Khách hoặc Google)
  const { user, logout } = useAuth();

  // --- HÀM LOAD DỮ LIỆU ---
  async function load() {
    setLoading(true);
    try {
      const res = await ForumApi.fetchQuestions({ 
        take: 50,
        category: selectedCategory || undefined,
        search: searchQuery || undefined
      });
      
      let questions = res.data?.items || [];
      
      questions = questions.map(q => ({
        ...q,
        liked_by: q.liked_by || []
      }));
      
      questions = sortQuestions(questions, selectedSort);
      setItems(questions);
      
      const totalResponses = questions.reduce((sum, q) => sum + (q.responses?.length || 0), 0);
      const totalLikes = questions.reduce((sum, q) => sum + (q.like_count || 0), 0);
      const uniqueUsers = new Set(questions.map(q => q.user)).size;
      
      setStats({
        totalQuestions: questions.length,
        totalResponses,
        totalLikes,
        activeUsers: uniqueUsers
      });
    } catch (error) {
      console.error("Error loading questions:", error);
    }
    setLoading(false);
  }

  // --- HÀM SẮP XẾP ---
  function sortQuestions(questions: QuestionItem[], sortBy: string): QuestionItem[] {
    const sortedQuestions = [...questions];
    switch (sortBy) {
      case 'newest':
        return sortedQuestions.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'oldest':
        return sortedQuestions.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      case 'most_liked':
        return sortedQuestions.sort((a, b) => {
          const diff = (b.like_count || 0) - (a.like_count || 0);
          return diff !== 0 ? diff : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
      case 'most_responses':
        return sortedQuestions.sort((a, b) => {
          const diff = (b.responses?.length || 0) - (a.responses?.length || 0);
          return diff !== 0 ? diff : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
      case 'alphabetical':
        return sortedQuestions.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'vi'));
      case 'trending':
        return sortedQuestions.sort((a, b) => {
          const now = new Date().getTime();
          const daysA = Math.max(1, (now - new Date(a.createdAt || 0).getTime()) / 86400000);
          const daysB = Math.max(1, (now - new Date(b.createdAt || 0).getTime()) / 86400000);
          const scoreA = ((a.like_count || 0) + (a.responses?.length || 0) * 2) / daysA;
          const scoreB = ((b.like_count || 0) + (b.responses?.length || 0) * 2) / daysB;
          return scoreB !== scoreA ? scoreB - scoreA : new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
      default:
        return sortedQuestions;
    }
  }

  // --- EFFECTS ---
  useEffect(() => {
    setIsMounted(true); // Kích hoạt UI sau khi load xong (chống Hydration error)
  }, []);

  useEffect(() => { 
    load(); 
  }, [searchQuery, selectedCategory, selectedSort]);

  // --- GIAO DIỆN CHÍNH ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003663] via-[#004a7c] to-[#003663] text-white">
      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-rain { animation: blink linear infinite; }
        .animate-float-particle { animation: float-particle 8s ease-in-out infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        
        {/* === HEADER SECTION === */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center py-6 sm:py-8 lg:py-12 px-2 sm:px-4 lg:px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-50 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 174, 239, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0, 174, 239, 0.1) 0%, transparent 50%)` }}></div>

          {/* SỬA LỖI HYDRATION Ở ĐÂY: Chỉ render random effects khi isMounted = true */}
          {isMounted && (
            <>
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-24 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30 animate-rain"
                    style={{
                      left: `${5 + i * 10}%`,
                      animationDuration: `${3 + (i % 5) * 0.5}s`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80 animate-float-particle"
                    style={{
                      left: `${10 + i * 10}%`,
                      animationDelay: `${i * 2}s`
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0, 174, 239, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 174, 239, 0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }}></div>
          <div className="absolute inset-0 pointer-events-none opacity-15">
            <div className="absolute top-1/5 left-1/10 w-48 h-px bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute top-1/6 right-1/6 w-px h-36 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute bottom-1/4 left-1/5 w-48 h-px bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute bottom-1/5 right-1/10 w-px h-36 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
          </div>
        
          <div className="relative max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8 z-10">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <h1 className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-wider sm:tracking-widest text-white px-2">
                <span className="absolute inset-0 filter blur-lg sm:blur-xl opacity-50 text-cyan-400">DIỄN ĐÀN FTC</span>
                <span className="relative" style={{ textShadow: '0 0 20px rgba(0, 174, 239, 0.6), 0 0 40px rgba(0, 174, 239, 0.4), 0 2px 15px rgba(0, 0, 0, 0.6)' }}>DIỄN ĐÀN FTC</span>
              </h1>
              <div className="w-24 sm:w-32 lg:w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
            </div>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto italic font-light tracking-wide px-2">
              Nơi cộng đồng fintech chia sẻ kiến thức, thảo luận xu hướng và kết nối
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 lg:gap-4 mt-6 sm:mt-8 lg:mt-12 px-2">
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-cyan-500/20">
                <div className="relative flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg">💬</span>
                  <span className="text-xs sm:text-sm lg:text-base">Thảo luận</span>
                </div>
              </button>
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-cyan-500/20">
                <div className="relative flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg">🤝</span>
                  <span className="text-xs sm:text-sm lg:text-base">Kết nối</span>
                </div>
              </button>
              <button className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-cyan-400/30 text-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-400 hover:scale-105 hover:shadow-cyan-500/20">
                <div className="relative flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg">🚀</span>
                  <span className="text-xs sm:text-sm lg:text-base">Xu hướng</span>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* === MAIN FORUM CONTENT === */}
        {user && (
          <div className="mt-4 sm:mt-6 lg:mt-8">
            
            {/* User Info Bar */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl border border-blue-400/30 p-3 sm:p-4 lg:p-5 shadow-2xl mb-3 sm:mb-4 lg:mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base lg:text-lg">{user.isAnonymous ? '🕵️' : '👋'}</span>
                  </div>
                  <div className="text-center sm:text-left min-w-0 flex-1">
                    <p className="text-xs sm:text-sm lg:text-base text-blue-200">Xin chào,</p>
                    <p className="text-sm sm:text-base lg:text-lg font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-xs sm:text-sm lg:text-base text-blue-300 truncate">({user.mssv})</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Nút liên kết Google cho Khách (Tùy chọn) */}
                  {user.isAnonymous && (
                    <button 
                      onClick={() => alert("Tính năng liên kết Google đang được cập nhật!")}
                      className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 bg-white/10 border border-white/20 rounded-lg text-white font-semibold text-xs sm:text-sm lg:text-base hover:bg-white/20 transition-all duration-200"
                    >
                      Lưu tài khoản
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-white font-semibold text-xs sm:text-sm lg:text-base hover:shadow-lg transition-all duration-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              
              {/* Cột trái: Đăng câu hỏi */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-blue-400/30 p-3 sm:p-4 lg:p-6 shadow-2xl sticky top-2 sm:top-4">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                    <span className="text-base sm:text-lg lg:text-xl">💬</span>
                    <span className="text-sm sm:text-base lg:text-lg">Tạo câu hỏi mới</span>
                  </h3>
                  <NewQuestionForm onCreated={load} />
                </div>
              </div>

              {/* Cột phải: Danh sách câu hỏi */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  
                  {/* Thanh tìm kiếm & Lọc */}
                  <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-blue-400/30 p-3 sm:p-4 lg:p-6 shadow-2xl">
                    <SearchAndFilter
                      onSearch={setSearchQuery}
                      onCategoryFilter={setSelectedCategory}
                      onSortChange={setSelectedSort}
                      searchQuery={searchQuery}
                      selectedCategory={selectedCategory}
                      selectedSort={selectedSort}
                      stats={stats}
                    />
                  </div>

                  {/* Danh sách */}
                  {loading ? (
                    <LoadingSpinner message="Đang tải câu hỏi..." showEncouragement={true} size="md" />
                  ) : (
                    <>
                      {items.length === 0 ? (
                        <div className="text-center py-6 sm:py-8 lg:py-12 bg-white/5 rounded-2xl border border-white/10">
                          <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4 opacity-50">💬</div>
                          <p className="text-blue-200 text-base sm:text-lg lg:text-xl mb-2">Chưa có bài viết nào</p>
                          <p className="text-blue-300 text-sm sm:text-base lg:text-lg">Hãy là người đầu tiên khơi mào thảo luận!</p>
                        </div>
                      ) : (
                        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                          {items.map(q => <QuestionCard key={q.id} q={q} />)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}