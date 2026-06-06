// Run.jsx
// Tela da travessia — mapa das 12 casas do santuário.
// Recebe: team, godId, layout, teamSize, onFinish

import { useState } from "react";
import housesData from "../data/houses.json";
import { resolveHouse } from "../game/battleEngine";
import { getGodPassBonus, GODS } from "../game/godBonuses";
import { getBattleDescription } from "../game/battleDescriptions";

// ─── Constantes ───────────────────────────────────────────────────────────────

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

// Posições dos nós no mapa SVG (viewBox 640x292)
const HOUSE_POSITIONS = [
    { cx: 590, cy: 262 }, // 1  Áries
    { cx: 510, cy: 228 }, // 2  Touro
    { cx: 562, cy: 175 }, // 3  Gêmeos
    { cx: 455, cy: 150 }, // 4  Câncer
    { cx: 348, cy: 177 }, // 5  Leão
    { cx: 400, cy: 123 }, // 6  Virgem
    { cx: 512, cy: 101 }, // 7  Libra
    { cx: 462, cy: 63 }, // 8  Escorpião
    { cx: 352, cy: 80 }, // 9  Sagitário
    { cx: 246, cy: 57 }, // 10 Capricórnio
    { cx: 150, cy: 81 }, // 11 Aquário
    { cx: 66, cy: 50 }, // 12 Peixes
];

// Estrelas de fundo do mapa [cx, cy, r, opacity]
const STARS = [
    [55, 22, 1.1, .55], [155, 15, 1.1, .5], [285, 28, 1.1, .52], [418, 12, 1.1, .48], [548, 22, 1.1, .5], [622, 16, 1.1, .45],
    [72, 108, 1.1, .5], [198, 95, 1.1, .45], [362, 80, 1.1, .5], [514, 70, 1.1, .52], [592, 90, 1.1, .45],
    [95, 42, .8, .28], [212, 18, .8, .32], [328, 48, .8, .25], [468, 38, .8, .3], [572, 48, .8, .27], [628, 58, .8, .22],
    [36, 78, .8, .25], [128, 62, .8, .3], [258, 68, .8, .28], [388, 52, .8, .25], [538, 62, .8, .27], [618, 72, .8, .2],
    [22, 148, .8, .28], [108, 138, .8, .25], [228, 150, .8, .3], [378, 130, .8, .27], [490, 145, .8, .25], [610, 140, .8, .22],
    [62, 230, .8, .25], [188, 220, .8, .28], [318, 240, .8, .25], [450, 230, .8, .22], [568, 234, .8, .24], [635, 250, .8, .2],
    [138, 32, .5, .13], [240, 42, .5, .12], [380, 22, .5, .14], [510, 32, .5, .11], [600, 42, .5, .12],
    [30, 115, .5, .12], [160, 108, .5, .1], [288, 98, .5, .13], [445, 112, .5, .11],
    [348, 170, .5, .1], [495, 170, .5, .12], [605, 180, .5, .1],
    [88, 280, .5, .12], [210, 284, .5, .1], [348, 275, .5, .11], [478, 280, .5, .1],
];

// ─── Aparência de cada nó conforme estado ────────────────────────────────────

function nodeStyle(state) {
    switch (state) {
        case "passed": return { r: 9, fill: "#091a0e", stroke: "#3a8040", sw: 1.5, dot: "#4aaa50", dotR: 4 };
        case "failed": return { r: 9, fill: "#1a0808", stroke: "#7a2020", sw: 1.5, dot: "#cc3030", dotR: 4 };
        case "current": return { r: 13, fill: "#2a1e00", stroke: "#c8a800", sw: 2, dot: "#e8c000", dotR: 5 };
        default: return { r: 9, fill: "#080e18", stroke: "#1e3a50", sw: 1.2, dot: "#1e3a50", dotR: 4 };
    }
}

// ─── Mini constelação ─────────────────────────────────────────────────────────

