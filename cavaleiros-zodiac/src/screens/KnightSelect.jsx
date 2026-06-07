// KnightSelect.jsx
// Seleção de cavaleiros: tamanho do time → draft → constelação.

import { useState } from "react";
import knightsData from "../data/knights.json";
import { calcOverall, overallColor } from "../game/utils";
import { getPoolConfig } from "../game/godBonuses";
import { useLanguage } from "../i18n/LanguageContext";
import { T } from "../i18n/translations";

const POOL_SIZE = 4;
const BASE_EXCLUDED_RANKS = ["gold"];

const RANK_COLORS = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    black: "#9B59B6",
    god_warrior: "#4FC3F7",
    marina: "#00BCD4",
    ghost: "#78909C",
    odin_warrior: "#B0BEC5",
    corona: "#FF7043",
    fallen: "#E53935",
    heaven: "#FFF176",
};

// ─── Constelações — 3 cavaleiros ──────────────────────────────────────────────
const CONSTELLATIONS_3 = [
    { name: "Triângulo clássico", stars: [{ x: 380, y: 74 }, { x: 136, y: 252 }, { x: 624, y: 252 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Triângulo alto", stars: [{ x: 380, y: 71 }, { x: 218, y: 252 }, { x: 542, y: 252 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Triângulo obtuso", stars: [{ x: 100, y: 194 }, { x: 380, y: 80 }, { x: 660, y: 194 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Triângulo achatado", stars: [{ x: 111, y: 219 }, { x: 380, y: 102 }, { x: 649, y: 219 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Triângulo invertido", stars: [{ x: 141, y: 95 }, { x: 619, y: 95 }, { x: 380, y: 249 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Triângulo escaleno", stars: [{ x: 152, y: 240 }, { x: 294, y: 77 }, { x: 609, y: 194 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Triângulo assimétrico", stars: [{ x: 126, y: 240 }, { x: 243, y: 86 }, { x: 649, y: 209 }], lines: [[0, 1], [1, 2], [2, 0]] },
    { name: "Aglomerado", stars: [{ x: 279, y: 126 }, { x: 481, y: 126 }, { x: 380, y: 232 }], lines: [[0, 1], [1, 2], [2, 0]] },
];

// ─── Constelações — 4 cavaleiros ──────────────────────────────────────────────
const CONSTELLATIONS_4 = [
    { name: "Quadrado", stars: [{ x: 162, y: 83 }, { x: 598, y: 83 }, { x: 598, y: 237 }, { x: 162, y: 237 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]] },
    { name: "Diamante", stars: [{ x: 380, y: 71 }, { x: 624, y: 163 }, { x: 380, y: 256 }, { x: 136, y: 163 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
    { name: "Paralelogramo", stars: [{ x: 162, y: 240 }, { x: 314, y: 80 }, { x: 598, y: 80 }, { x: 446, y: 240 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]] },
    { name: "Trapézio", stars: [{ x: 202, y: 237 }, { x: 558, y: 237 }, { x: 497, y: 83 }, { x: 263, y: 83 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
    { name: "Losango assimétrico", stars: [{ x: 380, y: 74 }, { x: 609, y: 157 }, { x: 481, y: 252 }, { x: 162, y: 194 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
    { name: "Triângulo com centro", stars: [{ x: 380, y: 74 }, { x: 136, y: 249 }, { x: 624, y: 249 }, { x: 380, y: 182 }], lines: [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]] },
    { name: "Quadrado torto", stars: [{ x: 228, y: 83 }, { x: 548, y: 108 }, { x: 497, y: 240 }, { x: 162, y: 212 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]] },
    { name: "Quadrilátero irregular", stars: [{ x: 162, y: 108 }, { x: 558, y: 80 }, { x: 634, y: 225 }, { x: 202, y: 240 }], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
];

// ─── Constelações — 5 cavaleiros ──────────────────────────────────────────────
const CONSTELLATIONS_5 = [
    { name: "Pentágono", stars: [{ x: 380, y: 55 }, { x: 590, y: 130 }, { x: 520, y: 275 }, { x: 240, y: 275 }, { x: 170, y: 130 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 4]] },
    { name: "Cruz", stars: [{ x: 380, y: 50 }, { x: 625, y: 160 }, { x: 380, y: 270 }, { x: 135, y: 160 }, { x: 380, y: 160 }], lines: [[0, 4], [4, 2], [3, 4], [4, 1]] },
    { name: "Arco", stars: [{ x: 120, y: 255 }, { x: 265, y: 80 }, { x: 380, y: 50 }, { x: 495, y: 80 }, { x: 640, y: 255 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 3]] },
    { name: "Seta", stars: [{ x: 120, y: 160 }, { x: 310, y: 60 }, { x: 310, y: 260 }, { x: 545, y: 160 }, { x: 680, y: 160 }], lines: [[0, 3], [1, 3], [2, 3], [3, 4]] },
    { name: "Triângulo", stars: [{ x: 380, y: 50 }, { x: 150, y: 265 }, { x: 610, y: 265 }, { x: 280, y: 175 }, { x: 480, y: 175 }], lines: [[0, 1], [0, 2], [1, 2], [3, 4], [0, 3], [0, 4]] },
    { name: "Dispersão", stars: [{ x: 180, y: 65 }, { x: 570, y: 80 }, { x: 620, y: 245 }, { x: 200, y: 240 }, { x: 390, y: 155 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    { name: "Diagonal", stars: [{ x: 120, y: 265 }, { x: 245, y: 205 }, { x: 380, y: 155 }, { x: 515, y: 90 }, { x: 640, y: 45 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 3], [1, 4]] },
    { name: "W", stars: [{ x: 120, y: 65 }, { x: 280, y: 255 }, { x: 420, y: 110 }, { x: 560, y: 255 }, { x: 680, y: 65 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [2, 4]] },
    { name: "Gancho", stars: [{ x: 175, y: 55 }, { x: 175, y: 265 }, { x: 380, y: 265 }, { x: 580, y: 265 }, { x: 580, y: 90 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]] },
    { name: "Aglomerado", stars: [{ x: 340, y: 60 }, { x: 490, y: 60 }, { x: 570, y: 175 }, { x: 405, y: 265 }, { x: 225, y: 175 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 4]] },
    { name: "Cauda", stars: [{ x: 120, y: 160 }, { x: 295, y: 105 }, { x: 490, y: 60 }, { x: 560, y: 215 }, { x: 680, y: 155 }], lines: [[0, 1], [1, 2], [2, 4], [0, 3], [3, 4]] },
    { name: "Zig-zag", stars: [{ x: 120, y: 65 }, { x: 260, y: 245 }, { x: 380, y: 100 }, { x: 510, y: 255 }, { x: 660, y: 75 }], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 2], [2, 4]] },
];

const BACKGROUND_STARS = [
    { x: 60, y: 25 }, { x: 160, y: 15 }, { x: 280, y: 40 }, { x: 450, y: 18 }, { x: 600, y: 30 },
    { x: 700, y: 70 }, { x: 730, y: 170 }, { x: 710, y: 250 }, { x: 650, y: 305 }, { x: 430, y: 310 },
    { x: 130, y: 300 }, { x: 40, y: 210 }, { x: 25, y: 110 }, { x: 90, y: 190 }, { x: 310, y: 170 },
    { x: 220, y: 75 }, { x: 530, y: 195 }, { x: 670, y: 155 }, { x: 100, y: 265 }, { x: 350, y: 290 },
];

function getLayouts(teamSize) {
    if (teamSize === 3) return CONSTELLATIONS_3;
    if (teamSize === 4) return CONSTELLATIONS_4;
    return CONSTELLATIONS_5;
}

function randomLayout(teamSize) {
    const layouts = getLayouts(teamSize);
    return layouts[Math.floor(Math.random() * layouts.length)];
}

function generatePool(allKnights, alreadyPicked, godId) {
    const cfg = getPoolConfig(godId);
    const pickedIds = alreadyPicked.map(k => k.id);
    const excludedRanks = BASE_EXCLUDED_RANKS.filter(r => !cfg.allowRanks.includes(r));

    let eligible = allKnights.filter(k =>
        !excludedRanks.includes(k.rank) && !pickedIds.includes(k.id)
    );

    if (cfg.femaleOnly) {
        eligible = eligible.filter(k => cfg.femaleIds.includes(k.id));
    } else if (cfg.seriesOnly.length > 0) {
        eligible = eligible.filter(k => cfg.seriesOnly.includes(k.series));
    }

    const shuffled = [...eligible].sort(() => Math.random() - 0.5);

    if (cfg.preferSeries.length > 0) {
        const preferred = shuffled.filter(k => cfg.preferSeries.includes(k.series));
        const others = shuffled.filter(k => !cfg.preferSeries.includes(k.series));
        return [...preferred, ...others].slice(0, POOL_SIZE);
    }

    return shuffled.slice(0, POOL_SIZE);
}

// ─── Starfield para telas internas ───────────────────────────────────────────

function seededRng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
const _szRng = seededRng(213);
const SIZE_SCREEN_STARS = Array.from({ length: 200 }, () => ({
    cx: +(_szRng() * 1100).toFixed(1),
    cy: +(_szRng() * 700).toFixed(1),
    r: +(_szRng() * 1.1 + 0.3).toFixed(1),
    op: +(_szRng() * 0.26 + 0.05).toFixed(2),
}));

// Mini preview das constelações (viewBox 220×180)
const SIZE_PREVIEWS = {
    3: { stars: [[110, 28], [30, 158], [190, 158]], lines: [[0, 1], [1, 2], [2, 0]] },
    4: { stars: [[110, 20], [188, 90], [110, 162], [32, 90]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
    5: { stars: [[110, 18], [178, 68], [152, 152], [68, 152], [42, 68]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 4]] },
};

// ─── Tela de escolha do tamanho ──────────────────────────────────────────────

function SizeSelectionScreen({ onChoose, onBack }) {
    const [hovered, setHovered] = useState(null);
    const { lang } = useLanguage();
    const ts = T[lang].size;
    const f = T[lang].footer;

    return (
        <div style={sS.outer}>

            <svg style={sS.bgSvg} viewBox="0 0 1100 700" preserveAspectRatio="none">
                <defs>
                    <radialGradient id="sznb1" cx="50%" cy="40%">
                        <stop offset="0%" stopColor="#2010a0" stopOpacity="0.09" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="sznb2" cx="60%" cy="70%">
                        <stop offset="0%" stopColor="#102060" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <ellipse cx="550" cy="280" rx="500" ry="280" fill="url(#sznb1)" />
                <ellipse cx="700" cy="500" rx="320" ry="200" fill="url(#sznb2)" />
                {SIZE_SCREEN_STARS.map((s, i) => (
                    <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                ))}
            </svg>

            <div style={sS.header}>
                {onBack && (
                    <button style={sS.backBtn} onClick={onBack}>
                        {T[lang].god.back}
                    </button>
                )}
                <p style={sS.sup}>{ts.eyebrow}</p>
                <h1 style={sS.title}>{ts.title}</h1>
                <p style={sS.sub}>{ts.sub}</p>
            </div>

            <div style={sS.row}>
                {[3, 4, 5].map(n => {
                    const prev = SIZE_PREVIEWS[n];
                    const isHov = hovered === n;
                    return (
                        <div
                            key={n}
                            style={{
                                ...sS.card,
                                borderColor: isHov ? "#c8a800" : "#1a2a3a",
                                boxShadow: isHov ? "0 0 28px rgba(200,168,0,0.12), inset 0 0 20px rgba(200,168,0,0.03)" : "none",
                                background: isHov ? "linear-gradient(180deg, #0f0c00 0%, #060d17 100%)" : "#060d17",
                            }}
                            onClick={() => onChoose(n)}
                            onMouseEnter={() => setHovered(n)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <svg viewBox="0 0 220 180" width="100%" style={{ display: "block" }}>
                                <rect width="220" height="180" rx="6" fill="#040b14" />
                                {[[20, 18], [75, 10], [135, 22], [195, 14], [205, 85], [198, 148], [155, 168], [95, 172], [40, 160], [8, 110], [12, 55], [185, 50]].map(([x, y], i) => (
                                    <circle key={i} cx={x} cy={y} r="0.8" fill="#fff" opacity="0.14" />
                                ))}
                                {prev.lines.map(([a, b], i) => (
                                    <line key={i}
                                        x1={prev.stars[a][0]} y1={prev.stars[a][1]}
                                        x2={prev.stars[b][0]} y2={prev.stars[b][1]}
                                        stroke={isHov ? "#4a8faa" : "#1a3a50"} strokeWidth="1.2" opacity="0.8"
                                    />
                                ))}
                                {prev.stars.map(([x, y], i) => (
                                    <g key={i}>
                                        <circle cx={x} cy={y} r="14" fill={isHov ? "#0f1e00" : "#050e1a"}
                                            stroke={isHov ? "#c8a800" : "#2a5570"} strokeWidth="1.4" />
                                        <circle cx={x} cy={y} r="5.5" fill={isHov ? "#c8a800" : "#5ab0d0"} opacity="0.85" />
                                        <circle cx={x} cy={y} r="2" fill={isHov ? "#fff8d0" : "#a0d8f0"} opacity="0.9" />
                                    </g>
                                ))}
                            </svg>

                            <div style={sS.cardBody}>
                                <p style={{ ...sS.num, color: isHov ? "#c8a800" : "#7dcfee" }}>{n}</p>
                                <p style={sS.cardLabel}>{ts.unit}</p>
                                <p style={sS.cardDesc}>{ts.desc[n]}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <footer style={sS.footer}>
                <span style={sS.ftText}>{f.creator}</span>
                <span style={sS.ftText}>{f.game}</span>
                <span style={sS.ftText}>{f.copyright}</span>
            </footer>
        </div>
    );
}

// ─── Painel da constelação ────────────────────────────────────────────────────

function ConstellationBoard({ team, teamSize, layout }) {
    const { lang } = useLanguage();
    const td = T[lang].draft;
    const kName = (k) => lang === 'en' && k.nameEn ? k.nameEn : k.name;
    const filledCount = team.length;

    const label = filledCount === 0
        ? td.boardEmpty
        : filledCount < teamSize
            ? td.boardCount(filledCount, teamSize)
            : td.boardFull;

    return (
        <div style={board.wrapper}>
            <p style={board.label}>{label}</p>

            <svg viewBox="0 0 760 320" width="100%" style={{ display: "block", margin: "0 auto" }}>
                <defs>
                    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0d1a2a" />
                        <stop offset="100%" stopColor="#050c15" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                <rect x="0" y="0" width="760" height="320" rx="14" fill="url(#bgGrad)" />
                <rect x="0" y="0" width="760" height="320" rx="14" fill="none"
                    stroke="#1a2a3a" strokeWidth="1.5" />

                {BACKGROUND_STARS.map((s, i) => (
                    <circle key={i} cx={s.x} cy={s.y} r={0.8 + (i % 3) * 0.4}
                        fill="#ffffff" opacity={0.15 + (i % 4) * 0.07} />
                ))}

                {layout.lines.map(([a, b], i) => {
                    const aFilled = a < filledCount;
                    const bFilled = b < filledCount;
                    const both = aFilled && bFilled;
                    const one = aFilled || bFilled;
                    return (
                        <line key={i}
                            x1={layout.stars[a].x} y1={layout.stars[a].y}
                            x2={layout.stars[b].x} y2={layout.stars[b].y}
                            stroke={both ? "#4a7fa5" : one ? "#1e3a50" : "#0e1f2e"}
                            strokeWidth={both ? 1.2 : 0.7}
                            strokeDasharray={both ? "none" : "4 4"}
                            opacity={both ? 0.8 : 0.4}
                        />
                    );
                })}

                {layout.stars.map((pos, i) => {
                    const knight = team[i];
                    const isFilled = i < filledCount;
                    const rankColor = knight ? (RANK_COLORS[knight.rank] || "#aaa") : null;

                    return (
                        <g key={i}>
                            {isFilled && (
                                <circle cx={pos.x} cy={pos.y} r={18} fill={rankColor} opacity={0.12} />
                            )}
                            <circle
                                cx={pos.x} cy={pos.y}
                                r={isFilled ? 10 : 7}
                                fill={isFilled ? rankColor : "none"}
                                stroke={isFilled ? rankColor : "#2a3f55"}
                                strokeWidth={isFilled ? 0 : 1.2}
                                opacity={isFilled ? 1 : 0.6}
                                filter={isFilled ? "url(#glow)" : undefined}
                            />
                            {!isFilled && (
                                <circle cx={pos.x} cy={pos.y} r={1.5} fill="#2a3f55" opacity={0.8} />
                            )}
                            {isFilled && knight && (
                                <text x={pos.x} y={pos.y + 24} textAnchor="middle"
                                    fill={rankColor} fontSize="11" fontFamily="'Cormorant Garamond', Georgia, serif" opacity={0.95}>
                                    {kName(knight).length > 16 ? kName(knight).slice(0, 14) + "…" : kName(knight)}
                                </text>
                            )}
                            {!isFilled && (
                                <text x={pos.x} y={pos.y + 22} textAnchor="middle"
                                    fill="#2a4a60" fontSize="11" fontFamily="'Cormorant Garamond', Georgia, serif">
                                    {td.boardSlot(i + 1)}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function KnightSelect({ godId, onConfirm, onBack }) {
    const allKnights = knightsData.knights;
    const { lang } = useLanguage();
    const td = T[lang].draft;
    const kName = (k) => lang === 'en' && k.nameEn ? k.nameEn : k.name;

    const [teamSize, setTeamSize] = useState(null);
    const [layout, setLayout] = useState(null);
    const [team, setTeam] = useState([]);
    const [pool, setPool] = useState([]);

    function handleSizeChoice(size) {
        setTeamSize(size);
        setLayout(randomLayout(size));
        setPool(generatePool(allKnights, [], godId));
    }

    function handleBackToSize() {
        setTeamSize(null);
        setLayout(null);
        setTeam([]);
        setPool([]);
    }

    function handlePick(knight) {
        const newTeam = [...team, knight];
        setTeam(newTeam);
        if (newTeam.length < teamSize) {
            setPool(generatePool(allKnights, newTeam, godId));
        }
    }

    function handleConfirm() {
        onConfirm(team, layout, teamSize);
    }

    if (!teamSize) {
        return <SizeSelectionScreen onChoose={handleSizeChoice} onBack={onBack} />;
    }

    const pickCount = team.length;
    const isComplete = pickCount === teamSize;

    return (
        <div style={styles.page}>

            <svg style={styles.bgSvg} viewBox="0 0 1100 700" preserveAspectRatio="none">
                <defs>
                    <radialGradient id="ksnb1" cx="50%" cy="40%">
                        <stop offset="0%" stopColor="#2010a0" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <ellipse cx="550" cy="300" rx="500" ry="280" fill="url(#ksnb1)" />
                {SIZE_SCREEN_STARS.map((s, i) => (
                    <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                ))}
            </svg>

            <div style={{ position: "relative", zIndex: 1 }}>
                {team.length === 0 && (
                    <button style={styles.draftBackBtn} onClick={handleBackToSize}>
                        {T[lang].god.back}
                    </button>
                )}
                <h1 style={styles.title}>{td.title}</h1>
                {!isComplete && (
                    <p style={styles.subtitle}>{td.pickLabel(pickCount + 1, teamSize)}</p>
                )}

                <div style={styles.constellationWrapper}>
                    <ConstellationBoard team={team} teamSize={teamSize} layout={layout} />
                </div>

                {isComplete && (
                    <div style={{ textAlign: "center", marginBottom: "32px" }}>
                        <p style={styles.confirmText}>{td.confirmMsg}</p>
                        <button style={styles.button} onClick={handleConfirm}>
                            {td.confirmBtn}
                        </button>
                    </div>
                )}

                {!isComplete && (
                    <div style={styles.poolSection}>
                        <p style={styles.poolLabel}>{td.poolLabel}</p>
                        <div style={styles.grid}>
                            {pool.map((knight) => {
                                const rankColor = RANK_COLORS[knight.rank] || "#aaa";
                                return (
                                    <div
                                        key={knight.id}
                                        onClick={() => handlePick(knight)}
                                        style={{ ...styles.card, borderColor: "#333" }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = rankColor}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = "#333"}
                                    >
                                        <div style={styles.nameRow}>
                                            <p style={{ ...styles.knightName, color: rankColor }}>{kName(knight)}</p>
                                            <span style={{ ...styles.overall, color: overallColor(calcOverall(knight)) }}>
                                                {calcOverall(knight)} OVR
                                            </span>
                                        </div>
                                        <p style={styles.series}>
                                            {knight.series.replace(/_/g, " ")} · {knight.rank}
                                        </p>
                                        <div style={styles.stats}>
                                            <span>⚔ {knight.power}</span>
                                            <span>🛡 {knight.defense}</span>
                                            <span>💨 {knight.speed}</span>
                                            <span>✨ {knight.cosmos}</span>
                                        </div>
                                        <p style={styles.lore}>{knight.lore}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const sS = {
    outer: {
        background: "#06091a",
        minHeight: "100vh",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#c0d8f0",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
    },
    bgSvg: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    },
    header: {
        textAlign: "center",
        padding: "40px 20px 24px",
        position: "relative",
        zIndex: 1,
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
        margin: "0 0 10px",
        fontFamily: "'Cinzel', serif",
    },
    sub: {
        fontSize: "20px",
        color: "#7ab8d4",
        fontStyle: "italic",
    },
    row: {
        display: "flex",
        gap: "28px",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: "20px 24px 32px",
        position: "relative",
        zIndex: 1,
        flex: 1,
        alignItems: "center",
    },
    card: {
        border: "1.5px solid #1a2a3a",
        borderRadius: "12px",
        padding: "20px 20px 16px",
        width: "240px",
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
    },
    cardBody: { paddingTop: "12px" },
    num: {
        fontSize: "2.8rem",
        margin: "0 0 2px",
        fontFamily: "'Cinzel', serif",
        transition: "color 0.2s",
    },
    cardLabel: {
        fontSize: "0.98rem",
        color: "#7ab8d4",
        letterSpacing: "3px",
        textTransform: "uppercase",
        margin: "0 0 10px",
        fontFamily: "'Cinzel', serif",
    },
    cardDesc: {
        fontSize: "16px",
        color: "#7ab8d4",
        lineHeight: "1.6",
        fontStyle: "italic",
        margin: 0,
    },
    footer: {
        borderTop: "1px solid #0a1520",
        padding: "8px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        position: "relative",
        zIndex: 1,
    },
    ftText: {
        fontSize: "9px",
        color: "#0e1a26",
        letterSpacing: "0.5px",
    },
    backBtn: {
        position: "absolute",
        top: "40px",
        left: "24px",
        background: "none",
        border: "1px solid #1a2a3a",
        borderRadius: "4px",
        color: "#4a8aaa",
        fontFamily: "'Cinzel', serif",
        fontSize: "11px",
        letterSpacing: "2px",
        cursor: "pointer",
        padding: "6px 14px",
        transition: "color 0.2s, border-color 0.2s",
    },
};

const board = {
    wrapper: { width: "100%" },
    label: {
        color: "#4a7fa5",
        fontSize: "0.95rem",
        letterSpacing: "3px",
        textTransform: "uppercase",
        textAlign: "center",
        marginBottom: "12px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
};

const styles = {
    draftBackBtn: {
        position: "absolute",
        top: "0",
        left: "0",
        background: "none",
        border: "1px solid #1a2a3a",
        borderRadius: "4px",
        color: "#4a8aaa",
        fontFamily: "'Cinzel', serif",
        fontSize: "11px",
        letterSpacing: "2px",
        cursor: "pointer",
        padding: "6px 14px",
        transition: "color 0.2s, border-color 0.2s",
    },
    page: {
        minHeight: "100vh",
        background: "#06091a",
        color: "#f0f0f0",
        padding: "32px 24px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
    },
    bgSvg: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
    },
    title: {
        fontSize: "2.6rem",
        color: "#FFD700",
        marginBottom: "6px",
        fontFamily: "'Cinzel', serif",
        letterSpacing: "4px",
        fontWeight: "700",
    },
    subtitle: {
        color: "#7ab8d4",
        fontSize: "1.15rem",
        marginBottom: "20px",
        letterSpacing: "2px",
        fontStyle: "italic",
    },
    constellationWrapper: {
        maxWidth: "760px",
        margin: "0 auto 32px",
    },
    poolSection: {
        maxWidth: "1100px",
        margin: "0 auto",
    },
    poolLabel: {
        color: "#FFD700",
        fontSize: "1rem",
        letterSpacing: "3px",
        textTransform: "uppercase",
        marginBottom: "16px",
        fontFamily: "'Cinzel', serif",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "14px",
        textAlign: "left",
    },
    card: {
        backgroundColor: "#111",
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "18px",
        textAlign: "left",
        cursor: "pointer",
        transition: "border-color 0.15s",
    },
    nameRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2px",
    },
    knightName: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        margin: 0,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    overall: {
        fontSize: "0.95rem",
        fontWeight: "bold",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    series: {
        fontSize: "1.04rem",
        color: "#7ab8d4",
        marginBottom: "10px",
        textTransform: "capitalize",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    stats: {
        display: "flex",
        gap: "10px",
        fontSize: "1.06rem",
        color: "#7ab8d4",
        marginBottom: "10px",
        flexWrap: "wrap",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    lore: {
        fontSize: "1.04rem",
        color: "#7ab8d4",
        lineHeight: "1.6",
        margin: 0,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    confirmText: {
        color: "#7ab8d4",
        fontStyle: "italic",
        marginBottom: "16px",
        fontSize: "1.27rem",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    button: {
        padding: "14px 40px",
        fontSize: "1rem",
        backgroundColor: "#FFD700",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "'Cinzel', serif",
        fontWeight: "700",
        letterSpacing: "2px",
    },
};
