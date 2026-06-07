// PrivacyScreen.jsx
// Política de Privacidade / Privacy Policy

import { useLanguage } from "../i18n/LanguageContext";
import { T } from "../i18n/translations";

export default function PrivacyScreen({ onBack }) {
  const { lang } = useLanguage();
  const t = T[lang].privacy;
  const f = T[lang].footer;

  return (
    <div style={S.outer}>
      <div style={S.page}>

        {/* ── Cabeçalho ── */}
        <div style={S.header}>
          <button style={S.backBtn} onClick={onBack}>{t.back}</button>
          <p style={S.eyebrow}>{t.eyebrow}</p>
          <h1 style={S.title}>{t.title}</h1>
          <p style={S.updated}>{t.updated}</p>
        </div>

        {/* ── Conteúdo ── */}
        <div style={S.content}>

          {/* Aviso de fã-game / copyright */}
          <div style={S.disclaimerBox}>
            <p style={S.disclaimerText}>{t.disclaimer}</p>
          </div>

          {t.sections.map((section, i) => (
            <div key={i} style={S.section}>
              <h2 style={S.sectionTitle}>{section.title}</h2>
              {section.paragraphs.map((p, j) => (
                <p key={j} style={S.para}>{p}</p>
              ))}
            </div>
          ))}
        </div>

      </div>

      {/* ── Rodapé ── */}
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
    background: "#050b14",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: "#c0d8f0",
  },
  page: {
    maxWidth: "760px",
    margin: "0 auto",
    width: "100%",
    flex: 1,
    padding: "0 24px 48px",
    boxSizing: "border-box",
  },
  header: {
    padding: "32px 0 28px",
    borderBottom: "1px solid #0e1a26",
    marginBottom: "36px",
    position: "relative",
  },
  backBtn: {
    background: "none",
    border: "1px solid #1a3040",
    borderRadius: "3px",
    color: "#4a8aaa",
    fontFamily: "'Cinzel', serif",
    fontSize: "11px",
    letterSpacing: "1.5px",
    cursor: "pointer",
    padding: "6px 14px",
    marginBottom: "24px",
    display: "block",
    transition: "color 0.2s, border-color 0.2s",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "4px",
    color: "#2a4050",
    textTransform: "uppercase",
    fontFamily: "'Cinzel', serif",
    margin: "0 0 12px",
  },
  title: {
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    color: "#c8a800",
    letterSpacing: "6px",
    fontWeight: "700",
    fontFamily: "'Cinzel', serif",
    margin: "0 0 10px",
    lineHeight: 1.2,
  },
  updated: {
    fontSize: "13px",
    color: "#2a4050",
    margin: 0,
    letterSpacing: ".5px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  disclaimerBox: {
    border: "1px solid #1a3048",
    borderRadius: "4px",
    background: "#070e18",
    padding: "18px 22px",
    marginBottom: "32px",
  },
  disclaimerText: {
    fontSize: "15px",
    color: "#7ab8d4",
    lineHeight: 1.75,
    margin: 0,
    fontStyle: "italic",
  },
  section: {
    borderTop: "1px solid #0e1a26",
    paddingTop: "26px",
    paddingBottom: "26px",
  },
  sectionTitle: {
    fontSize: "13px",
    letterSpacing: "3px",
    color: "#c8a800",
    textTransform: "uppercase",
    fontFamily: "'Cinzel', serif",
    fontWeight: "700",
    margin: "0 0 14px",
  },
  para: {
    fontSize: "16px",
    color: "#8aacC0",
    lineHeight: 1.8,
    margin: "0 0 10px",
  },
  footer: {
    borderTop: "1px solid #0e1a26",
    padding: "10px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    maxWidth: "760px",
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
