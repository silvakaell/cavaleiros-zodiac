// battleDescriptions.js
// Pools de descrições narrativas para as batalhas.
// Recebe lang para escolher o idioma correto de T[lang].battles.

import { T } from "../i18n/translations";

// ─── FUNÇÃO PRINCIPAL ─────────────────────────────────────────────────────────
// passed: boolean, passChance: 0–100, lang: "pt" | "en"

export function getBattleDescription(passed, passChance, lang = "pt") {
    const pools = T[lang].battles;
    let pool;

    if (passed) {
        if (passChance >= 75) pool = pools.easyWin;
        else if (passChance >= 50) pool = pools.fairWin;
        else pool = pools.narrowWin;
    } else {
        if (passChance >= 50) pool = pools.honorableLoss;
        else pool = pools.heavyLoss;
    }

    return pool[Math.floor(Math.random() * pool.length)];
}