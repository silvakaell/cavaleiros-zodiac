// Result.jsx
// Tela de resultado final da run.

import { useState } from "react";
import { calcScore } from "../game/battleEngine";
import { useLanguage } from "../i18n/LanguageContext";
import { T } from "../i18n/translations";

// Cores dos deuses (estrutura visual local — nomes vêm das traduções)
const GOD_COLORS = {
    atena: "#5a9de0",
    hades: "#9b59b6",
    poseidon: "#1abc9c",
    marte: "#e74c3c",
    apolo: "#e8a020",
    chronos: "#8ea8b8",
    artemis: "#d4a820",
    odin: "#78c4d8",
    renegado: "#8a6a4a",
};

// Posições no mapa (viewBox 1100×500) — sem name, vem de T[lang].houses
const HOUSE_POS = [
    { cx: 1030, cy: 460 },
    { cx: 880, cy: 392 },
    { cx: 952, cy: 303 },
    { cx: 778, cy: 262 },
    { cx: 604, cy: 300 },
    { cx: 682, cy: 212 },
    { cx: 872, cy: 178 },
    { cx: 802, cy: 108 },
    { cx: 612, cy: 133 },
    { cx: 428, cy: 97 },
    { cx: 272, cy: 138 },
    { cx: 115, cy: 88 },
];

const MAP_PATH = HOUSE_POS.map(p => `${p.cx},${p.cy}`).join(" ");

// ─── Starfield ────────────────────────────────────────────────────────────────

function seededRng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const _rngMap = seededRng(99);
const _rngConst = seededRng(77);

const STARS_MAP = Array.from({ length: 180 }, () => ({
    cx: +(_rngMap() * 1100).toFixed(1),
    cy: +(_rngMap() * 500).toFixed(1),
    r: +(_rngMap() * 1.1 + 0.3).toFixed(1),
    op: +(_rngMap() * 0.28 + 0.06).toFixed(2),
}));

