"use client"

import { useState, useEffect } from "react"
import { ATTACKER_SEASONS } from "@/lib/attacker-data"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { SectionHeader } from "./SectionHeader"
import { SeasonCard } from "./SeasonCard"

// XỬ LÝ THỨ TỰ: Đảo ngược mảng data gốc để thứ tự hiển thị là 2019 -> 2022 -> 2024 -> 2025
const ORDERED_SEASONS = [...ATTACKER_SEASONS].reverse()

export const AttackerSection = () => {
  // Khởi tạo 0 lúc này sẽ là thẻ đầu tiên của ORDERED_SEASONS (tức là 2019)
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? ORDERED_SEASONS.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === ORDERED_SEASONS.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      else if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <section style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
      
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "10%", left: "20%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <SectionHeader />
        </div>

        {/* Desktop 3D Carousel */}
        <div className="hidden lg:block relative h-[750px]" style={{ perspective: "2000px" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
            {/* Sử dụng mảng ORDERED_SEASONS thay vì mảng cũ */}
            {ORDERED_SEASONS.map((season, index) => {
              const position = (index - currentIndex + ORDERED_SEASONS.length) % ORDERED_SEASONS.length;
              let transformClass = '';
              let opacity = 1;
              let zIndex = 1;

              if (position === 0) {
                transformClass = 'translate(-50%, -50%) translateX(0) translateZ(0) rotateY(0deg) scale(1)';
                opacity = 1; zIndex = 30;
              } else if (position === 1) {
                transformClass = 'translate(-50%, -50%) translateX(450px) translateZ(-200px) rotateY(-20deg) scale(0.8)';
                opacity = 0.6; zIndex = 20;
              } else if (position === ORDERED_SEASONS.length - 1) {
                transformClass = 'translate(-50%, -50%) translateX(-450px) translateZ(-200px) rotateY(20deg) scale(0.8)';
                opacity = 0.6; zIndex = 20;
              } else {
                transformClass = 'translate(-50%, -50%) translateX(0) translateZ(-500px) rotateY(0deg) scale(0.5)';
                opacity = 0; zIndex = 10;
              }

              return (
                <div
                  key={season.year}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    position: "absolute", left: "50%", top: "50%",
                    width: 520, height: 520, 
                    transform: transformClass, opacity, zIndex,
                    transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity"
                  }}
                >
                  <SeasonCard season={season} index={index} isActive={position === 0} />
                </div>
              );
            })}
          </div>

          <button 
            onClick={goToPrevious} 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/80 border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:bg-sky-500/30 hover:scale-110 hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all"
            style={{ willChange: "transform, box-shadow" }}
          >
            <ChevronLeft size={32} color="#38bdf8" />
          </button>
          
          <button 
            onClick={goToNext} 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-slate-900/80 border border-sky-500/50 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:bg-sky-500/30 hover:scale-110 hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all"
            style={{ willChange: "transform, box-shadow" }}
          >
            <ChevronRight size={32} color="#38bdf8" />
          </button>
        </div>

        {/* Mobile Snap Scroll */}
        <div className="lg:hidden relative pb-8">
           <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4" style={{ scrollbarWidth: "none" }}>
              {/* Sử dụng mảng ORDERED_SEASONS cho Mobile */}
              {ORDERED_SEASONS.map((season, index) => (
                <div key={season.year} className="snap-center shrink-0 w-[85vw] aspect-square"> 
                   <SeasonCard season={season} index={index} isActive={true} />
                </div>
              ))}
           </div>
        </div>

        {/* Nút Call to Action cuối trang */}
        <div style={{ textAlign: "center", marginTop: 64 }}>
            <Link
              href="/attacker"
              style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                padding: "16px 36px", borderRadius: 15,
                background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
                border: "1px solid rgba(59,130,246,0.3)",
                fontSize: "12px", fontWeight: 800, color: "white",
                textTransform: "uppercase", letterSpacing: "0.22em",
                textDecoration: "none", transition: "all 0.3s ease",
                willChange: "background-color, border-color"
              }}
              className="hover:bg-blue-600/20 hover:border-blue-500 hover:scale-105 group"
            >
              Khám phá toàn bộ Di sản
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" style={{ willChange: "transform" }} />
            </Link>
        </div>

      </div>
    </section>
  )
}