// GodSelect.jsx
// 8 deuses em anel octagonal sobre fundo de galáxia.
// Clique num deus → info flutua no centro → Confirmar chama onSelect(godId).

import { useState } from "react";

// ─── Starfield ────────────────────────────────────────────────────────────────

function seededRng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const _rng = seededRng(137);
const STARS = Array.from({ length: 200 }, () => ({
    cx: +(_rng() * 1000).toFixed(1),
    cy: +(_rng() * 420).toFixed(1),
    r: +(_rng() * 1.2 + 0.3).toFixed(1),
    op: +(_rng() * 0.28 + 0.06).toFixed(2),
}));

// ─── Gods ────────────────────────────────────────────────────────────────────
// lx / ly: posição do nó em % do container (0-100)
// SXY derivado de lx*10, ly*4.2 para viewBox 1000×420 c/ preserveAspectRatio="none"

const GODS = [
    {
        id: "atena",
        name: "Báculo de Atena",
        short: "Atena",
        color: "#5a9de0",
        lx: 50, ly: 7,
        desc: "A deusa protetora. Modo equilibrado, ideal para aprender o jogo.",
        pros: [
            "Pool de cavaleiros equilibrado.",
            "Todos os easter eggs de lore estão ativos.",
        ],
        cons: [
            "Nenhuma desvantagem — é o modo padrão.",
        ],
    },
    {
        id: "hades",
        name: "Espada de Hades",
        short: "Hades",
        color: "#9b59b6",
        lx: 78, ly: 19,
        desc: "O deus dos mortos. Acesso a Espectros, guardiões mais agressivos.",
        pros: [
            "Espectros disponíveis no pool (poder alto).",
            "Cavaleiro caído vira 'espectro' — usável nas últimas 3 casas.",
        ],
        cons: [
            "Chance base de todas as casas reduzida em 10%.",
        ],
    },
    {
        id: "poseidon",
        name: "Tridente de Poseidon",
        short: "Poseidon",
        color: "#1abc9c",
        lx: 91, ly: 50,
        desc: "O deus dos mares. Generais Marinhos no pool, mas casas de água são mortais.",
        pros: [
            "Generais Marinhos disponíveis no pool.",
            "Bônus de +15% nas casas de Aquário e Peixes.",
        ],
        cons: [
            "Aquário e Peixes têm -20% sem cavaleiros de afinidade aquática.",
        ],
    },
    {
        id: "marte",
        name: "Fúria de Marte",
        short: "Marte",
        color: "#e74c3c",
        lx: 78, ly: 82,
        desc: "O deus da guerra de Omega. Caos e poder bruto — a nova geração domina.",
        pros: [
            "Cavaleiros de Omega têm stats aumentados em 20%.",
            "Pool tem maior concentração de Omega.",
        ],
        cons: [
            "Cavaleiros clássicos perdem 15% de eficácia. Easter eggs clássicos desativados.",
        ],
    },
    {
        id: "apolo",
        name: "O calor de Apolo",
        short: "Apolo",
        color: "#e8a020",
        lx: 50, ly: 94,
        desc: "O deus do sol. Cavaleiros de Ouro são abundantes, mas os Bronzes somem.",
        pros: [
            "Alta concentração de Cavaleiros de Ouro no pool.",
            "Stats de Gold aumentados em 15%.",
        ],
        cons: [
            "Cavaleiros de Bronze raríssimos no pool (máximo 1 por run).",
        ],
    },
    {
        id: "chronos",
        name: "O espírito de Chronos",
        short: "Chronos",
        color: "#8ea8b8",
        lx: 22, ly: 82,
        desc: "O deus do tempo de Next Dimension. Manipule o destino — mas o desgaste é real.",
        pros: [
            "Pode re-rolar o pool de cavaleiros 1 vez antes de montar o time.",
            "Pode repetir uma casa que falhou (1 vez por run).",
        ],
        cons: [
            "Cada cavaleiro perde 10 de cosmos por casa passada (desgaste temporal).",
        ],
    },
    {
        id: "artemis",
        name: "Onda de Ártemis",
        short: "Ártemis",
        color: "#d4a820",
        lx: 9, ly: 50,
        desc: "A deusa da lua de Saintia Sho. Só as Cavaleiras de Atena podem brilhar aqui.",
        pros: [
            "Cavaleiras femininas têm stats aumentados em 30%.",
            "Pool prioriza personagens femininas.",
        ],
        cons: [
            "Cavaleiros de Ouro masculinos não aparecem no pool.",
        ],
    },
    {
        id: "odin",
        name: "Lança de Odin",
        short: "Odin",
        color: "#78c4d8",
        lx: 22, ly: 19,
        desc: "O deus nórdico de Asgard. Os Guerreiros do Norte ingressam na travessia.",
        pros: [
            "Guerreiros de Asgard disponíveis no pool.",
            "Bônus de +20% nas sete primeiras casas.",
        ],
        cons: [
            "Easter eggs do lore clássico ficam desativados.",
        ],
    },
];

// SVG line endpoints — lx*10, ly*4.2 para viewBox 1000×420 c/ preserveAspectRatio="none"
const SXY = {
    atena: [500, 30],
    hades: [780, 80],
    poseidon: [910, 210],
    marte: [780, 344],
    apolo: [500, 395],
    chronos: [220, 344],
    artemis: [90, 210],
    odin: [220, 80],
};

