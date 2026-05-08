"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setErr("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Nơi web sẽ chuyển hướng về sau khi đăng nhập Google thành công
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (e: any) {
      setErr(e.message || "Đã có lỗi xảy ra khi đăng nhập bằng Google.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Đăng nhập</h3>
        <p className="text-blue-200 text-sm">
          Sử dụng tài khoản Google để tham gia Diễn đàn FTC
        </p>
      </div>

      <div className="space-y-4">
        {err && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white border-2 border-red-400 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">❌</span>
              <span className="font-semibold text-sm">{err}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 rounded-lg px-6 py-3 font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            "Đang kết nối..."
          ) : (
            <>
              {/* Biểu tượng Google SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Đăng nhập bằng Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}