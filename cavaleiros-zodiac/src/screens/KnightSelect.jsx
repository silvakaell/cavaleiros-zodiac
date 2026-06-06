// KnightSelect.jsx
// Tela de seleção de cavaleiros.
// Recebe um pool aleatório e o jogador escolhe 5 para a run.

import { useState, useEffect } from "react";
import knightsData from "../data/knights.json";

// Quantos cavaleiros aparecem no pool para escolha
const POOL_SIZE = 12;

// Quantos o jogador precisa escolher
const TEAM_SIZE = 5;

// Embaralha um array e retorna os primeiros N itens
function getRandomPool(knights, size) {
    const shuffled = [...knights].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, size);
}

// Cor por rank
const RANK_COLORS = {
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    god: "#FF00FF",
};

export default function KnightSelect({ godId, onConfirm }) {

    // Pool de cavaleiros disponíveis para escolha
    const [pool, setPool] = useState([]);

    // Time montado pelo jogador (máximo 5)
    const [team, setTeam] = useState([]);

    // Gera o pool uma vez quando a tela carrega
    useEffect(() => {
        const randomPool = getRandomPool(knightsData.knights, POOL_SIZE);
        setPool(randomPool);
    }, []);

    // Adiciona ou remove um cavaleiro do time ao clicar
    function toggleKnight(knight) {
        const isInTeam = team.some(k => k.id === knight.id);

        if (isInTeam) {
            // Remove do time
            setTeam(team.filter(k => k.id !== knight.id));
        } else {
            // Adiciona só se ainda não chegou no limite
            if (team.length < TEAM_SIZE) {
                setTeam([...team, knight]);
            }
        }
    }

    const teamFull = team.length === TEAM_SIZE;

    return (
        <div style={styles.container}>

            <h1 style={styles.title}>Monte seu Time</h1>
            <p style={styles.subtitle}>
                Escolha {TEAM_SIZE} cavaleiros para a travessia das 12 casas.
                &nbsp;({team.length}/{TEAM_SIZE} selecionados)
            </p>

            {/* Pool de cavaleiros disponíveis */}
            <div style={styles.grid}>
                {pool.map((knight) => {
                    const isSelected = team.some(k => k.id === knight.id);
                    const isDisabled = !isSelected && teamFull;

                    return (
                        <div
                            key={knight.id}
                            onClick={() => !isDisabled && toggleKnight(knight)}
                            style={{
                                ...styles.card,
                                borderColor: isSelected
                                    ? RANK_COLORS[knight.rank]
                                    : "#333",
                                opacity: isDisabled ? 0.4 : 1,
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                boxShadow: isSelected
                                    ? `0 0 12px ${RANK_COLORS[knight.rank]}`
                                    : "none",
                            }}
                        >
                            {/* Nome e rank */}
                            <p style={{ ...styles.knightName, color: RANK_COLORS[knight.rank] }}>
                                {knight.name}
                            </p>
                            <p style={styles.series}>{knight.series.replace("_", " ")}</p>

                            {/* Stats */}
                            <div style={styles.stats}>
                                <span>⚔ {knight.power}</span>
                                <span>🛡 {knight.defense}</span>
                                <span>💨 {knight.speed}</span>
                                <span>✨ {knight.cosmos}</span>
                            </div>

                            {/* Lore */}
                            <p style={styles.lore}>{knight.lore}</p>
                        </div>
                    );
                })}
            </div>

            {/* Time montado */}
            {team.length > 0 && (
                <div style={styles.teamBar}>
                    <p style={styles.teamLabel}>Seu time:</p>
                    <div style={styles.teamList}>
                        {team.map(k => (
                            <span
                                key={k.id}
                                style={{ ...styles.teamChip, borderColor: RANK_COLORS[k.rank] }}
                            >
                                {k.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Botão de confirmação — só aparece com 5 escolhidos */}
            {teamFull && (
                <button style={styles.button} onClick={() => onConfirm(team)}>
                    Iniciar Travessia
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

    title: {
        fontSize: "2.2rem",
        color: "#FFD700",
        marginBottom: "8px",
    },

    subtitle: {
        color: "#aaa",
        marginBottom: "32px",
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
        padding: "16px",
        textAlign: "left",
        transition: "all 0.2s",
    },

    knightName: {
        fontSize: "1rem",
        fontWeight: "bold",
        marginBottom: "2px",
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

    teamBar: {
        marginTop: "32px",
        padding: "16px",
        backgroundColor: "#111",
        borderRadius: "10px",
        maxWidth: "800px",
        margin: "32px auto 0",
    },

    teamLabel: {
        color: "#FFD700",
        marginBottom: "10px",
    },

    teamList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
    },

    teamChip: {
        border: "1px solid",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "0.85rem",
        color: "#eee",
    },

    button: {
        marginTop: "32px",
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