"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Trophy } from "lucide-react"
import type { AttackerSeason } from "@/lib/attacker-data"

export function SeasonCard({ season, index, isActive }: { season: AttackerSeason; index: number; isActive: boolean }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onClick={() => isActive && router.push(`/attacker?season=${season.year}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative", width: "100%", height: "100%",
        borderRadius: 32, overflow: "hidden",
        background: "#020617",
        border: `1px solid ${isActive ? "rgba(56, 189, 248, 0.3)" : "rgba(255,255,255,0.05)"}`,
        // Tối ưu: Chỉ transition các thuộc tính cần thiết, bỏ "all"
        transition: "border-color 0.5s ease, box-shadow 0.5s ease",
        cursor: isActive ? "pointer" : "default",
        willChange: "border-color" 
      }}
    >
      {/* 1. Banner & Background Layer */}
      <img
        src={season.banner}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: isActive ? 0.45 : 0.1,
          transform: isHovered && isActive ? "scale(1.1)" : "scale(1.02)",
          // Tối ưu: Tách biệt timing
          transition: "transform 10s linear, opacity 0.5s ease",
          willChange: "transform, opacity" // Tối ưu GPU
        }}
      />
      
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(2,6,23,0.2) 0%, rgba(2,6,23,0.8) 50%, #020617 100%)",
      }} />

      {/* 2. GHOST YEAR */}
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, textAlign: "center", zIndex: 1 }}>
        <span style={{
          fontSize: "10rem", fontWeight: 950, lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: (isHovered && isActive) 
            ? "1.5px rgba(56, 189, 248, 0.8)" 
            : isActive ? "1.5px rgba(255,255,255,0.25)" : "1px rgba(255,255,255,0.08)",
          filter: (isHovered && isActive) ? "drop-shadow(0 0 20px rgba(14,165,233,0.5))" : "none",
          letterSpacing: "-0.05em", 
          transition: "filter 0.4s ease, -webkit-text-stroke 0.4s ease",
          display: "block",
          willChange: "filter"
        }}>
          {season.year}
        </span>
      </div>

      {/* 3. Content Body */}
      <div style={{
        position: "absolute", inset: 0,
        padding: "48px", display: "flex", flexDirection: "column",
        justifyContent: "flex-end", zIndex: 10,
        opacity: isActive ? 1 : 0.2,
        transition: "opacity 0.5s ease"
      }}>
        
        <div style={{ marginBottom: 32, position: "relative" }}>
          <h3 style={{
            fontSize: "22px", 
            fontWeight: 900, 
            margin: 0, 
            textTransform: "uppercase",
            lineHeight: 1.3,
            color: isHovered && isActive ? "#fff" : "#94a3b8",
            textShadow: isHovered && isActive ? "0 0 15px rgba(56, 189, 248, 0.6)" : "none",
            letterSpacing: isHovered ? "0.05em" : "0.02em",
            transition: "color 0.4s ease, text-shadow 0.4s ease, letter-spacing 0.4s ease",
          }}>
            {season.theme}
          </h3>
          
          <div style={{
            position: "relative", marginTop: 16, height: 4, width: "100%",
            background: "rgba(255,255,255,0.05)", borderRadius: 2, overflow: "hidden"
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              width: isHovered ? "100%" : "40px",
              background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc)",
              boxShadow: "0 0 10px #0ea5e9",
              transition: "width 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
              willChange: "width"
            }} />
          </div>

          {isHovered && (
            <div style={{
              position: "absolute", top: -10, left: -20, right: -20, bottom: -10,
              background: "radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, transparent 70%)",
              zIndex: -1, animation: "pulseGlow 2s infinite"
            }} />
          )}
        </div>

        <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", gap: 0 }}>
           <div style={{
             fontSize: "6rem", fontWeight: 950, 
             background: "linear-gradient(to bottom, #fff, #0ea5e9)",
             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
             lineHeight: 0.9, letterSpacing: "-0.04em",
             filter: isActive ? "drop-shadow(0 0 15px rgba(14,165,233,0.3))" : "none"
           }}>
             {season.overview.accounts}
           </div>
           <div style={{
             fontSize: "12px", fontWeight: 800, color: "#38bdf8",
             textTransform: "uppercase", letterSpacing: "0.4em", 
             paddingLeft: "8px", marginTop: "4px", opacity: 0.8
           }}>
             Tài khoản đăng ký
           </div>
        </div>

        {season.hallOfFame[0] && (
          <div style={{
            position: "relative",
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${isHovered ? "rgba(56, 189, 248, 0.4)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 24, padding: "20px 24px",
            marginBottom: 40,
            transition: "border-color 0.4s ease",
          }}>
            <div style={{ 
              position: "absolute", top: -12, left: 24,
              background: "#0ea5e9", color: "#fff",
              fontSize: "10px", fontWeight: 900, padding: "4px 12px",
              borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.1em",
            }}>
              Quán quân
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(14, 165, 233, 0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(14,165,233,0.2)"
              }}>
                <Trophy size={20} color="#0ea5e9" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#fff" }}>
                   {season.hallOfFame[0].name}
                </p>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "rgb(255, 255, 255)" }}>
                  {season.hallOfFame[0].idea}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#38bdf8" }}>
              <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                Khám phá di sản
              </span>
              <ArrowRight size={18} />
           </div>
        </div>
      </div>
    </div>
  )
}