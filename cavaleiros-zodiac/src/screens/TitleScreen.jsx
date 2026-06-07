// TitleScreen.jsx
// Layout: toggle idioma + título → mapa SVG 1100×500 → regras → botão → rodapé

import { useLanguage } from "../i18n/LanguageContext";
import { T } from "../i18n/translations";

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

const PATH_POINTS = HOUSE_POSITIONS.map(p => `${p.cx},${p.cy}`).join(" ");

// ─── Component ───────────────────────────────────────────────────────────────

export default function TitleScreen({ onStart, onPrivacy }) {
    const { lang, setLang } = useLanguage();
    const t = T[lang].title;
    const f = T[lang].footer;
    const houses = T[lang].houses;

    return (
        <div style={S.outer}>
            <div style={S.page}>

                {/* ── Cabeçalho ── */}
                <div style={S.header}>

                    {/* Toggle de idioma */}
                    <div style={S.langRow}>
                        <button
                            style={{ ...S.langBtn, ...(lang === "pt" ? S.langBtnActive : {}) }}
                            onClick={() => setLang("pt")}
                        >PT</button>
                        <span style={S.langSep}>|</span>
                        <button
                            style={{ ...S.langBtn, ...(lang === "en" ? S.langBtnActive : {}) }}
                            onClick={() => setLang("en")}
                        >EN</button>
                    </div>

                    <p style={S.sup}>{t.eyebrow}</p>
                    <h1 style={S.title}>{t.game}</h1>
                    <p style={S.tagline}>{t.tagline}</p>
                </div>

                {/* ── Mapa das 12 casas (full-width) ── */}
                <div style={S.mapWrap}>
                    <svg viewBox="0 0 1100 500" style={{ width: "100%", display: "block" }}>
                        <rect width="1100" height="500" fill="#050b14" />

                        <defs>
                            <radialGradient id="tnb1" cx="50%" cy="50%">
                                <stop offset="0%" stopColor="#2010a0" stopOpacity="0.09" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="tnb2" cx="50%" cy="50%">
                                <stop offset="0%" stopColor="#103080" stopOpacity="0.06" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0" />
                            </radialGradient>
                            <filter id="houseGlow" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        <ellipse cx="600" cy="250" rx="500" ry="230" fill="url(#tnb1)" />
                        <ellipse cx="200" cy="380" rx="260" ry="160" fill="url(#tnb2)" />

                        {MAP_STARS.map((s, i) => (
                            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff" opacity={s.op} />
                        ))}

                        <polyline points={PATH_POINTS} fill="none" stroke="#1a3248" strokeWidth="2" strokeDasharray="6 5" opacity="0.65" />

                        {HOUSE_POSITIONS.map((pos, i) => (
                            <g key={i} transform={`translate(${pos.cx},${pos.cy})`}>
                                <circle r="18" fill="#c8a800" opacity="0.07" filter="url(#houseGlow)" />
                                <circle r="13" fill="#08101a" stroke="#c8a800" strokeWidth="1.2" opacity="0.65" />
                                <circle r="5" fill="#c8a800" opacity="0.55" />
                                <circle r="2" fill="#fff8d0" opacity="0.5" />
                            </g>
                        ))}

                        {/* Labels primeira e última casa no idioma atual */}
                        <text x="1030" y="484" textAnchor="middle" fill="#c8a800" opacity="0.5" fontSize="13" fontFamily="'Cormorant Garamond', Georgia, serif">
                            {houses[0]}
                        </text>
                        <text x="115" y="72" textAnchor="middle" fill="#c8a800" opacity="0.5" fontSize="13" fontFamily="'Cormorant Garamond', Georgia, serif">
                            {houses[11]}
                        </text>
                    </svg>
                </div>

                {/* ── Regras ── */}
                <div style={S.rules}>
                    {t.rules.map((rule, i) => (
                        <div key={i} style={{ ...S.rule, borderRight: i < 3 ? "1px solid #1a2a3a" : "none" }}>
                            <span style={S.ruleIcon}>{rule.icon}</span>
                            <p style={S.ruleText}>{rule.text}</p>
                        </div>
                    ))}
                </div>

                {/* ── Botão Iniciar ── */}
                <div style={S.btnRow}>
                    <button style={S.btn} onClick={onStart}>
                        {t.start}
                    </button>
                </div>

            </div>

            {/* ── Rodapé ── */}
            <footer style={S.footer}>
                <span style={S.footerText}>{f.creator}</span>
                <span style={S.footerText}>{f.game}</span>
                <span style={S.footerText}>{f.copyright}</span>
                <button style={S.privacyLink} onClick={onPrivacy}>{f.privacy}</button>
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
        fontFamily: "'Cormorant Garamond', Georgia, serif",
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
        padding: "24px 20px 20px",
        position: "relative",
    },
    langRow: {
        position: "absolute",
        top: "24px",
        right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
    },
    langBtn: {
        background: "none",
        border: "1px solid #2a4a6a",
        borderRadius: "3px",
        color: "#4a8aaa",
        fontFamily: "'Cinzel', serif",
        fontSize: "11px",
        letterSpacing: "2px",
        cursor: "pointer",
        padding: "4px 10px",
        transition: "color 0.2s, border-color 0.2s",
    },
    langBtnActive: {
        color: "#c8a800",
        borderColor: "#c8a800",
    },
    langSep: {
        color: "#2a4a6a",
        fontSize: "11px",
    },
    sup: {
        fontSize: "13px",
        letterSpacing: "5px",
        color: "#33445a",
        textTransform: "uppercase",
        display: "block",
        marginBottom: "22px",
        fontFamily: "'Cinzel', serif",
    },
    title: {
        fontSize: "clamp(2.8rem, 6vw, 4.8rem)",
        color: "#c8a800",
        letterSpacing: "10px",
        fontWeight: "700",
        lineHeight: "1.1",
        margin: "0 0 14px",
        fontFamily: "'Cinzel', serif",
    },
    tagline: {
        fontSize: "21px",
        color: "#7ab8d4",
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
        fontSize: "17px",
        color: "#7ab8d4",
        lineHeight: 1.7,
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
        padding: "14px 64px",
        borderRadius: "6px",
        fontFamily: "'Cinzel', serif",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "700",
        letterSpacing: "3px",
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
    privacyLink: {
        background: "none",
        border: "none",
        padding: 0,
        fontSize: "10px",
        color: "#1a3040",
        letterSpacing: ".5px",
        cursor: "pointer",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        textDecoration: "underline",
        textUnderlineOffset: "2px",
    },
};
