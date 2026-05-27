"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ATTACKER_SEASONS, ATTACKER_OVERVIEW } from "@/lib/attacker-data"

function AttackerExperience() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const seasonQuery = searchParams.get("season")

  const initialSeason = ATTACKER_SEASONS.find(s => s.year === seasonQuery) || ATTACKER_SEASONS[0]
  const [activeSeason, setActiveSeason] = useState(initialSeason)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleSeasonChange = (year: string) => {
    const selected = ATTACKER_SEASONS.find(s => s.year === year)
    if (selected) {
      setActiveSeason(selected)
      router.push(`/attacker?season=${year}`, { scroll: false })
    }
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#051f48", 
      backgroundImage: "radial-gradient(circle at top center, rgba(12, 134, 191, 0.1) 0%, transparent 80%)",
      color: "#fff", 
      position: "relative" 
    }}>
      
      {/* 1. NÚT QUAY VỀ TRANG CHỦ */}
      <div style={{ position: "absolute", top: 32, left: 32, zIndex: 50 }}>
        <Link 
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            textDecoration: "none", transition: "all 0.3s ease",
            willChange: "background-color, color"
          }}
          className="hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={16} />
          Trang chủ
        </Link>
      </div>

      {/* 2. CINEMATIC HERO */}
      <section style={{ 
        position: "relative", height: "100vh", minHeight: 900,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        background: "#020617", overflow: "hidden",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img 
            src={activeSeason.banner} 
            alt={`Attacker Banner ${activeSeason.year}`}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: 0.3,
              animation: "slowZoom 20s ease-in-out infinite alternate",
              willChange: "transform"
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.7) 60%, #020617 100%)"
          }} />
        </div>

        <div style={{
          position: "absolute", top: "45%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 1, pointerEvents: "none", width: "100%", textAlign: "center"
        }}>
          <h2 style={{
            fontSize: "35vw", fontWeight: 900, margin: 0,
            lineHeight: 1, color: "rgba(255,255,255,0.02)", 
            WebkitTextStroke: "1px rgba(255,255,255,0.05)",
            letterSpacing: "-0.05em",
            animation: "floatYear 10s ease-in-out infinite",
            willChange: "transform"
          }}>
            {activeSeason.year}
          </h2>
        </div>

        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          background: "radial-gradient(circle at 50% 50%, rgba(14,165,233,0.1) 0%, transparent 60%)",
        }} />

        <div style={{ 
          position: "relative", zIndex: 10, textAlign: "center", 
          maxWidth: 1400, padding: "0 40px", width: "100%" 
        }}>
          <div style={{ marginBottom: 40, animation: "fadeInDown 1s ease-out" }}>
            <span style={{
              fontSize: "14px", fontWeight: 800, color: "#38bdf8",
              textTransform: "uppercase", letterSpacing: "0.5em",
              padding: "8px 24px", borderRadius: "100px",
              background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.1)"
            }}>
              Attacker Heritage {activeSeason.year}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(3rem, 6vw, 6rem)", 
            fontWeight: 900, lineHeight: 1.1,
            margin: "0 0 40px 0", letterSpacing: "-0.02em", color: "#fff",
            maxWidth: "1200px", marginLeft: "auto", marginRight: "auto",
            animation: "revealText 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform, opacity"
          }}>
            {activeSeason.theme.split("?").map((part, i, arr) => {
              if (!part.trim()) return null;
              const hasQuestionMark = arr.length > 1;
              const isGradient = hasQuestionMark && i === 1;

              return (
                <span key={i} style={{ 
                    display: "block",
                    background: isGradient ? "linear-gradient(to right, #fff, #38bdf8)" : "transparent",
                    WebkitBackgroundClip: isGradient ? "text" : "initial",
                    WebkitTextFillColor: isGradient ? "transparent" : "initial",
                    color: isGradient ? "transparent" : "#fff",
                    opacity: isGradient ? 0.9 : 1
                }}>
                  {part.trim()}{hasQuestionMark && i === 0 ? "?" : ""}
                </span>
              )
            })}
          </h1>

          <p style={{
            fontSize: "18px", color: "rgba(255,255,255,0.5)",
            maxWidth: "600px", margin: "0 auto 64px",
            lineHeight: 1.8, fontWeight: 400, letterSpacing: "0.01em"
          }}>
            {activeSeason.journeyDescription}
          </p>

          <div style={{
            display: "flex", justifyContent: "center", gap: "80px",
            borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "40px",
            maxWidth: "800px", margin: "0 auto"
          }}>
            {[
              { label: "Thí sinh", value: activeSeason.overview.accounts },
              { label: "Đội thi", value: activeSeason.overview.teams },
              { label: "Đại học", value: activeSeason.overview.universities },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", color: "rgb(255, 255, 255)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, height: "80px", width: "1px",
          background: "linear-gradient(to bottom, transparent, #38bdf8)",
          opacity: 0.5
        }} />

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes floatYear {
            0%, 100% { transform: translate(-50%, -50%) translateY(0); }
            50% { transform: translate(-50%, -50%) translateY(-20px); }
          }
          @keyframes revealText {
            from { opacity: 0; transform: translateY(40px) skewY(2deg); }
            to { opacity: 1; transform: translateY(0) skewY(0); }
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </section>

      {/* 3. INTERACTIVE TIMELINE */}
      <div style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(2, 12, 27, 0.9)", 
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(56, 189, 248, 0.25)",
        borderTop: "1px solid rgba(56, 189, 248, 0.05)", 
        padding: "24px 0",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginBottom: 32 }}>
          <div style={{
            height: "2px", width: "60px", background: "linear-gradient(90deg, transparent, #38bdf8)", boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)"
          }} />
          <h3 style={{
            fontSize: "25px", fontWeight: 900, margin: 0, textTransform: "uppercase", letterSpacing: "0.2em",
            background: "linear-gradient(to right, #ffffff, #38bdf8, #0ea5e9)", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 15px rgba(56, 189, 248, 0.5))"
          }} className="animate-pulse">
            Khám phá chi tiết mùa thi
          </h3>
          <div style={{
            height: "2px", width: "60px", background: "linear-gradient(-90deg, transparent, #38bdf8)", boxShadow: "0 0 10px rgba(56, 189, 248, 0.6)"
          }} />
        </div>

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "0 40px" }}>
          <div style={{
            position: "absolute", top: "62%", left: "60px", right: "60px", height: 2,
            background: "linear-gradient(90deg, rgba(56,189,248,0.05), rgba(56,189,248,0.4) 50%, rgba(56,189,248,0.05))", zIndex: 1
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
            {[...ATTACKER_SEASONS].reverse().map((season) => {
              const isActive = season.year === activeSeason.year;
              return (
                <button
                  key={season.year}
                  onClick={() => handleSeasonChange(season.year)}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                    padding: "4px 16px", position: "relative", outline: "none"
                  }}
                  className="group"
                >
                  <span style={{
                    fontSize: isActive ? "32px" : "20px", fontWeight: 950,
                    color: isActive ? "#ffffff" : "rgba(56, 189, 248, 0.4)",
                    textShadow: isActive ? "0 0 20px rgba(56, 189, 248, 0.8)" : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, color"
                  }} className="group-hover:text-white group-hover:scale-110">
                    {season.year}
                  </span>
                  
                  <div style={{
                    width: isActive ? 14 : 8, height: isActive ? 14 : 8, borderRadius: "50%",
                    background: isActive ? "#38bdf8" : "rgba(2, 12, 27, 1)",
                    border: isActive ? "2px solid #ffffff" : "2px solid rgba(56, 189, 248, 0.4)",
                    boxShadow: isActive ? "0 0 15px #38bdf8, 0 0 30px #0ea5e9" : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    position: "relative", zIndex: 3,
                    willChange: "transform, border-color"
                  }} className="group-hover:border-white group-hover:scale-125" />

                  <div style={{
                    position: "absolute", bottom: "-6px", width: isActive ? 24 : 0, height: 2,
                    background: "#38bdf8", boxShadow: "0 0 10px #38bdf8",
                    transition: "all 0.3s ease",
                    willChange: "width"
                  }} className="group-hover:w-16 group-hover:bg-white" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 4. CHỈ SỐ ẤN TƯỢNG */}
      <section style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
          {[
            { label: "Tiếp cận truyền thông", value: activeSeason.overview.socialReach },
            { label: "Tài khoản đăng ký", value: activeSeason.overview.accounts },
            { label: "Đội thi tranh tài", value: activeSeason.overview.teams },
            { label: "Quy mô tiếp cận đại học", value: activeSeason.overview.universities },
            { label: "Mức độ hài lòng", value: activeSeason.overview.successRate },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              style={{
                width: "calc(33.333% - 16px)", minWidth: 260,
                background: "linear-gradient(145deg, rgba(14,165,233,0.2) 0%, rgba(8,47,73,0.8) 100%)",
                border: "1px solid rgba(56,189,248,0.3)",
                boxShadow: "0 15px 35px rgba(0,0,0,0.3), inset 0 0 20px rgba(14,165,233,0.15)",
                borderRadius: 16, padding: "36px 24px", textAlign: "center",
                position: "relative", overflow: "hidden",
                animation: `statsFadeIn 0.6s ease-out ${i * 0.1}s forwards`,
                opacity: 0, transform: "translateY(20px)",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease",
                willChange: "transform, border-color, box-shadow"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.8)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(14,165,233,0.3), inset 0 0 30px rgba(56,189,248,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(56,189,248,0.3)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.3), inset 0 0 20px rgba(14,165,233,0.15)";
              }}
            >
              <div 
                className="animate-pulse"
                style={{
                  position: "absolute", top: "-30px", right: "-30px", 
                  width: 140, height: 140, borderRadius: "50%", 
                  background: "rgba(56,189,248,0.35)", filter: "blur(40px)",
                  zIndex: 1, pointerEvents: "none", animationDuration: `${3 + (i % 3)}s` 
                }} 
              />
              <div 
                className="animate-pulse"
                style={{
                  position: "absolute", bottom: "-20px", left: "-20px", 
                  width: 100, height: 100, borderRadius: "50%", 
                  background: "rgba(14,165,233,0.25)", filter: "blur(35px)",
                  zIndex: 1, pointerEvents: "none", animationDuration: `${4 + (i % 2)}s`, animationDelay: "1s"
                }} 
              />
              <p style={{ 
                fontSize: "clamp(1.8rem, 2vw, 2.6rem)", fontWeight: 950, margin: "0 0 12px 0", 
                color: "#ffffff", textShadow: "0 0 15px rgba(56,189,248,0.8)",
                position: "relative", zIndex: 2, letterSpacing: "-0.02em",
                whiteSpace: "normal", wordBreak: "break-word", lineHeight: 1.1
              }}>
                {stat.value}
              </p>
              <p style={{ 
                fontSize: "12px", fontWeight: 800, margin: 0, color: "#bae6fd", 
                textTransform: "uppercase", letterSpacing: "0.12em", position: "relative", zIndex: 2,
                lineHeight: 1.4, wordBreak: "break-word", display: "-webkit-box",
                WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ĐỐI TÁC ĐỒNG HÀNH */}
      <section style={{ padding: "80px 24px 120px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontSize: "30px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em",
            color: "#fff", textShadow: "0 0 20px rgba(14,165,233,0.5)" 
          }}>
            Đối tác đồng hành
          </h2>
          <div style={{ width: 60, height: 2, background: "linear-gradient(to right, transparent, #0ea5e9, transparent)", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px" }}>
          {activeSeason.sponsors.diamond.map((sponsor) => (
            <div 
              key={sponsor.name} 
              className="group"
              style={{ 
                width: 280, height: 130, background: "rgba(255, 255, 255, 0.04)", 
                backdropFilter: "blur(10px)", borderRadius: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px 32px", position: "relative",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                willChange: "transform, border-color, box-shadow"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#38bdf8";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(14,165,233,0.2), inset 0 0 20px rgba(56,189,248,0.05)";
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <img 
                src={sponsor.logo} alt={sponsor.name} 
                style={{ 
                  maxWidth: "100%", maxHeight: "100%", objectFit: "contain", 
                  filter: "opacity(85%) drop-shadow(0 0 8px rgba(255,255,255,0.2))", 
                  transition: "all 0.5s ease",
                  willChange: "transform, filter"
                }} 
                className="group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
              />
            </div>
          ))}
        </div>
      </section>    

      {/* 6. CƠ CẤU GIẢI THƯỞNG */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto", borderTop: "1px solid rgba(56, 189, 248, 0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 style={{
            fontSize: "30px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.2em",
            color: "#fff", textShadow: "0 0 20px rgba(14,165,233,0.5)"
          }}>
            Cơ cấu giải thưởng
          </h2>
          <div style={{ width: 60, height: 2, background: "linear-gradient(to right, transparent, #0ea5e9, transparent)", margin: "16px auto 0" }} />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "24px" }}>
          {(() => {
            const prizes = activeSeason.prizes;
            const displayPrizes = prizes.length === 3 ? [prizes[1], prizes[0], prizes[2]] : prizes;

            return displayPrizes.map((prize) => {
              const isChampion = prize.rank.toLowerCase().includes("quán quân");

              return (
                <div 
                  key={prize.rank} className="group relative"
                  style={{ 
                    width: isChampion ? "360px" : "300px", height: isChampion ? "420px" : "360px",
                    background: isChampion 
                        ? "linear-gradient(145deg, rgba(14,165,233,0.15) 0%, rgba(2,6,23,0.9) 100%)" 
                        : "linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(2,6,23,0.6) 100%)",
                    border: isChampion ? "2px solid rgba(56,189,248,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: isChampion 
                        ? "0 20px 40px rgba(14,165,233,0.2), inset 0 0 30px rgba(14,165,233,0.1)" 
                        : "0 10px 30px rgba(0,0,0,0.5)",
                    borderRadius: 24, padding: "48px 24px", textAlign: "center",
                    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                    overflow: "hidden", zIndex: isChampion ? 10 : 1,
                    transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    willChange: "transform, border-color, box-shadow"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-15px) scale(1.02)";
                    e.currentTarget.style.borderColor = isChampion ? "#38bdf8" : "rgba(255,255,255,0.3)";
                    e.currentTarget.style.boxShadow = isChampion 
                        ? "0 30px 60px rgba(14,165,233,0.4), inset 0 0 50px rgba(56,189,248,0.2)" 
                        : "0 20px 40px rgba(0,0,0,0.6)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.borderColor = isChampion ? "rgba(56,189,248,0.5)" : "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = isChampion 
                        ? "0 20px 40px rgba(14,165,233,0.2), inset 0 0 30px rgba(14,165,233,0.1)" 
                        : "0 10px 30px rgba(0,0,0,0.5)";
                  }}
                >
                  <div style={{
                    position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                    transform: "skewX(-25deg)", transition: "all 0.7s ease",
                  }} className="group-hover:left-[200%]" />

                  {isChampion && (
                    <div style={{ 
                      position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", 
                      width: 150, height: 150, background: "rgba(56,189,248,0.3)", filter: "blur(40px)", zIndex: 1 
                    }} />
                  )}
                  
                  <span style={{ 
                    fontSize: isChampion ? "72px" : "56px", 
                    filter: isChampion ? "drop-shadow(0 0 25px rgba(250,204,21,0.6))" : "drop-shadow(0 0 10px rgba(255,255,255,0.2))", 
                    position: "relative", zIndex: 2, display: "block", marginBottom: 24,
                    transition: "transform 0.3s ease", willChange: "transform"
                  }} className="group-hover:scale-110">
                    {prize.icon}
                  </span>
                  
                  <h3 style={{ 
                    fontSize: isChampion ? "20px" : "16px", fontWeight: 900, color: isChampion ? "#fde047" : "#7dd3fc", 
                    textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16, position: "relative", zIndex: 2 
                  }}>
                    {prize.rank}
                  </h3>
                  
                  <p style={{ 
                    fontSize: isChampion ? "42px" : "32px", fontWeight: 950, color: "#fff", 
                    textShadow: isChampion ? "0 0 20px rgba(56,189,248,0.8)" : "0 0 10px rgba(255,255,255,0.2)", 
                    margin: 0, position: "relative", zIndex: 2, letterSpacing: "-0.02em"
                  }}>
                    {prize.value}
                  </p>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* 7. BẢNG VÀNG VINH DANH */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto relative z-10">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes textShine {
            0% { background-position: 0% center; }
            100% { background-position: -200% center; }
          }
        `}} />

        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-5xl font-black uppercase tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-white"
            style={{ backgroundSize: "200% auto", animation: "textShine 5s linear infinite" }}
          >
            Bảng Vàng Vinh Danh
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activeSeason.hallOfFame.map((team, idx) => {
            const isChampion = idx === 0;
            const themes = [
              { label: "Quán quân", icon: "🏆", color: "text-yellow-400", border: "border-yellow-500/30 hover:border-yellow-400/80", glow: "hover:shadow-[0_0_40px_rgba(234,179,8,0.25)]", gradient: "from-yellow-200 via-yellow-400 to-yellow-600" },
              { label: "Á quân", icon: "🥈", color: "text-slate-300", border: "border-slate-400/30 hover:border-slate-300/80", glow: "hover:shadow-[0_0_40px_rgba(148,163,184,0.25)]", gradient: "from-slate-100 via-white to-slate-400" },
              { label: "Quý quân", icon: "🥉", color: "text-orange-500", border: "border-orange-500/30 hover:border-orange-500/80", glow: "hover:shadow-[0_0_40px_rgba(249,115,22,0.25)]", gradient: "from-orange-200 via-orange-500 to-orange-600" }
            ];
            const theme = themes[idx] || { label: "Giải khuyến khích", icon: "✨", color: "text-sky-400", border: "border-sky-500/30 hover:border-sky-400/80", glow: "hover:shadow-[0_0_40px_rgba(14,165,233,0.25)]", gradient: "from-sky-200 via-sky-400 to-sky-600" };

            return (
              <div 
                key={team.name}
                className={`group flex flex-col ${isChampion ? "md:flex-row md:col-span-2" : ""} 
                  bg-[#020617] border ${theme.border} rounded-[24px] overflow-hidden 
                  transition-all duration-500 hover:-translate-y-2 ${theme.glow}`}
                style={{ willChange: "transform, box-shadow" }}
              >
                <div className={`relative overflow-hidden ${isChampion ? "md:w-1/2" : "w-full"} aspect-video md:aspect-auto bg-black`}>
                  <img 
                    src={team.image} alt={team.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    style={{ willChange: "transform" }}
                  />
                  <div className="absolute inset-0 bg-black/50 transition-colors duration-500 group-hover:bg-black/10" />
                  {isChampion ? (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#020617] hidden md:block" />
                  ) : null}
                  <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] ${isChampion ? "md:hidden" : ""}`} />
                </div>

                <div className={`flex flex-col justify-center ${isChampion ? "md:w-1/2 p-10 md:p-14" : "p-8 pt-0"} relative z-10`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full border ${theme.border} bg-white/5 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10`}>
                      <span className={`text-lg font-black ${theme.color}`}>0{idx + 1}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${theme.border} bg-white/5 transition-all duration-500 group-hover:border-[currentColor] ${theme.color}`}>
                      <span className="text-sm">{theme.icon}</span>
                      <span className="text-xs font-black uppercase tracking-wider">{theme.label}</span>
                    </div>
                  </div>

                  <h3 className={`font-black uppercase tracking-wider mb-2 ${isChampion ? "text-4xl md:text-5xl" : "text-3xl"} 
                    text-slate-200 transition-all duration-500 ease-out origin-left
                    group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${theme.gradient}
                    group-hover:-translate-y-1 group-hover:scale-[1.02]`}
                  >
                    {team.name}
                  </h3>
                  
                  <p className={`text-sm font-bold ${theme.color} opacity-70 mb-4 uppercase tracking-widest 
                    transition-all duration-500 ease-out group-hover:opacity-100 group-hover:tracking-[0.3em]`}
                  >
                    Ý tưởng: {team.idea}
                  </p>
                  
                  <div className={`h-1 bg-gradient-to-r ${theme.gradient} opacity-30 mb-6 rounded-full 
                    w-8 transition-all duration-700 ease-out group-hover:w-32 group-hover:opacity-100`} 
                  />

                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 md:line-clamp-4 
                    transition-all duration-500 blur-[0.5px] opacity-70 group-hover:blur-none group-hover:opacity-100 group-hover:text-slate-200">
                    {team.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. GALLERY MASONRY */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto relative z-10 border-t border-white/5">
        <div className="text-center mb-20 flex flex-col items-center relative z-10">
          <div className="relative inline-flex items-center justify-center group cursor-default mb-4">
            <div className="absolute inset-0 bg-sky-500/10 blur-2xl rounded-[100%] transition-all duration-700 group-hover:bg-sky-400/30 group-hover:blur-3xl" />
            <p className="relative text-xl md:text-[28px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] m-0
              text-transparent bg-clip-text bg-gradient-to-r from-sky-100 via-sky-400 to-sky-100"
              style={{ filter: "drop-shadow(0 0 10px rgba(56, 189, 248, 0.4))" }}
            >
              Khoảnh khắc đáng nhớ
            </p>
          </div>
          <h2 className="text-4xl md:text-[56px] font-black text-white uppercase tracking-widest mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Dấu Ấn Sự Kiện
          </h2>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1.5 bg-sky-500/30 skew-x-[-30deg]" />
            <div className="w-8 h-1.5 bg-sky-500/60 skew-x-[-30deg]" />
            <div className="w-20 h-1.5 bg-sky-400 shadow-[0_0_15px_#38bdf8] skew-x-[-30deg]" />
            <div className="w-8 h-1.5 bg-sky-500/60 skew-x-[-30deg]" />
            <div className="w-4 h-1.5 bg-sky-500/30 skew-x-[-30deg]" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[120px] md:auto-rows-[220px]">
          {[...activeSeason.moments, ...activeSeason.legacyGallery].map((imgUrl, i) => {
            const isTall = i % 3 === 0;
            return (
              <div
                key={imgUrl + i}
                onClick={() => setSelectedImage(imgUrl)}
                className={`
                  relative overflow-hidden rounded-2xl bg-[#020617] border border-white/10 group cursor-pointer
                  ${isTall ? "row-span-2" : "row-span-1"}
                  transition-all duration-500 ease-out
                  hover:border-sky-500/50 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]
                `}
                style={{ willChange: "transform, box-shadow" }}
              >
                <img
                  src={imgUrl}
                  alt={`Moment ${activeSeason.year} - ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out opacity-100 blur-none group-hover:scale-110"
                  style={{ willChange: "transform" }}
                />
              </div>
            );
          })}
        </div>
      </section>
    
      {/* 9. LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(10px)",
            animation: "fadeInModal 0.3s ease-out"
          }}
          onClick={() => setSelectedImage(null)} 
        >
          <button 
            style={{
              position: "absolute", top: "32px", right: "32px",
              width: "48px", height: "48px", borderRadius: "50%",
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.3s ease"
            }}
            className="hover:bg-sky-500/30 hover:border-sky-500"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>
          <img 
            src={selectedImage} alt="Phóng to khoảnh khắc" 
            style={{
              maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain",
              borderRadius: "16px", boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              animation: "zoomInImage 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: "transform, opacity"
            }}
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

      {/* 10. KIẾN TRÚC VÒNG THI & THỂ LỆ CHUNG */}
      <section className="py-24 px-6 max-w-[1200px] mx-auto relative z-10 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[1px] bg-sky-500/60" />
              <h3 className="text-[24px] font-black text-white uppercase tracking-[0.3em]">
                Lộ trình chi tiết
              </h3>
            </div>
            
            <div className="relative">
              <div className="absolute top-2 bottom-12 left-[21px] w-[2px] bg-sky-900/40" />
              {ATTACKER_OVERVIEW.rounds.map((round, i) => (
                <div key={i} className="group relative flex gap-6 pb-12 z-10">
                  <div className="relative flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-black text-sm
                      bg-[#030914] border border-sky-500/30 text-white
                      transition-all duration-300 group-hover:border-sky-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] group-hover:scale-105"
                      style={{ willChange: "transform, box-shadow" }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div className="pt-2.5 flex-1 transition-transform duration-300 group-hover:translate-x-1" style={{ willChange: "transform" }}>
                    <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">
                      {round.name}
                    </h4>
                    <p className="text-sm text-slate-300/80 leading-relaxed pr-4">
                      {round.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-[1px] bg-sky-500/60" />
              <h3 className="text-[24px] font-black text-white uppercase tracking-[0.3em]">
                Quy chế tham gia
              </h3>
            </div>
            
            <div className="flex flex-col gap-5">
              {[
                { label: "Đối tượng", value: ATTACKER_OVERVIEW.rules.target, icon: "🎯" },
                { label: "Đăng ký", value: ATTACKER_OVERVIEW.rules.registration, icon: "📝" },
                { label: "Điều kiện", value: ATTACKER_OVERVIEW.rules.readiness, icon: "⚡" },
              ].map(({ label, value, icon }) => (
                <div 
                  key={label} 
                  className="group flex gap-5 p-6 rounded-2xl bg-[#061124] border border-white/[0.03] shadow-lg
                    transition-all duration-300 ease-out hover:-translate-y-1 hover:border-sky-500/30 hover:bg-[#08162c] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
                  style={{ willChange: "transform, box-shadow, background-color" }}
                >
                  <div className="shrink-0 text-2xl pt-1 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" style={{ willChange: "transform, opacity" }}>
                    {icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[12px] text-white uppercase tracking-widest font-black mb-2">{label}</h4>
                    <p className="text-sm text-slate-300/80 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. CALL TO ACTION */}
       <section className="py-32 px-6 relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Hào quang nền phía sau (Tăng chiều sâu) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Tiêu đề với độ tương phản cao */}
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          ARE YOU READY FOR 2026?
        </h2>
        
        {/* Mô tả: Căn chỉnh lại spacing và độ mờ để tôn lên tiêu đề */}
        <p className="text-slate-400 text-sm md:text-base mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Attacker 2026 là cuộc thi học thuật trong lĩnh vực Fintech dành cho sinh viên, được tổ chức thường niên, với mục tiêu tạo sân chơi học thuật năng động và chất lượng cho sinh viên yêu thích lĩnh vực Fintech tại Việt Nam. Hành trình tìm kiếm những chiến binh Fintech thế hệ tiếp theo đã chính thức khởi động.
        </p>

        {/* Nút Đăng ký (Style: Glossy Neon) */}
        <a
          href="https://attacker2026-production.up.railway.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white uppercase tracking-[0.2em] text-sm md:text-base rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
          style={{ 
            background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(2,6,23,0.6))",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            boxShadow: "0 0 20px rgba(56, 189, 248, 0.15)",
            willChange: "transform, box-shadow, border-color" 
          }}
        >
          {/* Hiệu ứng viền sáng chạy quanh khi hover */}
          <div className="absolute inset-0 border-2 border-sky-400 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Text */}
          <span className="relative z-10 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-300">
            Tham gia Mùa 2026
            <svg className="w-5 h-5 text-sky-400 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </a>
      </section>

      {/* 12. BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-[100] flex items-center justify-center w-14 h-14 rounded-full bg-[#020617]/80 backdrop-blur-md border border-sky-500/40 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.2)] transition-all duration-300 hover:bg-sky-500/20 hover:scale-110 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] group"
        aria-label="Quay lại đầu trang"
        style={{ willChange: "transform, box-shadow" }}
      >
        <svg className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ willChange: "transform" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes imageFadeIn {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 0.5; transform: scale(1); }
        }
        @keyframes statsFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; opacity: 1; }
          50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          51% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}} />
    </div>
  )
}

export default function AttackerPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#020617" }} />}>
      <AttackerExperience />
    </Suspense>
  )
}