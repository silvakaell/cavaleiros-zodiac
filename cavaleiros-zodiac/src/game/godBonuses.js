// godBonuses.js
// ═══════════════════════════════════════════════════════════════════════════
// FONTE ÚNICA de configuração dos bônus de cada deus.
//
// Para EDITAR um deus  → altere o objeto dentro de GOD_RULES.
// Para ADICIONAR       → adicione em GOD_RULES + uma entrada em GODS (UI).
// Para REMOVER         → delete o objeto de GOD_RULES e remova de GODS.
//
// Campos disponíveis por deus:
//
//   passBonus               Bônus global de chance em todas as casas (ex: 0.10 = +10%)
//   houseBonus              { houseId: valor } — bônus em casa específica
//   housePenalty            { houseId: valor } — penalidade em casa específica
//   penaltyCondition        { houseId: [knightIds] } — se algum destes cavaleiros
//                             estiver no time → aplica houseBonus; senão → housePenalty
//   earlyHouseBonus         Bônus aplicado nas primeiras earlyHouseCount casas
//   earlyHouseCount         Número de casas que recebem earlyHouseBonus
//   cosmosMultiplierByRank  { rank: mult } — multiplica cosmos de cavaleiros daquele rank
//   cosmosMultiplierBySeries{ series: mult } — multiplica cosmos por série
//   femaleKnights           IDs de cavaleiras femininas que recebem femaleCosmosBonus
//   femaleCosmosBonus       Multiplicador de cosmos para as femaleKnights (ex: 1.30)
//   cosmosDecayPerHouse     Cosmos perdido por cavaleiro ao passar de cada casa (negativo)
// ═══════════════════════════════════════════════════════════════════════════

export const GOD_RULES = {

    // ── Atena ─────────────────────────────────────────────────────────────
    // Modo padrão. Sem vantagens nem desvantagens — ideal para aprender.
    atena: {
        passBonus: 0,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: {},
        femaleKnights: [],
        femaleCosmosBonus: 0,
        cosmosDecayPerHouse: 0,
    },

    // ── Hades ─────────────────────────────────────────────────────────────
    // Guardiões mais agressivos em todas as casas.
    hades: {
        passBonus: -0.10,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: {},
        femaleKnights: [],
        femaleCosmosBonus: 0,
        cosmosDecayPerHouse: 0,
    },

    // ── Poseidon ──────────────────────────────────────────────────────────
    // Bônus nas casas de água se o time tiver afinidade aquática;
    // penalidade se não tiver.
    poseidon: {
        passBonus: 0,
        houseBonus: { aquarius: 0.15, pisces: 0.15 },
        housePenalty: { aquarius: -0.20, pisces: -0.20 },
        // Se algum destes estiver no time → aplica houseBonus; senão → housePenalty
        penaltyCondition: {
            aquarius: ["camus", "aphrodite", "julian_solo", "myu", "charon"],
            pisces: ["aphrodite", "camus", "julian_solo"],
        },
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: {},
        femaleKnights: [],
        femaleCosmosBonus: 0,
        cosmosDecayPerHouse: 0,
    },

    // ── Marte ─────────────────────────────────────────────────────────────
    // A nova geração domina; cavaleiros clássicos perdem eficácia.
    marte: {
        passBonus: 0,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: {
            omega: 1.20,   // Omega +20% cosmos
            classic: 0.85,   // Clássico -15% cosmos
            lost_canvas: 0.85,   // Lost Canvas -15% cosmos
        },
        femaleKnights: [],
        femaleCosmosBonus: 0,
        easterEggsEnabled: false,
        cosmosDecayPerHouse: 0,
    },

    // ── Chronos ───────────────────────────────────────────────────────────
    // Desgaste temporal: cada cavaleiro perde cosmos a cada casa passada.
    chronos: {
        passBonus: 0,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: {},
        femaleKnights: [],
        femaleCosmosBonus: 0,
        cosmosDecayPerHouse: -10,   // -10 cosmos por cavaleiro a cada casa passada
    },

    // ── Ártemis ───────────────────────────────────────────────────────────
    // Cavaleiras femininas ganham bônus significativo de cosmos.
    artemis: {
        passBonus: 0,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: {},
        femaleKnights: ["shaina", "marin", "june", "seika", "freya", "hilda"],
        femaleCosmosBonus: 1.30,  // cavaleiras +30% cosmos
        cosmosDecayPerHouse: 0,
    },

    // ── Apolo ─────────────────────────────────────────────────────────────
    // Cavaleiros de Ouro dominam; leve bônus global.
    apolo: {
        passBonus: 0.05,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0,
        earlyHouseCount: 0,
        cosmosMultiplierByRank: { gold: 1.15 }, // Ouro +15% cosmos
        cosmosMultiplierBySeries: {},
        femaleKnights: [],
        femaleCosmosBonus: 0,
        cosmosDecayPerHouse: 0,
    },

    // ── Odin ──────────────────────────────────────────────────────────────
    // Forte nas primeiras casas.
    odin: {
        passBonus: 0,
        houseBonus: {},
        housePenalty: {},
        penaltyCondition: {},
        earlyHouseBonus: 0.20,  // +20% nas primeiras 7 casas
        earlyHouseCount: 7,
        cosmosMultiplierByRank: {},
        cosmosMultiplierBySeries: { asgard: 1.20 }, // Guerreiros de Asgard +20% cosmos
        femaleKnights: [],
        femaleCosmosBonus: 0,
        easterEggsEnabled: false,
        cosmosDecayPerHouse: 0,
    },

};


