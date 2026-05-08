"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type SessionUser = {
  userId: string;
  full_name: string;
  mssv: string;
  email?: string;
  isAnonymous?: boolean;
};

type AuthCtx = {
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
};

const Ctx = createContext<AuthCtx>({ 
  user: null, 
  setUser: () => {}, 
  logout: async () => {},
  loading: true 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // --- HÀM TỰ CHỮA LÀNH (Đồng bộ Auth và Profiles) ---
    const ensureProfileExists = async (userId: string, isAnon: boolean, metadata: any) => {
      try {
        // Dùng maybeSingle() để kiểm tra xem profile đã có chưa
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        // Nếu chưa có (Profile = null) -> Tiến hành chèn dữ liệu mới
        if (!profile) {
          await supabase.from('profiles').insert([
            {
              id: userId,
              display_name: isAnon ? `Khách ${userId.substring(0, 4)}` : (metadata?.full_name || 'Thành viên'),
              avatar_url: metadata?.avatar_url || ''
            }
          ]);
        }
      } catch (error) {
        console.error("Lỗi khi đồng bộ profile:", error);
      }
    };

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          const { data: authData, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Supabase từ chối tạo Khách:", error.message);
          } else if (authData?.user) {
            // Vừa tạo Khách xong -> Tạo Profile cho Khách luôn
            await ensureProfileExists(authData.user.id, true, null);
          }
        } else {
           // Khách cũ quay lại -> Kiểm tra nhỡ đâu bị thiếu Profile
           await ensureProfileExists(session.user.id, session.user.is_anonymous || false, session.user.user_metadata);
        }
      } catch (err) {
        console.error("Lỗi mạng/Supabase:", err);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        const isAnon = session.user.is_anonymous || false;
        const currentUser: SessionUser = {
          userId: session.user.id,
          full_name: isAnon 
            ? `Khách ${session.user.id.substring(0, 4)}` 
            : (session.user.user_metadata?.full_name || 'Thành viên'),
          mssv: isAnon ? 'Guest' : (session.user.user_metadata?.mssv || ''),
          email: session.user.email,
          isAnonymous: isAnon
        };
        setUserState(currentUser);

        // Khi vừa bấm nút Đăng nhập Google thành công -> Cập nhật Profile
        if (event === 'SIGNED_IN') {
          await ensureProfileExists(session.user.id, isAnon, session.user.user_metadata);
        }
      } else {
        setUserState(null);
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const setUser = (u: SessionUser | null) => setUserState(u); 

  const logout = async () => {
    setLoading(true); 
    try {
      await supabase.auth.signOut(); 
      window.location.reload(); 
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      setLoading(false);
    }
  };

  return (
    <Ctx.Provider value={{ user, setUser, logout, loading }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-[#003663] text-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="animate-pulse font-semibold">Đang đồng bộ dữ liệu...</p>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);