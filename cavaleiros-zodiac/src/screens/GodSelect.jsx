// GodSelect.jsx
// 8 deuses em anel octagonal + "Sem Divindade" abaixo, fora do anel.

import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { T } from "../i18n/translations";

// ─── Starfield ────────────────────────────────────────────────────────────────

function seededRng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const _rng = seededRng(137);
const STARS = Array.from({ length: 200 }, () => ({
    cx: +(_rng() * 1000).toFixed(1),
    cy: +(_rng() * 500).toFixed(1),
    r: +(_rng() * 1.2 + 0.3).toFixed(1),
    op: +(_rng() * 0.28 + 0.06).toFixed(2),
}));

// ─── IDs dos deuses e posições (independentes de idioma) ──────────────────────

const GOD_IDS = ["atena", "hades", "poseidon", "marte", "apolo", "chronos", "artemis", "odin", "renegado"];

const GOD_META = {
    atena: { color: "#5a9de0", lx: 50, ly: 7 },
    hades: { color: "#9b59b6", lx: 78, ly: 18 },
    poseidon: { color: "#1abc9c", lx: 91, ly: 47 },
    marte: { color: "#e74c3c", lx: 78, ly: 72 },
    apolo: { color: "#e8a020", lx: 50, ly: 82 },
    chronos: { color: "#8ea8b8", lx: 22, ly: 72 },
    artemis: { color: "#d4a820", lx: 9, ly: 47 },
    odin: { color: "#78c4d8", lx: 22, ly: 18 },
    renegado: { color: "#8a6a4a", lx: 50, ly: 95 },
};

const SXY = {
    atena: [500, 35],
    hades: [780, 90],
    poseidon: [910, 235],
    marte: [780, 360],
    apolo: [500, 410],
    chronos: [220, 360],
    artemis: [90, 235],
    odin: [220, 90],
    renegado: [500, 475],
};

