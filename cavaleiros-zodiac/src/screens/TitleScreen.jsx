// TitleScreen.jsx
// Tela inicial do jogo — apresenta o conceito e as regras antes de começar.

export default function TitleScreen({ onStart }) {
    return (
        <div style={styles.container}>

            {/* Título */}
            <div style={styles.header}>
                <p style={styles.subtitle}>Cavaleiros do Zodíaco</p>
                <h1 style={styles.title}>A TRAVESSIA</h1>
                <p style={styles.tagline}>
                    Doze casas. Cinco cavaleiros. Um destino.
                </p>
            </div>

            {/* Conceito */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>O Desafio</h2>
                <p style={styles.text}>
                    O Santuário está em perigo. Atena precisa que seus cavaleiros atravessem
                    as 12 Casas do Zodíaco e cheguem ao Grande Mestre antes que seja tarde demais.
                    Mas os cavaleiros de Ouro não vão ceder sem luta.
                </p>
                <p style={styles.text}>
                    Escolha seu deus protetor, monte um time de 5 cavaleiros de qualquer série
                    da saga e tente completar a travessia. Cada decisão importa.
                </p>
            </div>

            {/* Regras */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Como funciona</h2>

                <div style={styles.ruleList}>
                    <div style={styles.rule}>
                        <span style={styles.ruleIcon}>⚔</span>
                        <p style={styles.ruleText}>
                            Em cada casa, seu time enfrenta o cavaleiro de Ouro. A chance de passar depende
                            dos stats dos seus cavaleiros, das afinidades e do deus escolhido.
                        </p>
                    </div>

                    <div style={styles.rule}>
                        <span style={styles.ruleIcon}>💀</span>
                        <p style={styles.ruleText}>
                            Se a casa não for superada, um cavaleiro cai. A travessia termina
                            quando todos os cinco forem derrotados.
                        </p>
                    </div>

                    <div style={styles.rule}>
                        <span style={styles.ruleIcon}>✨</span>
                        <p style={styles.ruleText}>
                            Certos times ativam eventos especiais baseados na história da saga.
                            Descubra as combinações certas para ganhar vantagens — e até reviver cavaleiros caídos.
                        </p>
                    </div>

                    <div style={styles.rule}>
                        <span style={styles.ruleIcon}>🏆</span>
                        <p style={styles.ruleText}>
                            Sua pontuação final depende das casas passadas, dos sobreviventes
                            e dos eventos especiais descobertos. Tente bater seu recorde.
                        </p>
                    </div>
                </div>
            </div>

            {/* Dica */}
            <p style={styles.hint}>
                💡 Jogadores que conhecem bem a saga serão recompensados.
            </p>

            {/* Botão */}
            <button style={styles.button} onClick={onStart}>
                Iniciar
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
        padding: "60px 20px",
        fontFamily: "Georgia, serif",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
    },

    header: {
        maxWidth: "700px",
    },

    subtitle: {
        color: "#888",
        fontSize: "0.9rem",
        letterSpacing: "4px",
        textTransform: "uppercase",
        marginBottom: "8px",
    },

    title: {
        fontSize: "4rem",
        color: "#FFD700",
        letterSpacing: "6px",
        margin: "0 0 16px",
    },

    tagline: {
        fontSize: "1.1rem",
        color: "#aaa",
        fontStyle: "italic",
    },

    section: {
        maxWidth: "680px",
        textAlign: "left",
    },

    sectionTitle: {
        fontSize: "1rem",
        color: "#FFD700",
        letterSpacing: "2px",
        textTransform: "uppercase",
        marginBottom: "16px",
        textAlign: "center",
    },

    text: {
        color: "#bbb",
        lineHeight: "1.8",
        marginBottom: "12px",
        fontSize: "0.95rem",
    },

    ruleList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    rule: {
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        backgroundColor: "#111",
        borderRadius: "10px",
        padding: "16px",
        border: "1px solid #222",
    },

    ruleIcon: {
        fontSize: "1.4rem",
        flexShrink: 0,
    },

    ruleText: {
        color: "#bbb",
        lineHeight: "1.6",
        fontSize: "0.9rem",
        margin: 0,
    },

    hint: {
        color: "#666",
        fontSize: "0.85rem",
        fontStyle: "italic",
    },

    button: {
        padding: "16px 60px",
        fontSize: "1.2rem",
        backgroundColor: "#FFD700",
        color: "#000",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "Georgia, serif",
        fontWeight: "bold",
        letterSpacing: "2px",
    },

};
