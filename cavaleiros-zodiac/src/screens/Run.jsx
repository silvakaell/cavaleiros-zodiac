// Run.jsx
// Tela da travessia — mapa das 12 casas do santuário.
// Recebe: team, godId, layout, teamSize, onFinish

import { useState, useRef, useEffect } from "react";
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
    { cx: 590, cy: 262, name: "Áries", anchor: "below" },
    { cx: 510, cy: 228, name: "Touro", anchor: "left" },
    { cx: 562, cy: 175, name: "Gêmeos", anchor: "right" },
    { cx: 455, cy: 150, name: "Câncer", anchor: "below" },
    { cx: 348, cy: 177, name: "Leão", anchor: "left" },
    { cx: 400, cy: 123, name: "Virgem", anchor: "above" },
    { cx: 512, cy: 101, name: "Libra", anchor: "right" },
    { cx: 462, cy: 63, name: "Escorpião", anchor: "above" },
    { cx: 352, cy: 80, name: "Sagitário", anchor: "below" },
    { cx: 246, cy: 57, name: "Capricórnio", anchor: "above" },
    { cx: 150, cy: 81, name: "Aquário", anchor: "below" },
    { cx: 66, cy: 50, name: "Peixes", anchor: "above" },
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

// ─── Offset do label por âncora ──────────────────────────────────────────────

function labelOffset(anchor) {
    switch (anchor) {
        case "above": return [0, -16];
        case "below": return [0, 20];
        case "left": return [-14, 4];
        case "right": return [14, 4];
        default: return [0, 20];
    }
}

function labelAnchor(anchor) {
    if (anchor === "left") return "end";
    if (anchor === "right") return "start";
    return "middle";
}

// ─── Aparência de cada nó conforme estado ────────────────────────────────────

function nodeStyle(state) {
    switch (state) {
        case "passed": return { r: 9, fill: "#091a0e", stroke: "#3a8040", sw: 1.5, dot: "#4aaa50", dotR: 4 };
        case "failed": return { r: 9, fill: "#1a0808", stroke: "#7a2020", sw: 1.5, dot: "#cc3030", dotR: 4 };
        case "current": return { r: 13, fill: "#2a1e00", stroke: "#c8a800", sw: 2, dot: "#e8c000", dotR: 5 };
        default: return { r: 9, fill: "#080e18", stroke: "#1e3a50", sw: 1.2, dot: "#1e3a50", dotR: 4 };
    }
}

// ─── Helpers de cálculo ──────────────────────────────────────────────────────

function getAffinities(house) {
    if (house.affinityBonuses) return house.affinityBonuses;
    if (house.affinityBonus) return [house.affinityBonus];
    return [];
}

