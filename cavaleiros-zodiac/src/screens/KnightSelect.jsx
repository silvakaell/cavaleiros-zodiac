// KnightSelect.jsx
// Seleção de cavaleiros em rodadas: o jogador escolhe 1 por vez.
// A cada escolha, um novo pool aleatório aparece. Total: 5 rodadas.

import { useState } from "react";
import knightsData from "../data/knights.json";
import { calcOverall, overallColor } from "../game/utils";

const TEAM_SIZE = 5;
const POOL_SIZE = 8; // opções por rodada

const EXCLUDED_RANKS = ["gold"];

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

// Gera um pool aleatório excluindo cavaleiros já escolhidos
function generatePool(allKnights, alreadyPicked) {
    const pickedIds = alreadyPicked.map(k => k.id);
    const eligible = allKnights.filter(k =>
        !EXCLUDED_RANKS.includes(k.rank) && !pickedIds.includes(k.id)
    );
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, POOL_SIZE);
}

export default function KnightSelect({ godId, onConfirm }) {

    const allKnights = knightsData.knights;

    // Time montado até agora
    const [team, setTeam] = useState([]);

    // Pool atual de opções
    const [pool, setPool] = useState(() => generatePool(allKnights, []));

    const pickCount = team.length; // quantas escolhas já foram feitas
    const isComplete = pickCount === TEAM_SIZE;

    // Quando o jogador clica num cavaleiro
    function handlePick(knight) {
        const newTeam = [...team, knight];
        setTeam(newTeam);

        if (newTeam.length < TEAM_SIZE) {
            // Gera novo pool excluindo quem já foi escolhido
            setPool(generatePool(allKnights, newTeam));
        }
    }

    // Quando o time está completo e o jogador confirma
    function handleConfirm() {
        onConfirm(team);
    }

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Monte seu Time</h1>

            {/* Progresso: qual rodada está */}
            {!isComplete && (
                <p style={styles.subtitle}>
                    Escolha {pickCount + 1}ª de {TEAM_SIZE} — selecione 1 cavaleiro
                </p>
            )}

            {/* Time escolhido até agora */}
            {team.length > 0 && (
                <div style={styles.teamBar}>
                    {team.map((k, i) => (
                        <span
                            key={k.id}
                            style={{ ...styles.teamChip, borderColor: RANK_COLORS[k.rank] || "#aaa" }}
                        >
                            {i + 1}. {k.name}
                        </span>
                    ))}
                    {/* Slots vazios */}
                    {Array.from({ length: TEAM_SIZE - team.length }).map((_, i) => (
                        <span key={i} style={styles.emptyChip}>
                            {team.length + i + 1}. ???
                        </span>
                    ))}
                </div>
            )}

            {/* Pool atual — só aparece se o time ainda não está completo */}
            {!isComplete && (
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
                                    <p style={{ ...styles.knightName, color: rankColor }}>
                                        {knight.name}
                                    </p>
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
            )}

            {/* Tela de confirmação quando o time está completo */}
            {isComplete && (
                <div style={styles.confirmBox}>
                    <p style={styles.confirmText}>Time formado. Prontos para a travessia?</p>
                    <button style={styles.button} onClick={handleConfirm}>
                        Iniciar Travessia
                    </button>
                </div>
            )}

        </div>
    );
}

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
    subtitle: {
        color: "#aaa",
        marginBottom: "24px",
        fontSize: "1rem",
    },
    teamBar: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
        maxWidth: "800px",
        margin: "0 auto 32px",
    },
    teamChip: {
        border: "1px solid",
        borderRadius: "20px",
        padding: "5px 16px",
        fontSize: "0.85rem",
        color: "#eee",
    },
    emptyChip: {
        border: "1px solid #333",
        borderRadius: "20px",
        padding: "5px 16px",
        fontSize: "0.85rem",
        color: "#444",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        maxWidth: "1100px",
        margin: "0 auto",
    },
    card: {
        backgroundColor: "#111",
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "20px",
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
        fontSize: "1rem",
        fontWeight: "bold",
    },
    overall: {
        fontSize: "0.85rem",
        fontWeight: "bold",
    },
    series: {
        fontSize: "0.75rem",
        color: "#777",
        marginBottom: "10px",
        textTransform: "capitalize",
    },
    stats: {
        display: "flex",
        gap: "10px",
        fontSize: "0.8rem",
        color: "#ccc",
        marginBottom: "10px",
        flexWrap: "wrap",
    },
    lore: {
        fontSize: "0.78rem",
        color: "#888",
        lineHeight: "1.4",
    },
    confirmBox: {
        marginTop: "40px",
    },
    confirmText: {
        color: "#aaa",
        marginBottom: "20px",
        fontSize: "1.1rem",
        fontStyle: "italic",
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