const STARS_CONST = Array.from({ length: 60 }, () => ({
    cx: +(_rngConst() * 200).toFixed(1),
    cy: +(_rngConst() * 200).toFixed(1),
    r: +(_rngConst() * 0.9 + 0.3).toFixed(1),
    op: +(_rngConst() * 0.20 + 0.06).toFixed(2),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function knightPositions(count) {
    if (count === 0) return [];
    const cx = 100, cy = 100, r = 62;
    return Array.from({ length: count }, (_, i) => {
        const angle = -Math.PI / 2 + (2 * Math.PI * i / count);
        return {
            x: +(cx + r * Math.cos(angle)).toFixed(1),
            y: +(cy + r * Math.sin(angle)).toFixed(1),
        };
    });
}

function houseStyle(i, history) {
    if (i >= history.length) {
        return { stroke: "#1e3a50", fill: "#080e18", dot: "#1e3a50", r: 11, op: 0.45 };
    }
    const h = history[i];
    if (h.passed && h.easterEggTriggered) {
        return { stroke: "#c8a800", fill: "#1a1400", dot: "#c8a800", r: 13, op: 1 };
    }
    if (h.passed) {
        return { stroke: "#3a8040", fill: "#091a0e", dot: "#4aaa50", r: 13, op: 1 };
    }
    return { stroke: "#7a2020", fill: "#1a0808", dot: "#cc3030", r: 13, op: 1 };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Result({ history, survivors, fallen, fallenHouses = {}, godId, onRestart, onRetry }) {

    const { lang } = useLanguage();
    const tr = T[lang].result;
    const houseNames = T[lang].houses;   // 12 signos traduzidos
    const f = T[lang].footer;
    const kName = (k) => lang === 'en' && k.nameEn ? k.nameEn : k.name;
    const kShort = (k) => { const n = kName(k); const p = n.split(" "); return lang === 'en' ? p[p.length - 1] : p[0]; };

    const [hoveredHouse, setHoveredHouse] = useState(null);

    const easterEggsFound = history.filter(r => r.easterEggTriggered).length;
    const score = calcScore(history, survivors.length, easterEggsFound);

    const godColor = GOD_COLORS[godId] ?? GOD_COLORS.atena;
    const godName = T[lang].god.gods[godId]?.name ?? T[lang].god.gods.atena.name;

    const allKnights = [...survivors, ...fallen];
    const positions = knightPositions(allKnights.length);

    const fallenInHouse = { ...fallenHouses };
    if (Object.keys(fallenInHouse).length === 0) {
        history.forEach((h, i) => {
            if (h.fallenKnight) fallenInHouse[h.fallenKnight.id] = i;
        });
    }

    const fallenByHouse = {};
    fallen.forEach(k => {
        const idx = fallenInHouse[k.id];
        if (idx !== undefined) {
            if (!fallenByHouse[idx]) fallenByHouse[idx] = [];
            fallenByHouse[idx].push(k);
        }
    });

    function getFinalMessage() {
        const h = score.housesPassed;
        const completed = history.length === 12;
        const m = tr.messages;

        if (completed && h === 12) return m.perfect;
        if (completed && h >= 9) return m.great;
        if (completed && h >= 6) return m.good;
        if (completed) return m.complete;

        if (h >= 10) return m.almostThere;
        if (h >= 7) return m.epic;
        if (h >= 4) return m.halfway;
        if (h >= 1) return m.brave;
        return m.brutal;
    }

    return (
        <div style={S.outer}>
            <div style={S.page}>

                {/* ── Cabeçalho ── */}
                <div style={S.header}>
                    <h1 style={S.title}>{tr.title}</h1>
                    <p style={S.message}>{getFinalMessage()}</p>
                    <p style={S.godLabel}>
                        {tr.blessing} <span style={{ color: godColor }}>{godName}</span>
                    </p>
                </div>

                {/* ── Visual: constelação + mapa ── */}
                <div style={S.visual}>

                    {/* Constelação */}
                    <div style={S.constCol}>
                        <p style={S.secLabel}>{tr.constellation.title}</p>
                        <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: "200px", display: "block", margin: "0 auto" }}>
                            <rect width="200" height="200" fill="#050b14" />

                            {STARS_CONST.map((s, i) => (
                                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                            ))}

                            {allKnights.map((k, i) => {
                                const a = positions[i];
                                const b = positions[(i + 1) % allKnights.length];
                                const aAlive = survivors.some(s => s.id === k.id);
                                const bAlive = survivors.some(s => s.id === allKnights[(i + 1) % allKnights.length].id);
                                return (
                                    <line key={i}
                                        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                        stroke={aAlive && bAlive ? "#1a3a2a" : "#2a1a1a"}
                                        strokeWidth="1" strokeDasharray="3 4" opacity="0.6"
                                    />
                                );
                            })}

                            {allKnights.map((k, i) => {
                                const pos = positions[i];
                                const alive = survivors.some(s => s.id === k.id);
                                const firstName = kShort(k);
                                const houseIdx = fallenInHouse[k.id];
                                const houseName = houseIdx !== undefined ? houseNames[houseIdx] : null;
                                return (
                                    <g key={k.id} transform={`translate(${pos.x},${pos.y})`}>
                                        {alive ? (
                                            <>
                                                <circle r="11" fill="#08141a" stroke="#3a8040" strokeWidth="1.5" />
                                                <circle r="4.5" fill="#4aaa50" opacity="0.8" />
                                                <circle r="2" fill="#4aaa50" opacity="0.35" cx="-12" cy="-10" />
                                                <circle r="1.5" fill="#4aaa50" opacity="0.28" cx="12" cy="-8" />
                                            </>
                                        ) : (
                                            <>
                                                <circle r="11" fill="#0e0808" stroke="#7a2020" strokeWidth="1.5" opacity="0.8" />
                                                <circle r="4" fill="#331010" opacity="0.7" />
                                                <line x1="-6" y1="-6" x2="6" y2="6" stroke="#7a2020" strokeWidth="1.5" opacity="0.8" />
                                                <line x1="6" y1="-6" x2="-6" y2="6" stroke="#7a2020" strokeWidth="1.5" opacity="0.8" />
                                            </>
                                        )}
                                        <text y="20" textAnchor="middle"
                                            fill={alive ? "#2a5a30" : "#5a2020"}
                                            fontSize="10" fontFamily="Georgia, serif"
                                        >
                                            {firstName}
                                        </text>
                                        {!alive && houseName && (
                                            <text y="31" textAnchor="middle"
                                                fill="#3a1414"
                                                fontSize="8" fontFamily="Georgia, serif"
                                            >
                                                {houseName}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Legenda */}
                            <circle cx="20" cy="193" r="5" fill="#08141a" stroke="#3a8040" strokeWidth="1.2" />
                            <circle cx="20" cy="193" r="2" fill="#4aaa50" opacity="0.8" />
                            <text x="29" y="197" fill="#1a4a28" fontSize="9" fontFamily="Georgia, serif">{tr.constellation.alive}</text>
                            <circle cx="65" cy="193" r="5" fill="#0e0808" stroke="#7a2020" strokeWidth="1.2" opacity="0.8" />
                            <line x1="61" y1="189" x2="69" y2="197" stroke="#7a2020" strokeWidth="1.2" opacity="0.8" />
                            <line x1="69" y1="189" x2="61" y2="197" stroke="#7a2020" strokeWidth="1.2" opacity="0.8" />
                            <text x="74" y="197" fill="#4a1818" fontSize="9" fontFamily="Georgia, serif">{tr.constellation.fallen}</text>
                        </svg>

                        {fallen.length > 0 && (
                            <div style={S.fallenList}>
                                <p style={S.fallenListTitle}>{tr.constellation.fallenList}</p>
                                {fallen.map(k => {
                                    const houseIdx = fallenInHouse[k.id];
                                    const houseName = houseIdx !== undefined ? houseNames[houseIdx] : "—";
                                    return (
                                        <div key={k.id} style={S.fallenRow}>
                                            <span style={S.fallenName}>{kShort(k)}</span>
                                            <span style={S.fallenHouse}>{houseName}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Mapa das 12 casas */}
                    <div style={S.mapCol}>
                        <svg viewBox="0 0 1100 500" style={{ width: "100%", display: "block" }}>
                            <rect width="1100" height="500" fill="#050b14" />

                            <defs>
                                <radialGradient id="rnb" cx="50%" cy="50%">
                                    <stop offset="0%" stopColor="#2010a0" stopOpacity="0.08" />
                                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
                                </radialGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <ellipse cx="600" cy="250" rx="500" ry="230" fill="url(#rnb)" />

                            {STARS_MAP.map((s, i) => (
                                <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                            ))}

                            <polyline
                                points={MAP_PATH}
                                fill="none" stroke="#1a3248" strokeWidth="1.5"
                                strokeDasharray="6 5" opacity="0.5"
                            />

                            {HOUSE_POS.map((pos, i) => {
                                const hs = houseStyle(i, history);
                                const isEgg = i < history.length && history[i].passed && history[i].easterEggTriggered;
                                const isHover = hoveredHouse === i;

                                const tipAbove = pos.cy > 380;
                                const tipOffset = hs.r + 10;
                                const tipY = tipAbove ? -tipOffset - 18 : tipOffset;
                                const textY = tipAbove ? -tipOffset - 5 : tipOffset + 13;

                                return (
                                    <g
                                        key={i}
                                        transform={`translate(${pos.cx},${pos.cy})`}
                                        opacity={hs.op}
                                        onMouseEnter={() => setHoveredHouse(i)}
                                        onMouseLeave={() => setHoveredHouse(null)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {isHover && (
                                            <circle r={hs.r + 8} fill={hs.dot} opacity="0.15" filter="url(#glow)" />
                                        )}
                                        <circle
                                            r={isHover ? hs.r + 2 : hs.r}
                                            fill={hs.fill}
                                            stroke={hs.stroke}
                                            strokeWidth={isHover ? 2.2 : 1.5}
                                        />
                                        <circle r={hs.r === 13 ? 5 : 4} fill={hs.dot} opacity="0.8" />
                                        {isEgg && (
                                            <text y={-hs.r - 4} textAnchor="middle" fill="#c8a800" fontSize="11" fontFamily="Georgia, serif">✦</text>
                                        )}

                                        {isHover && (
                                            <g>
                                                <rect
                                                    x="-42" y={tipY}
                                                    width="84" height="20"
                                                    rx="4"
                                                    fill="#050b14"
                                                    stroke={hs.stroke}
                                                    strokeWidth="0.8"
                                                    opacity="0.92"
                                                />
                                                <text
                                                    x="0" y={textY}
                                                    textAnchor="middle"
                                                    fill="#b0cce0"
                                                    fontSize="13"
                                                    fontFamily="Georgia, serif"
                                                    fontStyle="italic"
                                                >
                                                    {houseNames[i]}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                );
                            })}

                            {/* Labels extremos */}
                            <text x="1030" y="484" textAnchor="middle" fill="#2a5a30" fontSize="13" fontFamily="Georgia, serif">
                                {houseNames[0]}
                            </text>
                            <text x="115" y="72" textAnchor="middle" fill="#1e3a5a" fontSize="13" fontFamily="Georgia, serif">
                                {houseNames[11]}
                            </text>

                            {/* Legenda */}
                            <g transform="translate(0,456)">
                                <circle cx="20" cy="24" r="6" fill="#091a0e" stroke="#3a8040" strokeWidth="1.2" />
                                <circle cx="20" cy="24" r="2.5" fill="#4aaa50" opacity="0.8" />
                                <text x="30" y="28" fill="#1a5028" fontSize="10" fontFamily="Georgia, serif">{tr.map.passed}</text>

                                <circle cx="96" cy="24" r="6" fill="#1a0808" stroke="#7a2020" strokeWidth="1.2" />
                                <circle cx="96" cy="24" r="2.5" fill="#cc3030" opacity="0.8" />
                                <text x="106" y="28" fill="#5a1818" fontSize="10" fontFamily="Georgia, serif">{tr.map.failed}</text>

                                <circle cx="162" cy="24" r="6" fill="#1a1400" stroke="#c8a800" strokeWidth="1.2" />
                                <circle cx="162" cy="24" r="2.5" fill="#c8a800" opacity="0.9" />
                                <text x="172" y="28" fill="#6a5010" fontSize="10" fontFamily="Georgia, serif">{tr.map.special}</text>

                                <circle cx="282" cy="24" r="6" fill="#080e18" stroke="#1e3a50" strokeWidth="1" opacity="0.5" />
                                <circle cx="282" cy="24" r="2.5" fill="#1e3a50" opacity="0.4" />
                                <text x="292" y="28" fill="#1a3040" fontSize="10" fontFamily="Georgia, serif">{tr.map.notReached}</text>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* ── Placar ── */}
                <div style={S.scoreWrap}>
                    <div style={S.scoreMain}>
                        <p style={S.scoreLbl}>{tr.score.title}</p>
                        <p style={S.scoreNum}>{score.total} {tr.score.pts}</p>
                    </div>
                    <div style={S.breakdown}>
                        <div style={S.bRow}>
                            <span style={S.bLabel}>{tr.score.houses}</span>
                            <span style={S.bVal}>{score.housesPassed} / 12 {tr.score.arrow} {score.housePoints} {tr.score.pts}</span>
                        </div>
                        <div style={S.bRow}>
                            <span style={S.bLabel}>{tr.score.survivors}</span>
                            <span style={S.bVal}>{score.survivors} {tr.score.arrow} {score.survivorPoints} {tr.score.pts}</span>
                        </div>
                        <div style={{ ...S.bRow, borderBottom: "none", paddingBottom: 0 }}>
                            <span style={S.bLabel}>{tr.score.special}</span>
                            <span style={S.bVal}>{score.easterEggsFound} {tr.score.arrow} {score.eggPoints} {tr.score.pts}</span>
                        </div>
                    </div>
                </div>

                {/* ── Histórico ── */}
                <div style={S.hist}>
                    <div style={S.histGrid}>
                        {history.map((r, i) => (
                            <div key={i} style={{
                                ...S.hCell,
                                borderRight: (i + 1) % 3 !== 0 ? "1px solid #0a141e" : "none",
                            }}>
                                <span style={{ color: r.passed ? "#4CAF50" : "#f44336", fontSize: "13px", flexShrink: 0 }}>
                                    {r.passed ? "✔" : "✖"}
                                </span>
                                <span style={S.hName}>{houseNames[i]}</span>
                                <span style={S.hChance}>{r.passChance}%</span>
                                {r.easterEggTriggered && (
                                    <span style={S.eggTag}>{tr.history.egg}</span>
                                )}
                                {(fallenByHouse[i] ?? []).map(k => (
                                    <span key={k.id} style={S.fallenTag}>💀 {kName(k)}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Botões ── */}
                <div style={S.btnRow}>
                    <button style={S.btnSec} onClick={onRetry}>{tr.buttons.retry}</button>
                    <button style={S.btnPri} onClick={onRestart}>{tr.buttons.restart}</button>
                </div>

            </div>

            {/* ── Rodapé ── */}
            <footer style={S.footer}>
                <span style={S.ftText}>{f.creator}</span>
                <span style={S.ftText}>{f.game}</span>
                <span style={S.ftText}>{f.copyright}</span>
            </footer>
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
        display: "flex",
        flexDirection: "column",
    },
    page: {
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    header: {
        textAlign: "center",
        padding: "28px 20px 16px",
    },
    title: {
        fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
        color: "#c8a800",
        fontWeight: "700",
        marginBottom: "8px",
        letterSpacing: "4px",
        fontFamily: "'Cinzel', serif",
    },
    message: {
        fontSize: "22px",
        color: "#7ab8d4",
        fontStyle: "italic",
        marginBottom: "6px",
    },
    godLabel: {
        fontSize: "18px",
        color: "#7ab8d4",
    },
    visual: {
        display: "flex",
        borderTop: "1px solid #1a2a3a",
        borderBottom: "1px solid #1a2a3a",
    },
    constCol: {
        width: "220px",
        flexShrink: 0,
        borderRight: "1px solid #1a2a3a",
        padding: "14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    mapCol: { flex: 1, minWidth: 0 },
    secLabel: {
        fontSize: "12px",
        letterSpacing: "3px",
        color: "#4a8aaa",
        textTransform: "uppercase",
        textAlign: "center",
    },
    fallenList: {
        borderTop: "1px solid #1a2a3a",
        paddingTop: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },
    fallenListTitle: {
        fontSize: "10px",
        letterSpacing: "2px",
        color: "#4a2a2a",
        textTransform: "uppercase",
        marginBottom: "4px",
    },
    fallenRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "6px",
    },
    fallenName: { fontSize: "12px", color: "#5a2a2a", fontStyle: "italic" },
    fallenHouse: { fontSize: "10px", color: "#3a1818" },
    scoreWrap: {
        display: "flex",
        borderBottom: "1px solid #1a2a3a",
    },
    scoreMain: {
        width: "220px",
        flexShrink: 0,
        borderRight: "1px solid #1a2a3a",
        padding: "16px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    scoreLbl: {
        fontSize: "14px",
        letterSpacing: "2px",
        color: "#7ab8d4",
        textTransform: "uppercase",
    },
    scoreNum: {
        fontSize: "2.6rem",
        color: "#fff",
        margin: "4px 0 0",
    },
    breakdown: {
        flex: 1,
        padding: "14px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "0",
    },
    bRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "15px",
        color: "#7ab8d4",
        borderBottom: "1px solid #0e1a26",
        padding: "9px 0",
    },
    bLabel: { color: "#7ab8d4" },
    bVal: { color: "#7ab8d4" },
    hist: {
        padding: "14px 20px",
        borderBottom: "1px solid #1a2a3a",
    },
    histGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
    },
    hCell: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 10px",
        borderBottom: "1px solid #0a141e",
        fontSize: "13px",
        flexWrap: "wrap",
    },
    hName: { color: "#7ab8d4", minWidth: "80px", fontStyle: "italic", fontSize: "17px" },
    hChance: { color: "#7ab8d4", fontSize: "15px" },
    eggTag: { color: "#c8a800", fontSize: "13px" },
    fallenTag: { color: "#cc3030", fontSize: "13px" },
    btnRow: {
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        padding: "20px",
        flexWrap: "wrap",
    },
    btnPri: {
        background: "#c8a800",
        color: "#000",
        border: "none",
        padding: "14px 44px",
        borderRadius: "5px",
        fontFamily: "'Cinzel', serif",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "2px",
    },
    btnSec: {
        background: "transparent",
        color: "#c8a800",
        border: "2px solid #c8a800",
        padding: "14px 44px",
        borderRadius: "5px",
        fontFamily: "'Cinzel', serif",
        fontSize: "15px",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "2px",
    },
    footer: {
        borderTop: "1px solid #0e1a26",
        padding: "8px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
    },
    ftText: {
        fontSize: "9px",
        color: "#0e1a26",
        letterSpacing: ".5px",
    },
};