const RING = ["atena", "hades", "poseidon", "marte", "apolo", "chronos", "artemis", "odin"];
const DIAG = [
    ["atena", "poseidon"],
    ["hades", "apolo"],
    ["poseidon", "odin"],
    ["marte", "artemis"],
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function GodSelect({ onSelect, onBack }) {
    const [sel, setSel] = useState(null);
    const [hov, setHov] = useState(null);

    const { lang } = useLanguage();
    const tg = T[lang].god;
    const f = T[lang].footer;

    const godData = (id) => ({ ...GOD_META[id], ...tg.gods[id], id });
    const god = sel ? godData(sel) : null;

    const lines = [
        ...RING.map((id, i) => [id, RING[(i + 1) % RING.length]]),
        ...DIAG,
    ];

    return (
        <div style={S.outer}>

            {/* ── Header ── */}
            <div style={S.header}>
                <p style={S.sup}>{tg.eyebrow}</p>
                <h1 style={S.title}>{tg.title}</h1>
                <p style={S.sub}>{tg.sub}</p>
            </div>

            {/* ── Constellation area ── */}
            <div style={S.area}>

                <svg style={S.bgSvg} viewBox="0 0 1000 500" preserveAspectRatio="none">
                    <defs>
                        <radialGradient id="gnb1" cx="50%" cy="50%">
                            <stop offset="0%" stopColor="#2810a0" stopOpacity="0.10" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="gnb2" cx="50%" cy="50%">
                            <stop offset="0%" stopColor="#102080" stopOpacity="0.07" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <ellipse cx="500" cy="250" rx="400" ry="200" fill="url(#gnb1)" />
                    <ellipse cx="200" cy="370" rx="200" ry="130" fill="url(#gnb2)" />

                    {STARS.map((s, i) => (
                        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                    ))}

                    {lines.map(([a, b], i) => {
                        const [x1, y1] = SXY[a];
                        const [x2, y2] = SXY[b];
                        const active = sel && (sel === a || sel === b);
                        return (
                            <line key={i}
                                x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke={active ? "#1a3a5a" : "#09151f"}
                                strokeWidth={active ? 1.5 : 1}
                                strokeDasharray="5 5"
                                opacity={active ? 0.9 : 0.5}
                            />
                        );
                    })}
                </svg>

                {/* Floating center info */}
                <div style={{ ...S.center, pointerEvents: sel ? "auto" : "none" }}>
                    {!god ? (
                        <p style={S.hint}>{tg.hint}</p>
                    ) : (
                        <>
                            <p style={{ ...S.godName, color: god.color }}>{god.name}</p>
                            <p style={S.desc}>{god.desc}</p>
                            <div style={S.rows}>
                                {god.pros.map((p, i) => <div key={i} style={S.pro}>+ {p}</div>)}
                                {god.cons.map((c, i) => <div key={i} style={S.con}>− {c}</div>)}
                            </div>
                            <button style={{ ...S.btn, background: god.color }} onClick={() => onSelect(sel)}>
                                {tg.confirm}
                            </button>
                        </>
                    )}
                </div>

                {/* God nodes */}
                {GOD_IDS.map(id => {
                    const g = godData(id);
                    const active = sel === id;
                    const hovered = hov === id;
                    const sz = active ? 22 : 15;
                    const coreSz = active ? 7 : 4;
                    return (
                        <div
                            key={id}
                            style={{
                                ...S.node,
                                left: g.lx + "%",
                                top: g.ly + "%",
                                filter: hovered && !active ? "brightness(1.6)" : "none",
                            }}
                            onClick={() => setSel(id === sel ? null : id)}
                            onMouseEnter={() => setHov(id)}
                            onMouseLeave={() => setHov(null)}
                        >
                            <div style={{
                                ...S.dot,
                                width: sz,
                                height: sz,
                                borderColor: g.color,
                                background: active ? g.color + "22" : "#06091a",
                            }}>
                                <div style={{ ...S.dotCore, width: coreSz, height: coreSz, background: g.color }} />
                                <div style={{ ...S.sat, top: -7, left: 2, width: 3, height: 3, background: g.color, opacity: 0.40 }} />
                                <div style={{ ...S.sat, bottom: -6, right: 0, width: 2, height: 2, background: g.color, opacity: 0.30 }} />
                                <div style={{ ...S.sat, top: 1, right: -8, width: 2, height: 2, background: g.color, opacity: 0.28 }} />
                            </div>
                            <span style={{ ...S.label, color: active ? g.color : "#4a7090" }}>
                                {g.short}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Botão voltar */}
            {onBack && (
                <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                    <button style={S.backBtn} onClick={onBack}>{tg.back}</button>
                </div>
            )}

            {/* ── Footer ── */}
            <footer style={S.footer}>
                <span style={S.footerText}>{f.creator}</span>
                <span style={S.footerText}>{f.game}</span>
                <span style={S.footerText}>{f.copyright}</span>
            </footer>
        </div>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const S = {
    outer: {
        background: "#06091a",
        minHeight: "100vh",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#c0d8f0",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        textAlign: "center",
        padding: "22px 20px 12px",
        flexShrink: 0,
    },
    sup: {
        fontSize: "13px",
        letterSpacing: "5px",
        color: "#1e2e3e",
        textTransform: "uppercase",
        display: "block",
        marginBottom: "22px",
        fontFamily: "'Cinzel', serif",
    },
    title: {
        fontSize: "clamp(2rem, 4vw, 3rem)",
        color: "#c8a800",
        letterSpacing: "8px",
        fontWeight: "700",
        lineHeight: "1.1",
        margin: "0 0 6px",
        fontFamily: "'Cinzel', serif",
    },
    sub: {
        fontSize: "20px",
        color: "#7ab8d4",
        fontStyle: "italic",
    },
    area: {
        flex: 1,
        position: "relative",
        maxWidth: "1000px",
        width: "100%",
        margin: "0 auto",
        minHeight: "500px",
    },
    bgSvg: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    },
    center: {
        position: "absolute",
        left: "50%",
        top: "43%",
        transform: "translate(-50%, -50%)",
        width: "200px",
        maxHeight: "260px",
        overflowY: "auto",
        textAlign: "center",
        zIndex: 5,
        msOverflowStyle: "none",
        scrollbarWidth: "none",
    },
    hint: {
        color: "#7ab8d4",
        fontSize: "15px",
        fontStyle: "italic",
        lineHeight: 1.8,
    },
    godName: {
        fontSize: "15px",
        letterSpacing: "0.5px",
        marginBottom: "4px",
    },
    desc: {
        fontSize: "13px",
        color: "#7ab8d4",
        lineHeight: 1.6,
        marginBottom: "6px",
    },
    rows: {
        fontSize: "13px",
        lineHeight: 1.85,
        marginBottom: "10px",
    },
    pro: { color: "#3a9a60", textAlign: "left" },
    con: { color: "#c04040", textAlign: "left" },
    btn: {
        color: "#000",
        border: "none",
        padding: "8px 20px",
        borderRadius: "4px",
        fontFamily: "'Cinzel', serif",
        fontSize: "12px",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "2px",
    },
    backBtn: {
        background: "none",
        border: "none",
        color: "#2a4a5a",
        fontFamily: "'Cinzel', serif",
        fontSize: "11px",
        letterSpacing: "2px",
        cursor: "pointer",
        padding: "6px 12px",
    },
    node: {
        position: "absolute",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        zIndex: 4,
        transition: "filter 0.2s",
    },
    dot: {
        borderRadius: "50%",
        border: "2px solid",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.25s",
        position: "relative",
    },
    dotCore: {
        borderRadius: "50%",
        transition: "all 0.25s",
    },
    sat: {
        position: "absolute",
        borderRadius: "50%",
    },
    label: {
        fontSize: "18px",
        whiteSpace: "nowrap",
        textAlign: "center",
        lineHeight: 1.3,
        transition: "color 0.25s",
        maxWidth: "100px",
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: "0.5px",
    },
    footer: {
        borderTop: "1px solid #0a1520",
        padding: "7px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        maxWidth: "1000px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
    },
    footerText: {
        fontSize: "9px",
        color: "#0e1a26",
        letterSpacing: "0.5px",
    },
};
