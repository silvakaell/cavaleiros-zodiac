// TitleScreen.jsx
// Layout: título → mapa SVG 1100×500 full-width → regras → botão → rodapé

// ─── Starfield (1100×500 viewBox) ────────────────────────────────────────────

function seededRng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

const _rng = seededRng(42);
const MAP_STARS = Array.from({ length: 260 }, () => ({
    cx: +(_rng() * 1100).toFixed(1),
    cy: +(_rng() * 500).toFixed(1),
    r: +(_rng() * 1.3 + 0.3).toFixed(1),
    op: +(_rng() * 0.30 + 0.06).toFixed(2),
}));

// ─── House positions (viewBox 1100×500) ──────────────────────────────────────

const HOUSE_POSITIONS = [
    { cx: 1030, cy: 460 }, // 1  Áries
    { cx: 880, cy: 392 }, // 2  Touro
    { cx: 952, cy: 303 }, // 3  Gêmeos
    { cx: 778, cy: 262 }, // 4  Câncer
    { cx: 604, cy: 300 }, // 5  Leão
    { cx: 682, cy: 212 }, // 6  Virgem
    { cx: 872, cy: 178 }, // 7  Libra
    { cx: 802, cy: 108 }, // 8  Escorpião
    { cx: 612, cy: 133 }, // 9  Sagitário
    { cx: 428, cy: 97 }, // 10 Capricórnio
    { cx: 272, cy: 138 }, // 11 Aquário
    { cx: 115, cy: 88 }, // 12 Peixes
];

const PATH_POINTS = HOUSE_POSITIONS.map(p => `${p.cx},${p.cy}`).join(" ");

// ─── Rules ───────────────────────────────────────────────────────────────────

const RULES = [
    {
        icon: "⚔",
        text: "Em cada casa, seu time enfrenta o guardião. A chance de passar depende dos stats dos cavaleiros, das afinidades e do deus escolhido.",
    },
    {
        icon: "💀",
        text: "Se a casa não for superada, um cavaleiro cai. A run termina quando todos forem derrotados.",
    },
    {
        icon: "✨",
        text: "Certos times ativam easter eggs do lore. Descubra as combinações certas para ganhar vantagens — e até reviver cavaleiros caídos.",
    },
    {
        icon: "🏆",
        text: "Sua pontuação final depende das casas passadas, dos sobreviventes e dos eventos especiais descobertos. Bata seu recorde.",
    },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function TitleScreen({ onStart }) {
    return (
        <div style={S.outer}>
            <div style={S.page}>

                {/* ── Cabeçalho ── */}
                <div style={S.header}>
                    <p style={S.sup}>Cavaleiros do Zodíaco</p>
                    <h1 style={S.title}>A TRAVESSIA</h1>
                    <p style={S.tagline}>Doze casas. Cinco cavaleiros. Um destino.</p>
                </div>

                {/* ── Mapa das 12 casas (full-width) ── */}
                <div style={S.mapWrap}>
                    <svg viewBox="0 0 1100 500" style={{ width: "100%", display: "block" }}>
                        <rect width="1100" height="500" fill="#050b14" />

                        {/* Nebula */}
                        <defs>
                            <radialGradient id="tnb1" cx="50%" cy="50%">
                                <stop offset="0%" stopColor="#2010a0" stopOpacity="0.09" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="tnb2" cx="50%" cy="50%">
                                <stop offset="0%" stopColor="#103080" stopOpacity="0.06" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                        <ellipse cx="600" cy="250" rx="500" ry="230" fill="url(#tnb1)" />
                        <ellipse cx="200" cy="380" rx="260" ry="160" fill="url(#tnb2)" />

                        {/* Starfield */}
                        {MAP_STARS.map((s, i) => (
                            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                        ))}

                        {/* Caminho tracejado */}
                        <polyline
                            points={PATH_POINTS}
                            fill="none"
                            stroke="#1a3248"
                            strokeWidth="2"
                            strokeDasharray="6 5"
                            opacity="0.65"
                        />

                        {/* Nós das 12 casas */}
                        {HOUSE_POSITIONS.map((pos, i) => (
                            <g key={i} transform={`translate(${pos.cx},${pos.cy})`}>
                                <circle r="13" fill="#08101a" stroke="#1e3a5a" strokeWidth="1.5" />
                                <circle r="5" fill="#1e3a5a" opacity="0.7" />
                            </g>
                        ))}

                        {/* Labels primeira e última casa */}
                        <text x="1030" y="484" textAnchor="middle" fill="#1e3a5a" fontSize="13" fontFamily="Georgia, serif">
                            Áries
                        </text>
                        <text x="115" y="72" textAnchor="middle" fill="#1e3a5a" fontSize="13" fontFamily="Georgia, serif">
                            Peixes
                        </text>

                        {/* Marcador Atena */}
                        <rect x="28" y="28" width="52" height="28" rx="4" fill="#080f1e" stroke="#1e2e40" strokeWidth="1" />
                        <text x="54" y="47" textAnchor="middle" fill="#2a4a6a" fontSize="12" fontFamily="Georgia, serif">
                            Atena
                        </text>
                        <line x1="80" y1="42" x2="115" y2="88" stroke="#1a2e40" strokeWidth="1" strokeDasharray="4 4" />
                    </svg>
                </div>

                {/* ── Regras ── */}
                <div style={S.rules}>
                    {RULES.map((rule, i) => (
                        <div key={i} style={{ ...S.rule, borderRight: i < 3 ? "1px solid #1a2a3a" : "none" }}>
                            <span style={S.ruleIcon}>{rule.icon}</span>
                            <p style={S.ruleText}>{rule.text}</p>
                        </div>
                    ))}
                </div>

                {/* ── Botão Iniciar ── */}
                <div style={S.btnRow}>
                    <button style={S.btn} onClick={onStart}>
                        Iniciar
                    </button>
                </div>

            </div>

            {/* ── Rodapé ── */}
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
        background: "#050b14",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Georgia, serif",
        color: "#c0d8f0",
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
        padding: "32px 20px 20px",
    },
    sup: {
        fontSize: "11px",
        letterSpacing: "4px",
        color: "#33445a",
        textTransform: "uppercase",
        marginBottom: "6px",
    },
    title: {
        fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
        color: "#c8a800",
        letterSpacing: "8px",
        fontWeight: "normal",
        margin: "0 0 10px",
    },
    tagline: {
        fontSize: "13px",
        color: "#33445a",
        fontStyle: "italic",
    },
    mapWrap: {
        width: "100%",
        borderTop: "1px solid #1a2a3a",
        borderBottom: "1px solid #1a2a3a",
    },
    rules: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        borderBottom: "1px solid #1a2a3a",
    },
    rule: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "16px 18px",
    },
    ruleIcon: {
        fontSize: "16px",
    },
    ruleText: {
        fontSize: "11px",
        color: "#2a4a5a",
        lineHeight: 1.6,
        margin: 0,
    },
    btnRow: {
        textAlign: "center",
        padding: "22px 20px 20px",
    },
    btn: {
        background: "#c8a800",
        color: "#000",
        border: "none",
        padding: "13px 56px",
        borderRadius: "6px",
        fontFamily: "Georgia, serif",
        fontSize: "15px",
        cursor: "pointer",
        fontWeight: "bold",
        letterSpacing: "2px",
    },
    footer: {
        borderTop: "1px solid #0e1a26",
        padding: "10px 24px",
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
    footerText: {
        fontSize: "10px",
        color: "#1a3040",
        letterSpacing: ".5px",
    },
};
