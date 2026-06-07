// LocationSelect.jsx
// Tela de seleção do campo de batalha.

import { useState } from "react";
import { LOCATIONS } from "../data/locations";
import { useLanguage } from "../i18n/LanguageContext";
import { T } from "../i18n/translations";

// ─── Starfield estático ───────────────────────────────────────────────────────

function seeded(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
const _rng = seeded(42);
const STARS = Array.from({ length: 220 }, () => ({
    cx: +(_rng() * 1200).toFixed(1),
    cy: +(_rng() * 800).toFixed(1),
    r: +(_rng() * 1.2 + 0.2).toFixed(1),
    op: +(_rng() * 0.30 + 0.05).toFixed(2),
}));

// ─── Ornamento SVG por localização ───────────────────────────────────────────

function LocationOrnament({ loc }) {
    if (loc.id === "sanctuary") {
        const pts = Array.from({ length: 12 }, (_, i) => {
            const a = (2 * Math.PI * i) / 12 - Math.PI / 2;
            return { x: 60 + 48 * Math.cos(a), y: 60 + 48 * Math.sin(a) };
        });
        return (
            <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, display: "block", margin: "0 auto 12px" }}>
                <circle cx="60" cy="60" r="48" fill="none" stroke={loc.color} strokeWidth="0.8" opacity="0.3" strokeDasharray="4 5" />
                <circle cx="60" cy="60" r="28" fill="none" stroke={loc.color} strokeWidth="0.5" opacity="0.2" />
                {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={loc.color} opacity="0.7" />)}
                {pts.map((p, i) => <line key={i} x1={p.x} y1={p.y} x2="60" y2="60" stroke={loc.color} strokeWidth="0.4" opacity="0.15" />)}
                <circle cx="60" cy="60" r="8" fill={loc.color} opacity="0.25" />
                <circle cx="60" cy="60" r="4" fill={loc.color} opacity="0.6" />
            </svg>
        );
    }
    if (loc.id === "asgard") {
        const cx = 60, cy = 60;
        return (
            <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, display: "block", margin: "0 auto 12px" }}>
                <circle cx={cx} cy={cy} r="50" fill="none" stroke={loc.color} strokeWidth="0.6" opacity="0.2" strokeDasharray="6 6" />
                {[0, 120, 240].map((deg, i) => {
                    const rad = (deg - 90) * Math.PI / 180;
                    const tx = cx + 16 * Math.cos(rad), ty = cy + 16 * Math.sin(rad);
                    const pts = Array.from({ length: 3 }, (_, j) => {
                        const a = rad + (2 * Math.PI * j) / 3;
                        return `${tx + 22 * Math.cos(a)},${ty + 22 * Math.sin(a)}`;
                    }).join(" ");
                    return <polygon key={i} points={pts} fill="none" stroke={loc.color} strokeWidth="1.8" opacity="0.55" />;
                })}
                <circle cx={cx} cy={cy} r="5" fill={loc.color} opacity="0.4" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, display: "block", margin: "0 auto 12px" }}>
            {[22, 34, 46, 56].map((r, i) => (
                <circle key={i} cx="60" cy="60" r={r} fill="none"
                    stroke={loc.color} strokeWidth="1.2" opacity={0.5 - i * 0.1}
                    strokeDasharray={i % 2 === 0 ? "none" : "4 4"} />
            ))}
            <line x1="60" y1="30" x2="60" y2="80" stroke={loc.color} strokeWidth="2.5" opacity="0.6" />
            <line x1="52" y1="40" x2="52" y2="52" stroke={loc.color} strokeWidth="2" opacity="0.5" />
            <line x1="68" y1="40" x2="68" y2="52" stroke={loc.color} strokeWidth="2" opacity="0.5" />
            <line x1="44" y1="40" x2="76" y2="40" stroke={loc.color} strokeWidth="1.5" opacity="0.3" />
        </svg>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function LocationCard({ loc, onSelect }) {
    const [hovered, setHovered] = useState(false);
    const { lang } = useLanguage();
    const tl = T[lang].location;
    const tloc = tl.locs[loc.id] ?? {};
    const locked = !loc.available;
    const unitKey = loc.houseCount === 12 ? 12 : 7;
    const unit = tl.units[unitKey] ?? "etapas";

    return (
        <div
            style={{
                ...S.card,
                borderColor: hovered && !locked ? loc.color : locked ? "#1a2a3a" : "#1e3040",
                opacity: locked ? 0.55 : 1,
                cursor: locked ? "not-allowed" : "pointer",
                boxShadow: hovered && !locked ? `0 0 28px ${loc.color}28, inset 0 0 20px ${loc.color}08` : "none",
                transform: hovered && !locked ? "translateY(-4px)" : "none",
                transition: "all 0.22s ease",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => !locked && onSelect(loc.id)}
        >
            <div style={{
                height: "2px",
                background: locked ? "#1e3040" : loc.color,
                opacity: locked ? 0.3 : (hovered ? 1 : 0.5),
                transition: "opacity 0.2s",
                borderRadius: "2px 2px 0 0",
                marginBottom: "20px",
            }} />

            {locked && <div style={S.badge}>{tl.comingSoon}</div>}

            <LocationOrnament loc={loc} />

            <h2 style={{ ...S.cardName, color: locked ? "#2a4a5a" : loc.color }}>
                {tloc.name ?? loc.name}
            </h2>
            <p style={{ ...S.cardSub, color: locked ? "#1e3040" : "#4a7a9a" }}>
                {tloc.subtitle ?? loc.subtitle}
            </p>

            <div style={{ height: "1px", background: locked ? "#0e1e2e" : "#1a2a3a", margin: "12px 0" }} />

            <p style={{ ...S.cardDesc, color: locked ? "#1a2e3e" : "#5a8aa0" }}>
                {tloc.description ?? loc.description}
            </p>

            <p style={{ ...S.cardHouses, color: locked ? "#1a2a3a" : loc.color + "99" }}>
                {loc.houseCount} {unit}
            </p>

            {!locked && (
                <button style={{
                    ...S.btn,
                    borderColor: hovered ? loc.color : "#1e3040",
                    color: hovered ? loc.color : "#2a5a70",
                    background: hovered ? `${loc.color}12` : "transparent",
                    transition: "all 0.2s",
                }}>
                    {tl.startBtn}
                </button>
            )}
        </div>
    );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function LocationSelect({ onSelect, onBack }) {
    const { lang } = useLanguage();
    const tl = T[lang].location;

    return (
        <div style={S.outer}>

            <svg
                style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
                viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
            >
                <rect width="1200" height="800" fill="#050b14" />
                {STARS.map((s, i) => (
                    <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                ))}
            </svg>

            <div style={S.page}>
                <div style={S.header}>
                    <p style={S.eyebrow}>{tl.eyebrow}</p>
                    <h1 style={S.title}>{tl.title}</h1>
                    <p style={S.sub}>{tl.sub}</p>
                </div>

                <div style={S.cards}>
                    {LOCATIONS.map(loc => (
                        <LocationCard key={loc.id} loc={loc} onSelect={onSelect} />
                    ))}
                </div>

                {onBack && (
                    <div style={{ textAlign: "center", padding: "20px 0 32px" }}>
                        <button style={S.backBtn} onClick={onBack}>{tl.back}</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const S = {
    outer: {
        background: "#050b14",
        minHeight: "100vh",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#c0d8f0",
        position: "relative",
    },
    page: {
        position: "relative",
        zIndex: 1,
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "0 20px",
    },
    header: {
        textAlign: "center",
        padding: "52px 20px 36px",
    },
    eyebrow: {
        fontSize: "11px",
        letterSpacing: "6px",
        color: "#2a5a7a",
        fontFamily: "'Cinzel', serif",
        marginBottom: "10px",
    },
    title: {
        fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
        color: "#c8a800",
        fontFamily: "'Cinzel', serif",
        fontWeight: "700",
        letterSpacing: "5px",
        margin: "0 0 12px",
    },
    sub: {
        fontSize: "19px",
        color: "#4a7a9a",
        fontStyle: "italic",
    },
    cards: {
        display: "flex",
        gap: "24px",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingBottom: "16px",
    },
    card: {
        width: "300px",
        background: "linear-gradient(180deg, #080f18 0%, #050b14 100%)",
        border: "1px solid",
        borderRadius: "6px",
        padding: "0 22px 22px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        userSelect: "none",
    },
    badge: {
        position: "absolute",
        top: "16px",
        right: "14px",
        fontSize: "9px",
        letterSpacing: "3px",
        color: "#1e3a50",
        fontFamily: "'Cinzel', serif",
        border: "1px solid #1e3040",
        padding: "3px 8px",
        borderRadius: "99px",
    },
    cardName: {
        fontSize: "20px",
        fontFamily: "'Cinzel', serif",
        fontWeight: "700",
        letterSpacing: "2px",
        margin: "0 0 6px",
    },
    cardSub: {
        fontSize: "12px",
        letterSpacing: "2px",
        textTransform: "uppercase",
        margin: "0",
    },
    cardDesc: {
        fontSize: "16px",
        lineHeight: "1.7",
        fontStyle: "italic",
        margin: "0 0 10px",
        flex: 1,
    },
    cardHouses: {
        fontSize: "12px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
        margin: "0 0 16px",
    },
    btn: {
        background: "transparent",
        border: "1px solid",
        padding: "10px 24px",
        borderRadius: "4px",
        fontFamily: "'Cinzel', serif",
        fontSize: "12px",
        fontWeight: "700",
        letterSpacing: "2px",
        cursor: "pointer",
        width: "100%",
    },
    backBtn: {
        background: "transparent",
        border: "none",
        color: "#2a4a5a",
        fontFamily: "'Cinzel', serif",
        fontSize: "12px",
        letterSpacing: "3px",
        cursor: "pointer",
        padding: "8px 16px",
    },
};