// ── GODS — para uso na UI (nome e cor) ────────────────────────────────────────

export const GODS = [
    { id: "atena", name: "Báculo de Atena", color: "#5a9de0" },
    { id: "hades", name: "Espada de Hades", color: "#9b59b6" },
    { id: "poseidon", name: "Tridente de Poseidon", color: "#1abc9c" },
    { id: "marte", name: "Fúria de Marte", color: "#e74c3c" },
    { id: "apolo", name: "O calor de Apolo", color: "#e8a020" },
    { id: "chronos", name: "O espírito de Chronos", color: "#8ea8b8" },
    { id: "artemis", name: "Onda de Ártemis", color: "#d4a820" },
    { id: "odin", name: "Lança de Odin", color: "#78c4d8" },
];


// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getRules(godId) {
    return GOD_RULES[godId] ?? GOD_RULES.atena;
}

// Aplica os modificadores de cosmos do deus ao time.
// Retorna um novo array — nunca modifica o original.
export function applyGodCosmosModifiers(team, godId) {
    const r = getRules(godId);
    return team.map(k => {
        let cosmos = k.cosmos;
        if (r.cosmosMultiplierByRank[k.rank]) cosmos *= r.cosmosMultiplierByRank[k.rank];
        if (r.cosmosMultiplierBySeries[k.series]) cosmos *= r.cosmosMultiplierBySeries[k.series];
        if (r.femaleCosmosBonus && r.femaleKnights.includes(k.id)) cosmos *= r.femaleCosmosBonus;
        return { ...k, cosmos: Math.round(Math.min(100, cosmos)) };
    });
}

// Retorna o bônus/penalidade total de chance para uma casa específica.
// houseIndex: índice 0-based da casa na run (para earlyHouseBonus).
export function getGodHouseBonus(godId, houseId, team, houseIndex = 0) {
    const r = getRules(godId);
    const teamIds = team.map(k => k.id);
    let bonus = r.passBonus;

    // Bônus nas primeiras N casas (ex: Odin)
    if (r.earlyHouseBonus && houseIndex < r.earlyHouseCount) {
        bonus += r.earlyHouseBonus;
    }

    // Bônus/penalidade por casa específica (ex: Poseidon)
    const hasHouseRule = houseId in r.houseBonus || houseId in r.housePenalty;
    if (hasHouseRule) {
        const condition = r.penaltyCondition[houseId];
        if (condition) {
            const hasAffinity = condition.some(id => teamIds.includes(id));
            bonus += hasAffinity ? (r.houseBonus[houseId] ?? 0) : (r.housePenalty[houseId] ?? 0);
        } else {
            bonus += r.houseBonus[houseId] ?? 0;
        }
    }

    return bonus;
}

// Retorna o decaimento de cosmos por casa (valor negativo = perda).
export function getCosmosDecay(godId) {
    return getRules(godId).cosmosDecayPerHouse;
}

// Retorna o bônus global de passagem (passBonus apenas).
// Prefira getGodHouseBonus para cálculo completo.
export function getGodPassBonus(godId) {
    return getRules(godId).passBonus;
}