const RING = ["atena", "hades", "poseidon", "marte", "apolo", "chronos", "artemis", "odin"];
const DIAG = [
    ["atena", "poseidon"],
    ["hades", "apolo"],
    ["poseidon", "odin"],
    ["marte", "artemis"],
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function GodSelect({ onSelect }) {
    const [sel, setSel] = useState(null);
    const [hov, setHov] = useState(null);

    const god = GODS.find(g => g.id === sel);

    // Build all line pairs
    const lines = [
        ...RING.map((id, i) => [id, RING[(i + 1) % RING.length]]),
        ...DIAG,
    ];

    return (
        <div style={S.outer}>

            {/* ── Header ── */}
            <div style={S.header}>
                <p style={S.sup}>Cavaleiros do Zodíaco — A Travessia</p>
                <h1 style={S.title}>Escolha seu Deus</h1>
                <p style={S.sub}>Cada deus muda as regras da travessia. Escolha com sabedoria.</p>
            </div>

            {/* ── Constellation area ── */}
            <div style={S.area}>

                {/* Stars + nebula + constellation lines */}
                <svg style={S.bgSvg} viewBox="0 0 1000 420" preserveAspectRatio="none">
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
                    <ellipse cx="500" cy="210" rx="400" ry="180" fill="url(#gnb1)" />
                    <ellipse cx="200" cy="310" rx="200" ry="120" fill="url(#gnb2)" />

                    {STARS.map((s, i) => (
                        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                    ))}

                    {lines.map(([a, b], i) => {
                        const [x1, y1] = SXY[a];
                        const [x2, y2] = SXY[b];
                        const active = sel && (sel === a || sel === b);
                        return (
                            <line
                                key={i}
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
                        <p style={S.hint}>Selecione<br />um deus</p>
                    ) : (
                        <>
                            <p style={{ ...S.godName, color: god.color }}>{god.name}</p>
                            <p style={S.desc}>{god.desc}</p>
                            <div style={S.rows}>
                                {god.pros.map((p, i) => <div key={i} style={S.pro}>+ {p}</div>)}
                                {god.cons.map((c, i) => <div key={i} style={S.con}>− {c}</div>)}
                            </div>
                            <button
                                style={{ ...S.btn, background: god.color }}
                                onClick={() => onSelect(sel)}
                            >
                                Confirmar →
                            </button>
                        </>
                    )}
                </div>

                {/* God nodes */}
                {GODS.map(g => {
                    const active = sel === g.id;
                    const hovered = hov === g.id;
                    const sz = active ? 22 : 15;
                    const coreSz = active ? 7 : 4;
                    return (
                        <div
                            key={g.id}
                            style={{
                                ...S.node,
                                left: g.lx + "%",
                                top: g.ly + "%",
                                filter: hovered && !active ? "brightness(1.6)" : "none",
                            }}
                            onClick={() => setSel(g.id === sel ? null : g.id)}
                            onMouseEnter={() => setHov(g.id)}
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
                                {/* satellite constellation dots */}
                                <div style={{ ...S.sat, top: -7, left: 2, width: 3, height: 3, background: g.color, opacity: 0.40 }} />
                                <div style={{ ...S.sat, bottom: -6, right: 0, width: 2, height: 2, background: g.color, opacity: 0.30 }} />
                                <div style={{ ...S.sat, top: 1, right: -8, width: 2, height: 2, background: g.color, opacity: 0.28 }} />
                            </div>
                            <span style={{ ...S.label, color: active ? g.color : "#1a3040" }}>
                                {g.short}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* ── Footer ── */}
            <footer style={S.footer}>
                <span style={S.footerText}>Criado por @kamonbr</span>
                <span style={S.footerText}>A Travessia — fã-game não oficial</span>
                <span style={S.footerText}>Cavaleiros do Zodíaco © Masami Kurumada · 2025</span>
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
        fontFamily: "'Cinzel', serif",
    },
    title: {
        fontSize: "clamp(2rem, 4vw, 3rem)",
        color: "#c8a800",
        letterSpacing: "8px",
        fontWeight: "700",
        margin: "6px 0",
        fontFamily: "'Cinzel', serif",
    },
    sub: {
        fontSize: "17px",
        color: "#1e3040",
        fontStyle: "italic",
    },
    area: {
        flex: 1,
        position: "relative",
        maxWidth: "1000px",
        width: "100%",
        margin: "0 auto",
        minHeight: "420px",
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
        top: "50%",
        transform: "translate(-50%, -52%)",
        width: "210px",
        textAlign: "center",
        zIndex: 5,
    },
    hint: {
        color: "#0e2030",
        fontSize: "15px",
        fontStyle: "italic",
        lineHeight: 1.8,
    },
    godName: {
        fontSize: "17px",
        letterSpacing: "0.5px",
        marginBottom: "6px",
    },
    desc: {
        fontSize: "14px",
        color: "#2a4a5a",
        lineHeight: 1.7,
        marginBottom: "8px",
    },
    rows: {
        fontSize: "13px",
        lineHeight: 2,
        marginBottom: "12px",
    },
    pro: { color: "#1a5530", textAlign: "left" },
    con: { color: "#5a1818", textAlign: "left" },
    btn: {
        color: "#000",
        border: "none",
        padding: "9px 22px",
        borderRadius: "4px",
        fontFamily: "'Cinzel', serif",
        fontSize: "13px",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "2px",
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
        fontSize: "11px",
        whiteSpace: "nowrap",
        textAlign: "center",
        lineHeight: 1.3,
        transition: "color 0.25s",
        maxWidth: "80px",
        fontFamily: "'Cormorant Garamond', serif",
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
