"use client"

import { useRef, useState, useEffect } from "react"
import { Trophy } from "lucide-react"
import { ATTACKER_OVERVIEW } from "@/lib/attacker-data"

export function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "160px 24px",
        marginBottom: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)",
        position: "relative",
        overflow: "hidden",
        background: "#000", // Chuẩn Đen
      }}
    >
      {/* ==================================================== */}
      {/* 1. LỚP NỀN ĐỘNG (CHỈ DÙNG CYAN VÀ ĐEN) */}
      {/* ==================================================== */}
      <div style={{
        position: "absolute",
        inset: "-50%",
        zIndex: 1,
        pointerEvents: "none",
        // Loại bỏ tone tím, chỉ giữ lại gradient Đen và Xanh Cyan sâu
        background: "conic-gradient(from 180deg at 50% 50%, #000000 0%, #082f49 20%, #000000 40%, #0e7490 60%, #000000 80%, #083344 100%)",
        animation: "subtleSpin 30s linear infinite alternate",
        opacity: 0.5,
        filter: "blur(40px)",
      }} />
      
      {/* Lưới Scanlines */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        background: "repeating-linear-gradient(rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)",
        pointerEvents: "none"
      }} />

      {/* ==================================================== */}
      {/* 2. NỘI DUNG CHÍNH */}
      {/* ==================================================== */}
      <div style={{ position: "relative", zIndex: 10 }}>
        
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "10px 28px", borderRadius: 9999,
          background: "rgba(15, 23, 42, 0.7)", 
          border: "1px solid rgba(14,165,233,0.3)", // Đổi viền sang Cyan
          marginBottom: 32,
        }}>
          <Trophy size={16} color="#38bdf8" />
          <span style={{
            fontSize: "11px", fontWeight: 800,
            color: "#7dd3fc", // Trắng xanh
            textTransform: "uppercase", letterSpacing: "0.25em",
          }}>
            Cuộc thi thường niên
          </span>
        </div>

        {/* ==================================================== */}
        {/* TYPOGRAPHY CHÍNH - BỎ HOVER, LUÔN HIỂN THỊ VỮNG CHÃI */}
        {/* ==================================================== */}
        <h2 style={{
          fontWeight: 950,
          textTransform: "uppercase",
          lineHeight: 1,
          margin: "0 0 16px 0",
          // Đã hạ size từ (6.5rem, 18vw, 15rem) xuống tầm này để chữ thu gọn, không bị tràn viền
          fontSize: "clamp(3.5rem, 9vw, 7.5rem)", 
          background: "linear-gradient(to bottom, #ffffff 20%, #7dd3fc 70%, #0ea5e9 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 25px rgba(14,165,233,0.25))", 
          transform: visible ? "translateY(0)" : "translateY(32px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)",
          cursor: "default",
        }}>
          {ATTACKER_OVERVIEW.title}
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: "13px", fontWeight: 800,
          color: "#38bdf8", // Xanh Cyan
          letterSpacing: "0.5em", 
          textTransform: "uppercase",
          marginBottom: 32,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.8s ease 0.2s`,
        }}>
          {ATTACKER_OVERVIEW.subtitle}
        </p>

        {/* Divider - Xanh Cyan */}
        <div style={{
          width: 60, height: 2,
          background: "linear-gradient(to right, #0ea5e9, transparent)",
          margin: "0 auto 40px",
        }} />

        {/* Description */}
        <p style={{
          fontSize: "14px", 
          color: "#ffffff",
          maxWidth: 720,
          margin: "0 auto 96px",
          lineHeight: 1.8,
          fontWeight: 400,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.8s ease 0.4s`,
        }}>
          {ATTACKER_OVERVIEW.description}
        </p>

        {/* Legacy stats */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "center", gap: 100, 
        }}>
          {ATTACKER_OVERVIEW.legacy.map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.6s ease ${0.6 + i * 0.15}s, transform 0.6s ease ${0.6 + i * 0.15}s`,
              }}
            >
              <p style={{
                fontSize: "3.5rem", fontWeight: 900, lineHeight: 1,
                marginBottom: 16,
                // Loại bỏ màu tím, đổi gradient số liệu thành Trắng - Cyan
                background: "linear-gradient(135deg, #ffffff, #38bdf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {value}
              </p>
              <p style={{
                fontSize: "11px", fontWeight: 800,
                color: "rgba(255,255,255,0.4)", // Trắng mờ
                textTransform: "uppercase", letterSpacing: "0.22em",
              }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}