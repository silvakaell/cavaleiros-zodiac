// Result.jsx
// Tela de resultado final da run.
// Mostra o placar, casas passadas, sobreviventes e easter eggs descobertos.

import { calcScore } from "../game/battleEngine";
import { GODS } from "../game/godBonuses";

const RANK_COLORS = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    god: "#FF00FF",
};

export default function Result({ history, survivors, fallen, godId, onRestart }) {

    // Conta quantos easter eggs foram encontrados
    const easterEggsFound = history.filter(r => r.easterEggTriggered).length;

    // Calcula a pontuação final
    const score = calcScore(history, survivors.length, easterEggsFound);

    // Nome do deus escolhido
    const god = GODS.find(g => g.id === godId);

    // Define uma mensagem final baseada no desempenho
    function getFinalMessage() {
        if (score.housesPassed === 12) return "Travessia Perfeita. Atena sorri.";
        if (score.housesPassed >= 9) return "Quase lá. Os deuses reconhecem sua força.";
        if (score.housesPassed >= 6) return "Metade do caminho. A saga continua.";
        if (score.housesPassed >= 3) return "A jornada foi curta, mas valente.";
        return "Os guardiões foram implacáveis. Tente de novo.";
    }

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Fim da Travessia</h1>
            <p style={styles.message}>{getFinalMessage()}</p>

            {/* Deus utilizado */}
            <p style={styles.godLabel}>
                Deus: <span style={{ color: god.color }}>{god.name}</span>
            </p>

            {/* Placar */}
            <div style={styles.scoreBox}>
                <h2 style={styles.scoreTitle}>Pontuação Final</h2>
                <p style={styles.totalScore}>{score.total} pts</p>

                <div style={styles.breakdown}>
                    <div style={styles.breakdownItem}>
                        <span style={styles.breakdownLabel}>Casas passadas</span>
                        <span>{score.housesPassed} / 12 &nbsp;→&nbsp; {score.housePoints} pts</span>
                    </div>
                    <div style={styles.breakdownItem}>
                        <span style={styles.breakdownLabel}>Sobreviventes</span>
                        <span>{score.survivors} &nbsp;→&nbsp; {score.survivorPoints} pts</span>
                    </div>
                    <div style={styles.breakdownItem}>
                        <span style={styles.breakdownLabel}>Easter eggs</span>
                        <span>{score.easterEggsFound} &nbsp;→&nbsp; {score.eggPoints} pts</span>
                    </div>
                </div>
            </div>

            {/* Histórico das casas */}
            <div style={styles.historyBox}>
                <h3 style={styles.sectionTitle}>Histórico das Casas</h3>
                {history.map((r, i) => (
                    <div key={i} style={styles.historyRow}>
                        <span style={{ color: r.passed ? "#4CAF50" : "#f44336" }}>
                            {r.passed ? "✅" : "❌"}
                        </span>
                        <span style={styles.historyHouse}>Casa {i + 1}</span>
                        <span style={styles.historyChance}>{r.passChance}%</span>
                        {r.easterEggTriggered && <span style={styles.eggBadge}>✨ easter egg</span>}
                        {!r.passed && r.fallenKnight && (
                            <span style={styles.fallenName}>💀 {r.fallenKnight.name}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Sobreviventes e caídos */}
            <div style={styles.teamSummary}>
                {survivors.length > 0 && (
                    <div style={styles.summaryGroup}>
                        <p style={{ color: "#4CAF50", marginBottom: "8px" }}>Sobreviventes:</p>
                        {survivors.map(k => (
                            <span key={k.id} style={{ ...styles.chip, borderColor: RANK_COLORS[k.rank] }}>
                                {k.name}
                            </span>
                        ))}
                    </div>
                )}

                {fallen.length > 0 && (
                    <div style={styles.summaryGroup}>
                        <p style={{ color: "#f44336", marginBottom: "8px" }}>Caídos:</p>
                        {fallen.map(k => (
                            <span key={k.id} style={styles.fallenChip}>
                                💀 {k.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Botão de recomeçar */}
            <button style={styles.button} onClick={onRestart}>
                Nova Travessia
            </button>

        </div>
    );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────

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
        fontSize: "2.2rem",
        color: "#FFD700",
        marginBottom: "8px",
    },

    message: {
        fontSize: "1.1rem",
        color: "#ccc",
        fontStyle: "italic",
        marginBottom: "8px",
    },

    godLabel: {
        color: "#aaa",
        marginBottom: "32px",
    },

    scoreBox: {
        backgroundColor: "#111",
        border: "2px solid #FFD700",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "500px",
        margin: "0 auto 32px",
    },

    scoreTitle: {
        color: "#FFD700",
        marginBottom: "8px",
    },

    totalScore: {
        fontSize: "2.5rem",
        color: "#fff",
        marginBottom: "20px",
    },

    breakdown: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        textAlign: "left",
    },

    breakdownItem: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.9rem",
        color: "#ccc",
        borderBottom: "1px solid #222",
        paddingBottom: "6px",
    },

    breakdownLabel: {
        color: "#888",
    },

    historyBox: {
        maxWidth: "600px",
        margin: "0 auto 32px",
        textAlign: "left",
    },

    sectionTitle: {
        color: "#FFD700",
        marginBottom: "12px",
        textAlign: "center",
    },

    historyRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 0",
        borderBottom: "1px solid #1a1a1a",
        fontSize: "0.88rem",
        flexWrap: "wrap",
    },

    historyHouse: {
        color: "#ccc",
        minWidth: "60px",
    },

    historyChance: {
        color: "#666",
        fontSize: "0.8rem",
    },

    eggBadge: {
        color: "#FFD700",
        fontSize: "0.78rem",
    },

    fallenName: {
        color: "#f44336",
        fontSize: "0.8rem",
    },

    teamSummary: {
        display: "flex",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap",
        maxWidth: "700px",
        margin: "0 auto 32px",
    },

    summaryGroup: {
        textAlign: "center",
    },

    chip: {
        display: "inline-block",
        border: "1px solid",
        borderRadius: "20px",
        padding: "4px 12px",
        fontSize: "0.82rem",
        color: "#eee",
        margin: "4px",
    },

    fallenChip: {
        display: "inline-block",
        border: "1px solid #444",
        borderRadius: "20px",
        padding: "4px 12px",
        fontSize: "0.82rem",
        color: "#555",
        margin: "4px",
    },

    button: {
        padding: "14px 40px",
        fontSize: "1.1rem",
        backgroundColor: "#FFD700",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "Georgia, serif",
        fontWeight: "bold",
    },

};
