"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { ATTACKER_OVERVIEW, ATTACKER_SEASONS, type AttackerSeason } from "@/lib/attacker-data"
import { Trophy, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"

// ─────────────────────────────────────────────────────────────
// SEASON CARD với magnetic hover + parallax image
// ─────────────────────────────────────────────────────────────
function SeasonCard({ season, index }: { season: AttackerSeason; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -8, y: dx * 8 })
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
    // Parallax image
    if (imgRef.current) {
      imgRef.current.style.transform = `scale(1.08) translate(${dx * -6}px, ${dy * -6}px)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    if (imgRef.current) {
      imgRef.current.style.transform = "scale(1) translate(0px, 0px)"
    }
  }, [])

  return (
    <Link
      ref={cardRef}
      href={`/attacker?season=${season.year}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        display: "block",
        width: 300,
        height: 440,
        flexShrink: 0,
        borderRadius: 28,
        overflow: "hidden",
        textDecoration: "none",
        border: `1px solid ${isHovered ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale(1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
        transition: isHovered
          ? "transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease"
          : "transform 0.5s cubic-bezier(0.23,1,0.32,1), border-color 0.3s ease, box-shadow 0.5s ease",
        boxShadow: isHovered
          ? "0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.15)"
          : "0 8px 32px rgba(0,0,0,0.4)",
        cursor: "pointer",
        willChange: "transform",
      }}
    >
      {/* Banner image — parallax */}
      <img
        ref={imgRef}
        src={season.banner}
        alt={`ATTACKER ${season.year}`}
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
          objectFit: "cover",
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
          willChange: "transform",
        }}
      />

      {/* Base overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)",
      }} />

      {/* Animated spotlight follow cursor */}
      {isHovered && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, rgba(59,130,246,0.18) 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "opacity 0.2s ease",
        }} />
      )}

      {/* Top edge glow on hover */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(to right, transparent, rgba(59,130,246,0.8), rgba(139,92,246,0.6), transparent)",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.4s ease",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px",
      }}>
        {/* Top: year ghost */}
        <span style={{
          fontSize: "5.5rem",
          fontWeight: 900,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.1)",
          userSelect: "none",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.4s ease",
          display: "block",
        }}>
          {season.year}
        </span>

        {/* Bottom info */}
        <div style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.4s ease",
        }}>
          {/* Theme */}
          <p style={{
            fontSize: "9px", fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.22em",
            color: isHovered ? "rgba(147,197,253,1)" : "rgba(96,165,250,0.75)",
            marginBottom: 10,
            transition: "color 0.3s ease",
          }}>
            {season.theme}
          </p>

          {/* Divider */}
          <div style={{
            width: isHovered ? "100%" : "40%",
            height: 1,
            background: "linear-gradient(to right, rgba(59,130,246,0.6), transparent)",
            marginBottom: 14,
            transition: "width 0.5s cubic-bezier(0.23,1,0.32,1)",
          }} />

          {/* Stat */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{
              fontSize: "2.8rem", fontWeight: 900,
              color: "white", lineHeight: 1,
              textShadow: isHovered ? "0 0 20px rgba(96,165,250,0.4)" : "none",
              transition: "text-shadow 0.3s ease",
            }}>
              {season.overview.accounts}
            </span>
            <span style={{
              fontSize: "9px", fontWeight: 700,
              color: "rgba(255,255,255,0.35)",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>
              tài khoản
            </span>
          </div>

          {/* Top team */}
          {season.hallOfFame[0] && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: 18,
              opacity: isHovered ? 1 : 0.7,
              transition: "opacity 0.3s ease",
            }}>
              <span style={{ fontSize: "13px" }}>🏆</span>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 800, color: "white", margin: 0 }}>
                  {season.hallOfFame[0].name}
                </p>
                <p style={{
                  fontSize: "9px", color: "rgba(255,255,255,0.35)",
                  fontStyle: "italic", margin: 0,
                }}>
                  {season.hallOfFame[0].idea}
                </p>
              </div>
            </div>
          )}

          {/* CTA row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: "10px", fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "0.18em",
                color: isHovered ? "rgba(147,197,253,1)" : "rgba(96,165,250,0.7)",
                transition: "color 0.3s ease",
              }}>
                Xem chi tiết
              </span>
              <div style={{
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.3s ease",
                color: "rgba(96,165,250,0.8)",
              }}>
                <ArrowRight size={11} />
              </div>
            </div>

            {/* Season index dot */}
            <span style={{
              fontSize: "9px", fontWeight: 800,
              color: "rgba(255,255,255,0.15)",
              letterSpacing: "0.1em",
            }}>
              0{index + 1}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────
// SCROLL TRACK — hiệu ứng cuộn có drag
// ─────────────────────────────────────────────────────────────
function ScrollTrack({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [progress, setProgress] = useState(0)

  // Drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current
    if (!track) return
    setIsDragging(true)
    setStartX(e.pageX - track.offsetLeft)
    setScrollLeft(track.scrollLeft)
    track.style.cursor = "grabbing"
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    trackRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const onMouseUp = () => {
    setIsDragging(false)
    if (trackRef.current) trackRef.current.style.cursor = "grab"
  }

  // Progress bar
  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setProgress(max > 0 ? track.scrollLeft / max : 0)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => track.removeEventListener("scroll", onScroll)
  }, [onScroll])

  return (
    <div>
      {/* Scroll track */}
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          overflowY: "visible",
          paddingBottom: 20,
          paddingTop: 20,
          paddingLeft: 32,
          paddingRight: 32,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        {children}
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 32px", marginTop: 8 }}>
        <div style={{
          width: "100%", height: 2,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(to right, rgba(59,130,246,0.8), rgba(139,92,246,0.6))",
            borderRadius: 2,
            transition: "width 0.1s linear",
          }} />
        </div>

        {/* Hint text */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 8,
        }}>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Kéo để khám phá
          </span>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: "0.1em" }}>
            {Math.round(progress * (ATTACKER_SEASONS.length - 1)) + 1} / {ATTACKER_SEASONS.length}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER với scroll-triggered fade
// ─────────────────────────────────────────────────────────────
function SectionHeader() {
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
        padding: "0 16px",
        marginBottom: 56,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 20px", borderRadius: 9999,
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.2)",
        marginBottom: 24,
      }}>
        <Trophy size={14} color="rgba(96,165,250,0.9)" />
        <span style={{
          fontSize: "10px", fontWeight: 800,
          color: "rgba(96,165,250,0.9)",
          textTransform: "uppercase", letterSpacing: "0.2em",
        }}>
          Cuộc thi thường niên
        </span>
      </div>

      {/* Title */}
      <h2 style={{
        fontWeight: 900,
        textTransform: "uppercase",
        lineHeight: 1,
        margin: "0 0 16px 0",
        fontSize: "clamp(3rem, 10vw, 7rem)",
        background: "linear-gradient(135deg, #ffffff 30%, rgba(59,130,246,0.85) 65%, rgba(139,92,246,0.9) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        {ATTACKER_OVERVIEW.title}
      </h2>

      {/* Subtitle */}
      <p style={{
        fontSize: "11px", fontWeight: 800,
        color: "rgba(96,165,250,0.7)",
        letterSpacing: "0.35em", textTransform: "uppercase",
        marginBottom: 12,
      }}>
        {ATTACKER_OVERVIEW.subtitle}
      </p>

      {/* Description */}
      <p style={{
        fontSize: "13px",
        color: "rgba(255,255,255,0.35)",
        maxWidth: 480,
        margin: "0 auto 40px",
        lineHeight: 1.75,
      }}>
        {ATTACKER_OVERVIEW.description}
      </p>

      {/* Legacy stats */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        justifyContent: "center", gap: 40,
      }}>
        {ATTACKER_OVERVIEW.legacy.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              textAlign: "center",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.6s ease ${0.2 + i * 0.1}s, transform 0.6s ease ${0.2 + i * 0.1}s`,
            }}
          >
            <p style={{
              fontSize: "2.2rem", fontWeight: 900, lineHeight: 1,
              marginBottom: 6,
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {value}
            </p>
            <p style={{
              fontSize: "9px", fontWeight: 800,
              color: "rgba(255,255,255,0.25)",
              textTransform: "uppercase", letterSpacing: "0.2em",
            }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export const AttackerSection = () => {
  return (
    <section style={{ position: "relative", padding: "96px 0", overflow: "hidden" }}>

      {/* Atmosphere */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "10%", left: "20%",
          width: 500, height: 500,
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "15%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* Header */}
        <SectionHeader />

        {/* Divider */}
        <div style={{
          width: "100%", height: 1,
          background: "linear-gradient(to right, transparent, rgba(59,130,246,0.2), transparent)",
          marginBottom: 40,
        }} />

        {/* Cards scroll */}
        <ScrollTrack>
          {ATTACKER_SEASONS.map((season, i) => (
            <div key={season.year} style={{ scrollSnapAlign: "start" }}>
              <SeasonCard season={season} index={i} />
            </div>
          ))}

          {/* See all card */}
          <Link
            href="/attacker"
            style={{
              flexShrink: 0,
              width: 140,
              height: 440,
              borderRadius: 28,
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              background: "rgba(255,255,255,0.01)",
              scrollSnapAlign: "start",
              textDecoration: "none",
              transition: "border-color 0.3s ease, background 0.3s ease",
            }}
            className="hover:border-blue-500/30 hover:bg-blue-500/5 group"
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.08))",
              border: "1px solid rgba(59,130,246,0.25)",
              transition: "transform 0.3s ease",
            }} className="group-hover:scale-110">
              <ChevronRight size={18} color="rgba(96,165,250,0.8)" />
            </div>
            <p style={{
              fontSize: "9px", fontWeight: 800,
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase", letterSpacing: "0.2em",
              textAlign: "center", lineHeight: 2,
              transition: "color 0.3s ease",
            }} className="group-hover:text-blue-400">
              Xem<br />tất cả<br />mùa thi
            </p>
          </Link>
        </ScrollTrack>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "0 16px" }}>
          <div style={{
            display: "inline-block", padding: 1, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5))",
          }}>
            <Link
              href="/attacker"
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 32px", borderRadius: 15,
                background: "#000",
                fontSize: "11px", fontWeight: 800,
                color: "white",
                textTransform: "uppercase", letterSpacing: "0.22em",
                textDecoration: "none",
                transition: "background 0.3s ease",
              }}
              className="hover:bg-blue-950/60 group"
            >
              Khám phá toàn bộ ATTACKER
              <div style={{
                transition: "transform 0.3s ease",
              }} className="group-hover:translate-x-1">
                <ChevronRight size={14} />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}