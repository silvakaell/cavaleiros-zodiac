// Run.jsx
// Tela principal da travessia — o jogador avança casa por casa.
// Recebe: team (array de cavaleiros), godId (deus escolhido), onFinish (função ao terminar)

import { useState } from "react";
import housesData from "../data/houses.json";
import { resolveHouse } from "../game/battleEngine";
import { getGodPassBonus } from "../game/godBonuses";
import { getBattleDescription } from "../game/battleDescriptions";

const RANK_COLORS = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    god: "#FF00FF",
};

export default function Run({ team, godId, onFinish }) {

    // Índice da casa atual (0 = Áries, 11 = Peixes)
    const [houseIndex, setHouseIndex] = useState(0);

    // Cavaleiros ainda vivos no time
    const [aliveTeam, setAliveTeam] = useState(team);

    // Cavaleiros que caíram durante a run
    const [fallen, setFallen] = useState([]);

    // Resultado da casa atual (null = ainda não resolveu)
    const [result, setResult] = useState(null);

    // Histórico de resultados de todas as casas
    const [history, setHistory] = useState([]);

    const houses = housesData.houses;
    const currentHouse = houses[houseIndex];
    const godBonus = getGodPassBonus(godId);
    const isLastHouse = houseIndex === houses.length - 1;
    const runOver = aliveTeam.length === 0;

    // Resolve o combate da casa atual
    function handleResolve() {
        const outcome = resolveHouse(aliveTeam, currentHouse, godBonus);

        // Se falhou, remove o cavaleiro que caiu do time vivo
        if (!outcome.passed && outcome.fallenKnight) {
            setAliveTeam(prev => prev.filter(k => k.id !== outcome.fallenKnight.id));
            setFallen(prev => [...prev, outcome.fallenKnight]);
        }

        setResult(outcome);
        setHistory(prev => [...prev, outcome]);
    }

    // Avança para a próxima casa
    function handleNextHouse() {
        if (isLastHouse || runOver) {
            onFinish(history, aliveTeam, fallen);
        } else {
            setHouseIndex(prev => prev + 1);
            setResult(null);
        }
    }

    return (
        <div style={styles.container}>

            {/* Cabeçalho: progresso e status do time */}
            <div style={styles.header}>
                <p style={styles.progress}>
                    Casa {houseIndex + 1} / {houses.length}
                </p>
                <p style={styles.teamStatus}>
                    ⚔ Vivos: {aliveTeam.length} &nbsp;|&nbsp; 💀 Caídos: {fallen.length}
                </p>
            </div>

            {/* Card da casa atual */}
            <div style={styles.houseCard}>
                <h2 style={styles.houseName}>{currentHouse.name}</h2>
                <p style={styles.guardian}>Guardião: <strong>{currentHouse.guardian}</strong></p>
                <p style={styles.houseDesc}>{currentHouse.description}</p>
            </div>

            {/* Time vivo */}
            <div style={styles.teamRow}>
                {aliveTeam.map(k => (
                    <span key={k.id} style={{ ...styles.knightChip, borderColor: RANK_COLORS[k.rank] }}>
                        {k.name}
                    </span>
                ))}
                {fallen.map(k => (
                    <span key={k.id} style={styles.fallenChip}>
                        💀 {k.name}
                    </span>
                ))}
            </div>

            {/* Resultado do combate */}
            {result && (
                <div style={{
                    ...styles.resultBox,
                    borderColor: result.passed ? "#4CAF50" : "#f44336",
                }}>

                    {/* Easter egg */}
                    {result.easterEggTriggered && (
                        <p style={styles.easterEgg}>✨ {result.easterEggMessage}</p>
                    )}

                    {/* Passou ou falhou */}
                    <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
                        {result.passed ? "✅ Passagem garantida!" : "❌ Barreira não rompida!"}
                    </p>

                    {/* Descrição narrativa — só aparece se não houve easter egg */}
                    {!result.easterEggTriggered && (
                        <p style={styles.battleDesc}>
                            {getBattleDescription(result.passed, result.passChance)}
                        </p>
                    )}

                    {/* Cavaleiro que caiu */}
                    {!result.passed && result.fallenKnight && (
                        <p style={{ color: "#f44336" }}>
                            💀 {result.fallenKnight.name} caiu nesta casa.
                        </p>
                    )}

                    {/* Revive concedido */}
                    {result.reviveGranted && (
                        <p style={{ color: "#4CAF50" }}>
                            ✨ Um cavaleiro caído foi revivido pelo easter egg!
                        </p>
                    )}

                    {/* Números para os curiosos */}
                    <p style={styles.rollInfo}>
                        Chance: {result.passChance}% | Rolagem: {result.roll}
                    </p>

                    {/* Botão de avançar */}
                    {!runOver && (
                        <button style={styles.button} onClick={handleNextHouse}>
                            {isLastHouse ? "Ver resultado final" : "Próxima casa →"}
                        </button>
                    )}

                    {runOver && (
                        <div>
                            <p style={{ color: "#f44336", fontSize: "1.2rem" }}>
                                Todos os cavaleiros caíram. A travessia terminou.
                            </p>
                            <button style={{ ...styles.button, backgroundColor: "#f44336" }} onClick={handleNextHouse}>
                                Ver resultado final
                            </button>
                        </div>
                    )}

                </div>
            )}

            {/* Botão de resolver — só aparece antes de rolar o dado */}
            {!result && !runOver && (
                <button style={styles.button} onClick={handleResolve}>
                    Enfrentar {currentHouse.guardian}
                </button>
            )}

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

    header: {
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "700px",
        margin: "0 auto 32px",
        fontSize: "0.9rem",
        color: "#aaa",
    },

    progress: {
        color: "#FFD700",
        fontSize: "1rem",
    },

    teamStatus: {
        color: "#aaa",
    },

    houseCard: {
        backgroundColor: "#111",
        border: "2px solid #333",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "700px",
        margin: "0 auto 24px",
    },

    houseName: {
        fontSize: "1.8rem",
        color: "#FFD700",
        marginBottom: "8px",
    },

    guardian: {
        color: "#ccc",
        marginBottom: "12px",
    },

    houseDesc: {
        color: "#888",
        fontSize: "0.9rem",
        lineHeight: "1.5",
    },

    teamRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        maxWidth: "700px",
        margin: "0 auto 24px",
    },

    knightChip: {
        border: "1px solid",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "0.85rem",
        color: "#eee",
    },

    fallenChip: {
        border: "1px solid #444",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "0.85rem",
        color: "#555",
        textDecoration: "line-through",
    },

    resultBox: {
        border: "2px solid",
        borderRadius: "12px",
        padding: "24px",
        maxWidth: "700px",
        margin: "0 auto 24px",
        backgroundColor: "#111",
    },

    easterEgg: {
        color: "#FFD700",
        fontSize: "0.9rem",
        fontStyle: "italic",
        marginBottom: "16px",
        lineHeight: "1.5",
    },

    battleDesc: {
        color: "#ccc",
        fontSize: "0.95rem",
        fontStyle: "italic",
        lineHeight: "1.6",
        margin: "12px 0",
    },

    rollInfo: {
        color: "#555",
        fontSize: "0.8rem",
        marginTop: "12px",
    },

    button: {
        marginTop: "20px",
        padding: "12px 32px",
        fontSize: "1rem",
        backgroundColor: "#FFD700",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "Georgia, serif",
        fontWeight: "bold",
    },

};