function getCalcBreakdown(team, house, godBonus) {
    const avgCosmos = team.reduce((sum, k) => sum + k.cosmos, 0) / team.length;
    const cosmosBonus = ((avgCosmos - 50) / 100) * 0.40;
    const affinities = getAffinities(house)
        .map(ab => ({ ...ab, matches: team.filter(k => ab.knights.includes(k.id)) }))
        .filter(ab => ab.matches.length > 0);
    return {
        avgCosmos: Math.round(avgCosmos),
        guardianCosmos: house.cosmos,
        base: Math.round(house.basePassChance * 100),
        cosmosBonus: Math.round(cosmosBonus * 100),
        affinities,
        godBonusPct: Math.round(godBonus * 100),
    };
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

export default function Run({ team, godId, layout, teamSize, onFinish, onMenu }) {

    const [houseIndex, setHouseIndex] = useState(0);
    const [aliveTeam, setAliveTeam] = useState(team);
    const [fallen, setFallen] = useState([]);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);

    const animLineRef = useRef(null);

    useEffect(() => {
        if (!animLineRef.current || houseIndex === 0) return;
        const a = HOUSE_POSITIONS[houseIndex - 1];
        const b = HOUSE_POSITIONS[houseIndex];
        const len = Math.round(Math.sqrt((b.cx - a.cx) ** 2 + (b.cy - a.cy) ** 2));
        const el = animLineRef.current;
        el.style.transition = "none";
        el.setAttribute("stroke-dashoffset", String(len));
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.transition = "stroke-dashoffset 1.6s ease";
            el.setAttribute("stroke-dashoffset", "0");
        }));
    }, [houseIndex]);

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
    }

    function handleNext() {
        const h = [...history, result];
        if (isLastHouse || aliveTeam.length === 0) {
            onFinish(h, aliveTeam, fallen);
        } else {
            setHistory(h);
            setHouseIndex(prev => prev + 1);
            setResult(null);
        }
    }


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

                        {/* Caminho dim de fundo */}
                        <polyline
                            points="590,262 510,228 562,175 455,150 348,177 400,123 512,101 462,63 352,80 246,57 150,81 66,50"
                            fill="none" stroke="#1a3248" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8"
                        />

                        {/* Segmentos já percorridos — ouro estático */}
                        {Array.from({ length: Math.max(0, houseIndex - 1) }, (_, i) => {
                            const a = HOUSE_POSITIONS[i], b = HOUSE_POSITIONS[i + 1];
                            return (
                                <line key={i} x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                                    stroke="#c8a800" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.65" />
                            );
                        })}

                        {/* Segmento atual — animado ao avançar de casa */}
                        {houseIndex > 0 && (() => {
                            const a = HOUSE_POSITIONS[houseIndex - 1], b = HOUSE_POSITIONS[houseIndex];
                            const dx = b.cx - a.cx, dy = b.cy - a.cy;
                            const len = Math.round(Math.sqrt(dx * dx + dy * dy));
                            return (
                                <line
                                    ref={animLineRef}
                                    x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
                                    stroke="#c8a800" strokeWidth="1.8"
                                    strokeDasharray={`${len} ${len}`}
                                    strokeDashoffset={len}
                                    opacity="0.85"
                                />
                            );
                        })()}

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

                        {/* Labels de todos os signos */}
                        {HOUSE_POSITIONS.map((pos, i) => {
                            const state = i < houseIndex ? "passed" : i === houseIndex ? "current" : "future";
                            const [dx, dy] = labelOffset(pos.anchor);
                            return (
                                <text
                                    key={i}
                                    x={pos.cx + dx} y={pos.cy + dy}
                                    textAnchor={labelAnchor(pos.anchor)}
                                    fill={state === "current" ? "#c8a800" : state === "passed" ? "#4aaa50" : "#4a6a80"}
                                    fontSize="11"
                                    fontFamily="Georgia, serif"
                                    opacity={state === "future" ? "0.55" : "1"}
                                >
                                    {i === houseIndex ? `${pos.name} ▷` : pos.name}
                                </text>
                            );
                        })}
                    </svg>
                </div>

                {/* ── Painel inferior ── */}
                <div style={S.bottom}>

                    {/* Esquerda: bênção + constelação + lista */}
                    <div style={S.leftPanel}>
                        <div>
                            <div style={S.sectionLabel}>Bênção</div>
                            <div style={S.godName}>{godName}</div>
                        </div>
                        <div>
                            <div style={S.sectionLabel}>Constelação</div>
                            <ConstellationMini layout={layout} team={team} aliveTeam={aliveTeam} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={S.sectionLabel}>Time</div>
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
                        {onMenu && (
                            <button style={S.menuBtn} onClick={onMenu}>
                                ← Menu
                            </button>
                        )}
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
                                        <div style={S.guardianName}>
                                            {currentHouse.guardian.split(" de ")[0].split(" do ")[0]}
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
                                            <div style={{ color: result.passed ? "#4aaa50" : "#cc3030", fontSize: "15px", fontWeight: "600", marginBottom: "6px", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.5px" }}>
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
                                                <div style={{ color: "#9a3030", fontSize: "14px", marginTop: "8px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                                                    💀 {result.fallenKnight.name} caiu nesta batalha.
                                                </div>
                                            )}

                                            {result.reviveGranted && (
                                                <div style={{ color: "#4aaa50", fontSize: "14px", marginTop: "8px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                                                    ✨ Um cavaleiro caído foi revivido!
                                                </div>
                                            )}

                                            <div style={S.rollInfo}>
                                                {result.passChance}% · rolagem {result.roll}
                                            </div>
                                        </div>

                                        {/* ── Painel de cálculo ── */}
                                        {(() => {
                                            const bd = getCalcBreakdown(aliveTeam.length > 0 ? aliveTeam : team, currentHouse, godBonus);
                                            const teamPct = Math.min(100, Math.round((bd.avgCosmos / 100) * 100));
                                            const guardPct = Math.min(100, Math.round((bd.guardianCosmos / 100) * 100));
                                            return (
                                                <div style={SC.panel}>
                                                    {/* header */}
                                                    <div style={SC.panelHeader}>
                                                        <span style={SC.panelTitle}>Cálculo da batalha</span>
                                                        <span style={SC.panelVs}>
                                                            time · cosmos {bd.avgCosmos} &nbsp;vs&nbsp; {currentHouse.guardian.split(" ")[0]} · cosmos {bd.guardianCosmos}
                                                        </span>
                                                    </div>

                                                    {/* barras de cosmos */}
                                                    <div style={SC.barsSection}>
                                                        <div style={SC.barRow}>
                                                            <span style={SC.barLabel}>Cosmos time</span>
                                                            <div style={SC.barTrack}>
                                                                <div style={{ ...SC.barFill, width: teamPct + "%", background: "#185FA5" }} />
                                                            </div>
                                                            <span style={SC.barVal}>{bd.avgCosmos}</span>
                                                        </div>
                                                        <div style={SC.barRow}>
                                                            <span style={SC.barLabel}>Cosmos guardião</span>
                                                            <div style={SC.barTrack}>
                                                                <div style={{ ...SC.barFill, width: guardPct + "%", background: "#993C1D" }} />
                                                            </div>
                                                            <span style={SC.barVal}>{bd.guardianCosmos}</span>
                                                        </div>
                                                    </div>

                                                    {/* linhas de bônus */}
                                                    <div style={SC.rowsSection}>
                                                        <div style={SC.calcRow}>
                                                            <span style={SC.rowLabel}>Base da casa</span>
                                                            <span style={SC.rowNeutral}>{bd.base}%</span>
                                                        </div>
                                                        <div style={SC.calcRow}>
                                                            <span style={SC.rowLabel}>Cosmos do time</span>
                                                            <span style={bd.cosmosBonus >= 0 ? SC.rowPos : SC.rowNeg}>
                                                                {bd.cosmosBonus >= 0 ? "+" : ""}{bd.cosmosBonus}%
                                                            </span>
                                                        </div>
                                                        {bd.affinities.length > 0 ? bd.affinities.map((ab, i) => (
                                                            <div key={i} style={SC.calcRow}>
                                                                <span style={SC.rowLabel}>
                                                                    Afinidade — {ab.matches.map(k => k.name.split(" ")[0]).join(", ")}
                                                                    <span style={SC.tag}>{ab.matches.length}× +{Math.round(ab.bonus * 100)}%</span>
                                                                </span>
                                                                <span style={SC.rowPos}>+{Math.round(ab.total * 100)}%</span>
                                                            </div>
                                                        )) : (
                                                            <div style={SC.calcRow}>
                                                                <span style={SC.rowLabel}>Afinidade</span>
                                                                <span style={SC.rowNeutral}>+0%</span>
                                                            </div>
                                                        )}
                                                        <div style={SC.calcRow}>
                                                            <span style={SC.rowLabel}>Bônus de deus</span>
                                                            <span style={bd.godBonusPct > 0 ? SC.rowPos : SC.rowNeutral}>
                                                                {bd.godBonusPct >= 0 ? "+" : ""}{bd.godBonusPct}%
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* total */}
                                                    <div style={SC.totalRow}>
                                                        <span style={SC.totalLabel}>Chance final</span>
                                                        <span style={SC.totalVal}>
                                                            {result.passChance}% · rolagem {result.roll} · {result.passed ? "passou" : "falhou"}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {result.passed ? (
                                            <button style={S.btn} onClick={handleNext}>
                                                {isLastHouse ? "Ver resultado final" : "Próxima casa →"}
                                            </button>
                                        ) : aliveTeam.length === 0 ? (
                                            <>
                                                <div style={{ color: "#7a2020", fontSize: "15px", marginBottom: "12px", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
                                                    Todos os cavaleiros caíram.
                                                </div>
                                                <button style={{ ...S.btn, background: "#7a2020", color: "#fff" }} onClick={handleNext}>
                                                    Ver resultado final
                                                </button>
                                            </>
                                        ) : (
                                            <button style={{ ...S.btn, background: "#1a3a5a", color: "#7ab8d4" }} onClick={handleResolve}>
                                                ↺ Lutar de novo
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
    topbarRight: { color: "#7ab8d4", fontSize: "17px" },
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
    sectionLabel: {
        fontSize: "10px",
        color: "#2a5a7a",
        letterSpacing: "3px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
        textAlign: "center",
        marginBottom: "6px",
    },
    labelSmall: {
        fontSize: "13px",
        color: "#2a5a7a",
        letterSpacing: "2px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
    },
    godName: {
        fontSize: "13px",
        color: "#FFD700",
        lineHeight: "1.4",
        marginBottom: "8px",
        textAlign: "center",
    },
    teamLabel: {
        fontSize: "10px",
        color: "#2a5a7a",
        letterSpacing: "3px",
        textAlign: "center",
        marginBottom: "6px",
        textTransform: "uppercase",
        fontFamily: "'Cinzel', serif",
    },
    menuBtn: {
        background: "none",
        border: "1px solid #1a2e40",
        borderRadius: "4px",
        color: "#2a4a5a",
        fontFamily: "'Cinzel', serif",
        fontSize: "10px",
        letterSpacing: "2px",
        padding: "6px 0",
        width: "100%",
        cursor: "pointer",
        marginTop: "8px",
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
    guardianName: {
        color: "#c0d8f0",
        fontSize: "28px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: "600",
        letterSpacing: "1px",
        marginBottom: "10px",
        textAlign: "center",
    },
    guardianLine: {
        color: "#7ab8d4",
        fontSize: "17px",
        marginBottom: "8px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    houseDesc: {
        color: "#7ab8d4",
        fontSize: "17px",
        lineHeight: "1.7",
        marginBottom: "16px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
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
        color: "#8ab8cc",
        fontSize: "17px",
        fontStyle: "italic",
        lineHeight: "1.7",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    easterEgg: {
        color: "#FFD700",
        fontSize: "15px",
        fontStyle: "italic",
        lineHeight: "1.7",
        marginBottom: "6px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    rollInfo: {
        color: "#7ab8d4",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "15px",
        marginTop: "8px",
    },
};

// ─── Estilos do painel de cálculo ─────────────────────────────────────────────

const SC = {
    panel: {
        border: "1px solid #2a1e00",
        borderRadius: "4px",
        overflow: "hidden",
        marginTop: "12px",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
    panelHeader: {
        background: "#0e0c00",
        borderBottom: "1px solid #2a1e00",
        padding: "6px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "4px",
    },
    panelTitle: {
        fontFamily: "'Cinzel', serif",
        fontSize: "9px",
        letterSpacing: "3px",
        color: "#3a2800",
        textTransform: "uppercase",
    },
    panelVs: {
        fontSize: "11px",
        color: "#2a3848",
    },
    barsSection: {
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        borderBottom: "1px solid #1a1400",
    },
    barRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "12px",
    },
    barLabel: {
        color: "#2a3848",
        width: "100px",
        flexShrink: 0,
    },
    barTrack: {
        flex: 1,
        height: "4px",
        background: "#0d1420",
        borderRadius: "99px",
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        borderRadius: "99px",
    },
    barVal: {
        color: "#4a6a80",
        width: "28px",
        textAlign: "right",
        flexShrink: 0,
        fontSize: "12px",
    },
    rowsSection: {
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        borderBottom: "1px solid #1a1400",
    },
    calcRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontSize: "13px",
        gap: "8px",
    },
    rowLabel: {
        color: "#2a4a5a",
        flex: 1,
    },
    rowNeutral: { color: "#4a7080", flexShrink: 0 },
    rowPos: { color: "#1D9E75", flexShrink: 0 },
    rowNeg: { color: "#993C1D", flexShrink: 0 },
    tag: {
        fontSize: "10px",
        background: "#0a1828",
        color: "#185FA5",
        padding: "1px 6px",
        borderRadius: "99px",
        marginLeft: "6px",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "8px 12px",
        background: "#0a0900",
    },
    totalLabel: {
        fontFamily: "'Cinzel', serif",
        fontSize: "10px",
        letterSpacing: "1px",
        color: "#3a5060",
    },
    totalVal: {
        fontSize: "13px",
        color: "#c8a800",
        fontWeight: "600",
    },
};
