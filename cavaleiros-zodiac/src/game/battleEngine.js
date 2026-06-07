// battleEngine.js
// Responsável por calcular o resultado de cada casa durante a travessia.
//
// Suporta tanto o formato antigo (singular) quanto o novo (plural):
//   affinityBonus   → objeto único  (legado)
//   affinityBonuses → array         (novo — múltiplas regras por casa)
//   easterEgg       → objeto único  (legado)
//   easterEggs      → array         (novo — múltiplos eventos por casa)

import { getGodHouseBonus } from "./godBonuses";


// ─── HELPER: normaliza singular/plural ───────────────────────────────────────

function getAffinities(house) {
    if (house.affinityBonuses) return house.affinityBonuses;
    if (house.affinityBonus) return [house.affinityBonus];
    return [];
}

function getEasterEggs(house) {
    if (house.easterEggs) return house.easterEggs;
    if (house.easterEgg) return [house.easterEgg];
    return [];
}


// ─── CALCULA A CHANCE DE PASSAR UMA CASA ─────────────────────────────────────

// godId e houseIndex são usados para aplicar os bônus do deus corretos.
export function calcPassChance(team, house, godId = "atena", houseIndex = 0) {

    let chance = house.basePassChance;

    // Bônus de cosmos médio do time
    const avgCosmos = team.reduce((sum, k) => sum + k.cosmos, 0) / team.length;
    const cosmosBonus = ((avgCosmos - 50) / 100) * 0.40;
    chance += cosmosBonus;

    // Bônus de afinidade — suporta múltiplas regras
    for (const ab of getAffinities(house)) {
        const matches = team.filter(k => ab.knights.includes(k.id));
        if (matches.length > 0) {
            chance += ab.bonus * matches.length;
        }
    }

    // Bônus do deus (passBonus global + bônus/penalidade por casa)
    chance += getGodHouseBonus(godId, house.id, team, houseIndex);

    chance = Math.max(0.05, Math.min(0.95, chance));

    return chance;
}


// ─── VERIFICA EASTER EGGS ────────────────────────────────────────────────────
// Percorre todos os easter eggs da casa em ordem.
// Retorna o primeiro que for ativado, ou null.
//
// Condições disponíveis:
//   "team_contains"      — time tem QUALQUER um dos knights listados  (35% de disparo)
//   "team_contains_any"  — alias de team_contains                     (35% de disparo)
//   "team_contains_all"  — time tem TODOS os knights listados         (55% de disparo)

export function checkEasterEgg(team, house) {
    const teamIds = team.map(k => k.id);

    for (const egg of getEasterEggs(house)) {

        let conditionMet = false;

        if (egg.condition === "team_contains" || egg.condition === "team_contains_any") {
            conditionMet = egg.knights.some(id => teamIds.includes(id));
            // Condição fácil → evento menos frequente
            if (conditionMet && Math.random() > 0.35) conditionMet = false;
        }

        else if (egg.condition === "team_contains_all") {
            conditionMet = egg.knights.every(id => teamIds.includes(id));
            // Condição difícil → evento mais generoso
            if (conditionMet && Math.random() > 0.55) conditionMet = false;
        }

        if (conditionMet) return egg;
    }

    return null;
}


// ─── SIMULA O RESULTADO DE UMA CASA ─────────────────────────────────────────

// godId: ID do deus selecionado (ex: "atena", "hades")
// houseIndex: índice 0-based da casa na run (para bônus de casas iniciais)
export function resolveHouse(team, house, godId = "atena", houseIndex = 0) {

    // ── Easter eggs têm precedência: se disparar, a casa é resolvida
    //    antes de qualquer batalha — nenhum cavaleiro cai.
    //    Easter eggs sempre são verificados, independente do deus.
    const egg = checkEasterEgg(team, house);

    if (egg) {
        return {
            house: house.id,
            passed: true,
            passChance: 100,
            roll: 0,
            fallenKnight: null,
            easterEggTriggered: true,
            easterEggMessage: egg.message,
            reviveGranted: egg.effect === "revive",
        };
    }

    // ── Sem easter egg: batalha normal ───────────────────────────────
    const passChance = calcPassChance(team, house, godId, houseIndex);
    const roll = Math.random();
    const passed = roll < passChance;

    let fallenKnight = null;
    if (!passed) {
        const randomIndex = Math.floor(Math.random() * team.length);
        fallenKnight = team[randomIndex];
    }

    return {
        house: house.id,
        passed,
        passChance: Math.round(passChance * 100),
        roll: Math.round(roll * 100),
        fallenKnight,
        easterEggTriggered: false,
        easterEggMessage: null,
        reviveGranted: false,
    };
}


// ─── CALCULA PONTUAÇÃO FINAL ─────────────────────────────────────────────────

export function calcScore(results, survivors, easterEggsFound) {
    const housesPassed = results.filter(r => r.passed).length;

    const housePoints = housesPassed * 100;
    const survivorPoints = survivors * 150;
    const eggPoints = easterEggsFound * 200;
    const total = housePoints + survivorPoints + eggPoints;

    return {
        housesPassed,
        survivors,
        easterEggsFound,
        housePoints,
        survivorPoints,
        eggPoints,
        total,
    };
}