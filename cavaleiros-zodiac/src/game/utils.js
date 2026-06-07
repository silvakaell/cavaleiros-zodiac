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
// Retorna uma cor baseada na nota:
//   90+      → ouro reluzente
//   85–89    → roxo nobre
//   80–84    → prata reluzente
//   abaixo   → bronze reluzente

export function overallColor(overall) {
    if (overall >= 90) return "#FFD700";  // ouro
    if (overall >= 85) return "#b36fff";  // roxo nobre
    if (overall >= 80) return "#d8eaf7";  // prata reluzente
    return "#e0a060";                     // bronze reluzente
}
