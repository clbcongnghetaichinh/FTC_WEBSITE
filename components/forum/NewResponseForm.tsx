"use client";
import { useState, useRef, useEffect } from "react";
import { ForumApi } from "@/lib/forumApi";
import { useAuth } from "@/context/AuthContext";

export default function NewResponseForm({ questionId, onCreated }:{ questionId: string; onCreated?: ()=>void }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Căn chỉnh tự động chiều cao khung nhập liệu (giống Facebook)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Tối đa 200px
      textarea.style.height = `${newHeight}px`;
    }
  }, [content]);

  // Xử lý phím Enter để gửi nhanh
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !loading) {
        submit(e as any);
      }
    }
  };

  // --- HÀM GỬI DỮ LIỆU ĐÃ ĐƯỢC "BỌC THÉP" ---
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if(!user) return alert("Vui lòng đăng nhập để bình luận.");
    if(!content.trim()) return;
    
    setLoading(true);
    try {
      // Dùng user.userId thay vì user.mssv để tránh lỗi Foreign Key với tài khoản Khách
      const res = await ForumApi.createResponse({ 
        user: user.userId, 
        anonymous, 
        content, 
        questionId 
      });
      
      if(res && res.ok) { 
        // Gửi thành công -> Dọn dẹp ô nhập liệu
        setContent(""); 
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        onCreated?.(); // Báo cho component cha tải lại danh sách bình luận
      } else {
        // Có lỗi từ Supabase -> In ra Console và hiện cảnh báo
        console.error("Chi tiết lỗi từ Supabase:", res);
        alert("Không thể gửi bình luận! Lỗi: " + (res?.error?.message || res?.error || res?.message || "Bị khóa bởi phân quyền RLS."));
      }
    } catch (error: any) {
      // Bắt các lỗi đứt mạng, sập server...
      console.error("Lỗi hệ thống:", error);
      alert("Đã xảy ra lỗi hệ thống: " + error.message);
    } finally {
      setLoading(false); // Luôn luôn tắt hiệu ứng loading dù thành công hay thất bại
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 sm:space-y-6">
      {/* Enhanced Response Form Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm sm:text-base lg:text-lg">✍️</span>
        </div>
        <div>
          <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white">Viết phản hồi mới</h4>
          <p className="text-xs sm:text-sm lg:text-base text-blue-300">Chia sẻ suy nghĩ của bạn về câu hỏi này</p>
        </div>
      </div>

      {/* Enhanced Textarea Container */}
      <div className="relative">
        <label className="block text-sm sm:text-base lg:text-lg font-semibold text-blue-200 mb-3 sm:mb-4">
          Nội dung phản hồi
        </label>
        <div className={`relative transition-all duration-300 ${
          isFocused ? 'scale-[1.01]' : 'scale-100'
        }`}>
          <textarea 
            ref={textareaRef}
            className={`w-full border-2 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 bg-[#003663]/60 text-white placeholder-blue-300 transition-all duration-300 resize-none text-sm sm:text-base lg:text-lg leading-relaxed min-h-[80px] ${
              isFocused 
                ? 'border-orange-500 ring-4 ring-orange-500/20 shadow-2xl shadow-orange-500/20' 
                : 'border-blue-400/30 hover:border-blue-400/50'
            }`}
            rows={4}
            placeholder="Chia sẻ suy nghĩ của bạn về câu hỏi này..."
            value={content} 
            onChange={e=>setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '80px', maxHeight: '200px' }}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-2 right-3 text-xs text-blue-400/70">
            {content.length}/1000
          </div>
          
          {/* Focus Indicator */}
          {isFocused && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl sm:rounded-2xl -z-10 animate-pulse"></div>
          )}
        </div>
      </div>
      
      {/* Enhanced Options Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg text-blue-200 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={anonymous} 
            onChange={e=>setAnonymous(e.target.checked)}
            className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 bg-[#003663] border-blue-400 rounded focus:ring-orange-500 focus:ring-2 group-hover:scale-110 transition-transform duration-200"
          />
          <span className="group-hover:text-white transition-colors duration-200">Trả lời ẩn danh</span>
        </label>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setContent("");
              if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
              }
            }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
          >
            Xóa nội dung
          </button>
        </div>
      </div>
      
      {/* Enhanced Submit Button */}
      <button 
        type="submit"
        className={`group relative w-full rounded-xl sm:rounded-2xl px-6 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6 font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 sm:gap-4 ${
          loading
            ? "bg-gradient-to-r from-orange-600 to-red-700 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
        }`}
        disabled={loading || !content.trim()}
      >
        {/* Button Press Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transition-transform duration-150 ${
          loading ? "translate-x-full" : "translate-x-[-100%] group-active:translate-x-full"
        }`}></div>
        
        {/* Button Content */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-4">
          {loading ? (
            <>
              {/* Enhanced Loading Animation */}
              <div className="relative">
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 border-2 border-orange-300/50 border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
              </div>
              <span className="animate-pulse text-sm sm:text-base lg:text-lg">
                Đang gửi phản hồi...
              </span>
              
              {/* Progress Dots */}
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <span className="text-lg sm:text-xl lg:text-2xl group-hover:scale-110 transition-transform duration-200">💬</span>
              <span className="text-sm sm:text-base lg:text-lg">Gửi phản hồi</span>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </>
          )}
        </div>
        
        {/* Button Ripple Effect */}
        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-opacity duration-300 ${
          loading 
            ? "bg-gradient-to-r from-orange-400/20 to-red-400/20 opacity-100" 
            : "bg-gradient-to-r from-white/10 to-transparent opacity-0 group-active:opacity-100"
        }`}></div>
      </button>
      
      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-blue-400/70">
          💡 Mẹo: Nhấn <kbd className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs">Enter</kbd> để gửi, 
          <kbd className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs ml-1">Shift + Enter</kbd> để xuống dòng
        </p>
      </div>
    </form>
  );
}