function ConstellationMini({ layout, team, aliveTeam }) {
    if (!layout) return null;
    const { stars, lines } = layout;
    return (
        <svg viewBox="0 0 760 320" style={{ width: "100%", display: "block" }}>
            <rect width="760" height="320" fill="#060d17" rx="8" />
            {lines.map(([a, b], i) => (
                <line
                    key={i}
                    x1={stars[a].x} y1={stars[a].y}
                    x2={stars[b].x} y2={stars[b].y}
                    stroke="#4a7fa5" strokeWidth="3" opacity="0.7"
                />
            ))}
            {stars.map((s, i) => {
                const knight = team[i];
                if (!knight) return null;
                const alive = aliveTeam.some(k => k.id === knight.id);
                const color = RANK_COLORS[knight.rank] || "#CD7F32";
                return (
                    <g key={i}>
                        <circle cx={s.x} cy={s.y} r={18} fill={color} opacity={alive ? 0.9 : 0.15} />
                        {!alive && (
                            <>
                                <line x1={s.x - 12} y1={s.y - 12} x2={s.x + 12} y2={s.y + 12}
                                    stroke="#cc3030" strokeWidth="5" strokeLinecap="round" />
                                <line x1={s.x + 12} y1={s.y - 12} x2={s.x - 12} y2={s.y + 12}
                                    stroke="#cc3030" strokeWidth="5" strokeLinecap="round" />
                            </>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Run({ team, godId, layout, teamSize, onFinish }) {

    const [houseIndex, setHouseIndex] = useState(0);
    const [aliveTeam, setAliveTeam] = useState(team);
    const [fallen, setFallen] = useState([]);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);

    const houses = housesData.houses;
    const currentHouse = houses[houseIndex];
    const godBonus = getGodPassBonus(godId);
    const godName = GODS.find(g => g.id === godId)?.name ?? "Atena";
    const isLastHouse = houseIndex === houses.length - 1;
    const runOver = aliveTeam.length === 0;

    function handleResolve() {
        const outcome = resolveHouse(aliveTeam, currentHouse, godBonus);
        if (!outcome.passed && outcome.fallenKnight) {
            setAliveTeam(prev => prev.filter(k => k.id !== outcome.fallenKnight.id));
            setFallen(prev => [...prev, outcome.fallenKnight]);
        }
        setResult(outcome);
        setHistory(prev => [...prev, outcome]);
    }

    function handleNext() {
        if (isLastHouse || runOver) {
            onFinish(history, aliveTeam, fallen);
        } else {
            setHouseIndex(prev => prev + 1);
            setResult(null);
        }
    }

    // Label da casa atual — posição abaixo do nó, exceto se perto da borda inferior
    const curPos = HOUSE_POSITIONS[houseIndex];
    const labelY = curPos.cy > 240 ? curPos.cy - 22 : curPos.cy + 22;
    const houseName = currentHouse.name.replace("Casa de ", "").replace("Casa do ", "");

    return (
        <div style={{ background: "#050b14", minHeight: "100vh" }}>
            <div style={S.page}>

                {/* ── Topbar ── */}
                <div style={S.topbar}>
                    <span style={S.topbarLeft}>Casa {houseIndex + 1} / {houses.length}</span>
                    <span style={S.topbarRight}>Vivos: {aliveTeam.length} &nbsp;|&nbsp; Caídos: {fallen.length}</span>
                </div>

                {/* ── Mapa SVG ── */}
                <div style={{ flexShrink: 0 }}>
                    <svg viewBox="0 0 640 292" style={{ width: "100%", display: "block" }}>
                        <rect width="640" height="292" fill="#050b14" />

                        {/* Starfield */}
                        {STARS.map(([cx, cy, r, op], i) => (
                            <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity={op} />
                        ))}

                        {/* Caminho tracejado */}
                        <polyline
                            points="590,262 510,228 562,175 455,150 348,177 400,123 512,101 462,63 352,80 246,57 150,81 66,50"
                            fill="none" stroke="#1a3248" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8"
                        />

                        {/* Nós das casas */}
                        {HOUSE_POSITIONS.map((pos, i) => {
                            const state = i < houseIndex
                                ? (history[i]?.passed ? "passed" : "failed")
                                : i === houseIndex ? "current" : "future";
                            const ns = nodeStyle(state);
                            return (
                                <g key={i} transform={`translate(${pos.cx},${pos.cy})`}>
                                    <circle r={ns.r} fill={ns.fill} stroke={ns.stroke} strokeWidth={ns.sw} />
                                    <circle r={ns.dotR} fill={ns.dot} opacity="0.9" />
                                </g>
                            );
                        })}

                        {/* Label da casa atual */}
                        <text
                            x={curPos.cx} y={labelY}
                            textAnchor="middle"
                            fill="#c8a800" fontSize="11" fontFamily="Georgia, serif"
                        >
                            {houseName} ▷
                        </text>

                        {/* Marcador Atena */}
                        <rect x="18" y="16" width="34" height="22" rx="3" fill="#080f1e" stroke="#1e2e40" strokeWidth="1" />
                        <text x="35" y="31" textAnchor="middle" fill="#2a4a6a" fontSize="9" fontFamily="Georgia, serif">Atena</text>
                        <line x1="52" y1="27" x2="66" y2="50" stroke="#1a2e40" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                </div>

                {/* ── Painel inferior ── */}
                <div style={S.bottom}>

                    {/* Esquerda: constelação + lista */}
                    <div style={S.leftPanel}>
                        <div>
                            <div style={S.constellationHeader}>
                                <span style={S.labelSmall}>Constelação</span>
                                <span style={S.godName}>· {godName}</span>
                            </div>
                            <ConstellationMini layout={layout} team={team} aliveTeam={aliveTeam} />
                        </div>
                        <div>
                            <div style={S.teamLabel}>Time</div>
                            {team.map(k => {
                                const isFallen = !aliveTeam.some(a => a.id === k.id);
                                return (
                                    <div key={k.id} style={{
                                        ...S.knightName,
                                        color: isFallen ? "#2a2a2a" : "#4a7a9a",
                                        textDecoration: isFallen ? "line-through" : "none",
                                    }}>
                                        {k.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Direita: casa — enquadramento estilo templo grego */}
                    <div style={S.rightPanel}>
                        <div style={S.templeFrame}>

                            {/* ── Entablamento com nome da casa ── */}
                            <div style={S.entablature}>
                                <div style={S.dentils} />
                                <div style={S.pediment}>
                                    <span style={S.capOrnL}>◆</span>
                                    <span style={S.houseName}>{currentHouse.name}</span>
                                    <span style={S.capOrnR}>◆</span>
                                </div>
                                <div style={S.dentils} />
                            </div>

                            {/* ── Corpo da casa ── */}
                            <div style={S.templeBody}>
                                {!result ? (
                                    /* ─ Estado: aguardando batalha ─ */
                                    <>
                                        <div style={S.guardianLine}>
                                            Guardião: <span style={{ color: "#9ab" }}>{currentHouse.guardian}</span>
                                        </div>
                                        <div style={S.houseDesc}>{currentHouse.description}</div>
                                        {!runOver && (
                                            <button style={S.btn} onClick={handleResolve}>
                                                Enfrentar {currentHouse.guardian}
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    /* ─ Estado: resultado da batalha ─ */
                                    <>
                                        <div style={{
                                            ...S.resultBlock,
                                            borderColor: result.passed ? "#3a8040" : "#7a2020",
                                        }}>
                                            <div style={{ color: result.passed ? "#4aaa50" : "#cc3030", fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>
                                                {result.passed ? "✓ Passagem garantida!" : "✗ Barreira não rompida!"}
                                            </div>

                                            {result.easterEggTriggered && (
                                                <div style={S.easterEgg}>✨ {result.easterEggMessage}</div>
                                            )}

                                            {!result.easterEggTriggered && (
                                                <div style={S.narrative}>
                                                    {getBattleDescription(result.passed, result.passChance)}
                                                </div>
                                            )}

                                            {!result.passed && result.fallenKnight && (
                                                <div style={{ color: "#9a3030", fontSize: "12px", marginTop: "6px" }}>
                                                    {result.fallenKnight.name} caiu nesta casa.
                                                </div>
                                            )}

                                            {result.reviveGranted && (
                                                <div style={{ color: "#4aaa50", fontSize: "12px", marginTop: "6px" }}>
                                                    ✨ Um cavaleiro caído foi revivido!
                                                </div>
                                            )}

                                            <div style={S.rollInfo}>
                                                {result.passChance}% · rolagem {result.roll}
                                            </div>
                                        </div>

                                        {runOver ? (
                                            <>
                                                <div style={{ color: "#7a2020", fontSize: "12px", marginBottom: "10px" }}>
                                                    Todos os cavaleiros caíram.
                                                </div>
                                                <button style={{ ...S.btn, background: "#7a2020", color: "#fff" }} onClick={handleNext}>
                                                    Ver resultado final
                                                </button>
                                            </>
                                        ) : (
                                            <button style={S.btn} onClick={handleNext}>
                                                {isLastHouse ? "Ver resultado final" : "Próxima casa →"}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* ── Base / estilóbato ── */}
                            <div style={S.templeBase} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const S = {
    page: {
        maxWidth: "1100px",
        margin: "0 auto",
        minHeight: "100vh",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "#c0d8f0",
        display: "flex",
        flexDirection: "column",
    },
    topbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 18px",
        borderBottom: "1px solid #1a2a3a",
        flexShrink: 0,
    },
    topbarLeft: { color: "#c8a800", fontSize: "17px", letterSpacing: "2px", fontFamily: "'Cinzel', serif" },
    topbarRight: { color: "#33445a", fontSize: "15px" },
    bottom: {
        display: "flex",
        flex: 1,
        borderTop: "1px solid #1a2a3a",
        flexWrap: "wrap",
    },
    leftPanel: {
        width: "195px",
        minWidth: "195px",
        flexShrink: 0,
        borderRight: "1px solid #1a2a3a",
        padding: "12px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxSizing: "border-box",
    },
    constellationHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginBottom: "6px",
    },
    labelSmall: {
        fontSize: "13px",
        color: "#2a5a7a",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
    },
    godName: { fontSize: "13px", color: "#FFD700" },
    teamLabel: {
        fontSize: "13px",
        color: "#2a5a7a",
        letterSpacing: "2px",
        textAlign: "center",
        marginBottom: "6px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
    },
    knightName: {
        fontSize: "14px",
        padding: "4px 0",
        borderBottom: "1px solid #0e1e2e",
        letterSpacing: ".5px",
    },
    rightPanel: {
        flex: 1,
        minWidth: "220px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
    },

    // ── Templo grego ──────────────────────────────────────────
    templeFrame: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #3a2800",
        boxShadow: "0 0 0 3px #060400, inset 0 0 30px rgba(200,168,0,0.04)",
        background: "linear-gradient(180deg, #0e0a00 0%, #050b14 18%, #050b14 100%)",
    },
    entablature: {
        borderBottom: "1px solid #3a2800",
        background: "linear-gradient(180deg, #1a1200 0%, #0e0900 100%)",
        padding: "6px 16px 0",
        flexShrink: 0,
    },
    dentils: {
        height: "5px",
        backgroundImage: "repeating-linear-gradient(90deg, #4a3000 0px, #4a3000 5px, transparent 5px, transparent 13px)",
        margin: "3px 0",
        opacity: 0.7,
    },
    pediment: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "14px",
        padding: "5px 0",
    },
    capOrnL: { color: "#5a3e00", fontSize: "9px" },
    capOrnR: { color: "#5a3e00", fontSize: "9px" },
    houseName: {
        color: "#c8a800",
        fontSize: "20px",
        fontWeight: "700",
        fontFamily: "'Cinzel', serif",
        letterSpacing: "2px",
        textAlign: "center",
    },
    templeBody: {
        padding: "14px 18px",
        flex: 1,
    },
    templeBase: {
        height: "5px",
        backgroundImage: "repeating-linear-gradient(90deg, #3a2800 0px, #3a2800 5px, transparent 5px, transparent 13px)",
        opacity: 0.4,
        flexShrink: 0,
    },
    // ─────────────────────────────────────────────────────────
    guardianLine: {
        color: "#33445a",
        fontSize: "15px",
        marginBottom: "8px",
    },
    houseDesc: {
        color: "#33445a",
        fontSize: "15px",
        lineHeight: "1.7",
        marginBottom: "16px",
    },
    btn: {
        background: "#c8a800",
        color: "#000",
        border: "none",
        padding: "11px 28px",
        borderRadius: "6px",
        fontFamily: "'Cinzel', serif",
        fontSize: "14px",
        cursor: "pointer",
        fontWeight: "700",
        letterSpacing: "2px",
        display: "block",
        margin: "12px auto 0",
        width: "fit-content",
    },
    resultBlock: {
        borderLeft: "3px solid",
        paddingLeft: "12px",
        marginBottom: "12px",
    },
    narrative: {
        color: "#5a7a8a",
        fontSize: "15px",
        fontStyle: "italic",
        lineHeight: "1.7",
    },
    easterEgg: {
        color: "#FFD700",
        fontSize: "15px",
        fontStyle: "italic",
        lineHeight: "1.7",
        marginBottom: "6px",
    },
    rollInfo: {
        color: "#1e3040",
        fontSize: "13px",
        marginTop: "8px",
    },
};
