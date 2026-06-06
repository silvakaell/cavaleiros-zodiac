// utils.js
// Funções utilitárias reutilizáveis em qualquer parte do jogo.

// ─── OVERALL ─────────────────────────────────────────────────────────────────
// Calcula a nota geral de um cavaleiro com base nos seus stats.
// Cada stat tem um peso diferente — cosmos e poder pesam mais.

export function calcOverall(knight) {
    const { power, defense, speed, cosmos } = knight;

    const weighted =
        power * 0.30 +  // 30% — ofensividade
        defense * 0.25 +  // 25% — resistência
        speed * 0.20 +  // 20% — velocidade
        cosmos * 0.25;   // 25% — potencial de Cosmo

    return Math.round(weighted);
}

// ─── COR DO OVERALL ───────────────────────────────────────────────────────────
// Retorna uma cor baseada na nota — verde para alto, vermelho para baixo.

export function overallColor(overall) {
    if (overall >= 90) return "#FFD700"; // dourado — elite
    if (overall >= 80) return "#4CAF50"; // verde — forte
    if (overall >= 70) return "#FFC107"; // amarelo — médio
    if (overall >= 60) return "#FF9800"; // laranja — fraco
    return "#f44336";                    // vermelho — muito fraco
}