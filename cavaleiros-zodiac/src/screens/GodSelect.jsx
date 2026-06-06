// GodSelect.jsx
// Tela de seleção de deus — primeira coisa que o jogador vê.
// Recebe: onSelect(godId) — função chamada quando o jogador confirma a escolha.

import { useState } from "react";
import { GODS } from "../game/godBonuses";

export default function GodSelect({ onSelect }) {

  // Guarda qual deus está selecionado no momento
  const [selected, setSelected] = useState(null);

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>Escolha seu Deus</h1>
      <p style={styles.subtitle}>Cada deus muda as regras da travessia. Escolha com sabedoria.</p>

      {/* Grade de cards — um por deus */}
      <div style={styles.grid}>
        {GODS.map((god) => (
          <div
            key={god.id}
            onClick={() => setSelected(god.id)}
            style={{
              ...styles.card,
              borderColor: selected === god.id ? god.color : "#333",
              boxShadow: selected === god.id ? `0 0 16px ${god.color}` : "none",
            }}
          >
            {/* Nome do deus com a cor dele */}
            <h2 style={{ ...styles.godName, color: god.color }}>{god.name}</h2>

            <p style={styles.description}>{god.description}</p>

            {/* Vantagem */}
            <div style={styles.tag}>
              <span style={styles.plus}>＋</span>
              <span>{god.advantage}</span>
            </div>

            {/* Desvantagem */}
            <div style={styles.tag}>
              <span style={styles.minus}>－</span>
              <span>{god.disadvantage}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Botão só aparece depois de escolher */}
      {selected && (
        <button
          style={styles.button}
          onClick={() => onSelect(selected)}
        >
          Começar com {GODS.find(g => g.id === selected).name}
        </button>
      )}

    </div>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
// Todos os estilos ficam aqui embaixo, separados do componente.
// Assim fica fácil de ler e modificar.

const styles = {

  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#f0f0f0",
    padding: "40px 20px",
    fontFamily: "Georgia, serif",
    textAlign: "center",
  },

  title: {
    fontSize: "2.5rem",
    color: "#FFD700",
    marginBottom: "8px",
    letterSpacing: "2px",
  },

  subtitle: {
    fontSize: "1rem",
    color: "#aaa",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "#111",
    border: "2px solid #333",
    borderRadius: "12px",
    padding: "24px",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  godName: {
    fontSize: "1.4rem",
    marginBottom: "8px",
  },

  description: {
    fontSize: "0.9rem",
    color: "#ccc",
    marginBottom: "16px",
    lineHeight: "1.5",
  },

  tag: {
    display: "flex",
    gap: "8px",
    fontSize: "0.85rem",
    color: "#ddd",
    marginBottom: "8px",
    lineHeight: "1.4",
  },

  plus: {
    color: "#4CAF50",
    fontWeight: "bold",
    flexShrink: 0,
  },

  minus: {
    color: "#f44336",
    fontWeight: "bold",
    flexShrink: 0,
  },

  button: {
    marginTop: "40px",
    padding: "14px 40px",
    fontSize: "1.1rem",
    backgroundColor: "#FFD700",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

};
