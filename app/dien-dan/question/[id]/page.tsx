"use client";

import { use } from "react"; // Đã thêm hàm use() cho Next.js 15
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ForumApi } from "@/lib/forumApi";
import type { QuestionItem } from "@/types/forum";
import NewResponseForm from "@/components/forum/NewResponseForm";
import CommentSection from "@/components/forum/CommentSection";
import { AuthProvider } from "@/context/AuthContext";

function DetailInner({ questionId }: { questionId: string }) {
  const [q, setQ] = useState<QuestionItem | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await ForumApi.fetchQuestions({ take: 100 });
    const found = res.data?.items?.find(x => x.id === questionId) || null;
    setQ(found);
    setLoading(false);
  }
  
  useEffect(() => { 
    if(questionId) load(); 
  }, [questionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003663] via-[#004a7c] to-[#003663] text-white">
      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(0, 174, 239, 0.5), 0 0 40px rgba(0, 174, 239, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(0, 174, 239, 0.8), 0 0 60px rgba(0, 174, 239, 0.5);
          }
        }
        @keyframes line-expand {
          0%, 100% { width: 200px; opacity: 0.5; }
          50% { width: 300px; opacity: 1; }
        }
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes rain {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-line-expand { animation: line-expand 2s ease-in-out infinite; }
        .animate-rain { animation: rain linear infinite; }
        .animate-float-particle { animation: float-particle 15s infinite ease-in-out; }
      `}</style>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Modern Orange Back Button - Mobile Optimized */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <button 
            onClick={() => window.history.back()} 
            className="group inline-flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-400/30 hover:from-orange-500/30 hover:to-red-500/30 hover:border-orange-400/50 text-orange-200 hover:text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <span className="text-white text-xs sm:text-sm lg:text-base font-bold">←</span>
            </div>
            <span className="group-hover:translate-x-1 transition-transform duration-300 text-xs sm:text-sm lg:text-base">Quay lại danh sách</span>
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-orange-400 to-red-400 rounded-full group-hover:scale-150 transition-transform duration-300 flex-shrink-0"></div>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
            {/* Animated Background - Mobile Optimized */}
            <div className="relative mb-8 sm:mb-10 lg:mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-xl sm:blur-2xl animate-pulse"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-3 sm:border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs sm:text-sm">❓</span>
              </div>
            </div>

            {/* Loading Message - Mobile Optimized */}
            <div className="text-center space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">Đang tải câu hỏi...</h3>
              
              {/* Animated Steps - Mobile Optimized */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                {['Kết nối', 'Tải dữ liệu', 'Xử lý', 'Hoàn thành'].map((step, index) => (
                  <div
                    key={index}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-500 ${
                      index === Math.floor(Date.now() / 1000) % 4
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white scale-110"
                        : "bg-gradient-to-r from-slate-600/50 to-slate-700/50 text-slate-300"
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>

              {/* Encouragement Message - Mobile Optimized */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-md mx-auto">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-sm sm:text-base lg:text-lg">💡</span>
                  </div>
                  <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white">Mẹo nhỏ:</h4>
                </div>
                <p className="text-orange-200 text-xs sm:text-sm italic leading-relaxed animate-pulse">
                  Đang chuẩn bị những thảo luận thú vị cho bạn...
                </p>
              </div>

              {/* Fun Facts - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl sm:max-w-2xl mx-auto mt-4 sm:mt-6">
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm sm:text-base lg:text-lg">🚀</span>
                    <span className="text-xs sm:text-sm font-semibold text-green-200">Tốc độ</span>
                  </div>
                  <p className="text-xs text-green-300">Đang tối ưu hóa để tải nhanh nhất</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm sm:text-base lg:text-lg">🔒</span>
                    <span className="text-xs sm:text-sm font-semibold text-purple-200">Bảo mật</span>
                  </div>
                  <p className="text-xs text-purple-300">Dữ liệu được mã hóa an toàn</p>
                </div>
              </div>

              {/* Progress Bar - Mobile Optimized */}
              <div className="w-full max-w-xs mx-auto mt-4 sm:mt-6">
                <div className="bg-gradient-to-r from-slate-600/30 to-slate-700/30 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full animate-pulse" style={{
                    width: `${(Math.floor(Date.now() / 1000) % 4 + 1) * 25}%`,
                    transition: 'width 0.8s ease-in-out'
                  }}></div>
                </div>
                <p className="text-xs text-orange-300 mt-1.5 sm:mt-2 text-center">
                  {Math.round(((Math.floor(Date.now() / 1000) % 4 + 1) / 4) * 100)}% hoàn thành
                </p>
              </div>
            </div>
          </div>
        ) : !q ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">❓</div>
            <p className="text-blue-200 text-lg sm:text-xl">Không tìm thấy câu hỏi</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Question Card - Mobile Optimized */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-blue-400/30 p-3 sm:p-4 lg:p-6 shadow-2xl">
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                  <span className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-400/30 flex-shrink-0">
                    {q.category || 'Thảo luận'}
                  </span>
                  <span className="text-xs sm:text-sm text-blue-300">
                    {new Date(q.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight break-words">{q.title}</h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base text-blue-200">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex-shrink-0"></span>
                  <span className="truncate">Người đăng: <span className="text-white font-semibold">{q.user}</span></span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-400/20 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
                <p className="text-blue-100 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm lg:text-base break-words">
                  {q.content}
                </p>
              </div>
            </div>

            {/* Responses Section - Mobile Optimized */}
            <div className="bg-gradient-to-br from-[#003663]/90 to-[#004a7c]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-blue-400/30 p-3 sm:p-4 lg:p-6 shadow-2xl">
              {/* Comment Section */}
              <CommentSection 
                questionId={q.id} 
                initialComments={q.responses || []} 
                onCommentAdded={load}
              />

              {/* New Response Form - Mobile Optimized */}
              <div className="mt-3 sm:mt-4 lg:mt-6 pt-3 sm:pt-4 lg:pt-6 border-t border-blue-400/30">
                <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-sm sm:text-base lg:text-lg">✍️</span>
                  <span className="text-xs sm:text-sm lg:text-base">Viết phản hồi mới</span>
                </h4>
                <NewResponseForm questionId={q.id} onCreated={load} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- PHẦN CODE ĐÃ ĐƯỢC CHỈNH SỬA CHO NEXT.JS 15 ---
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  // Giải nén params bằng hàm use()
  const resolvedParams = use(params);

  return (
    <AuthProvider>
      <DetailInner questionId={resolvedParams.id} />
    </AuthProvider>
  );
}