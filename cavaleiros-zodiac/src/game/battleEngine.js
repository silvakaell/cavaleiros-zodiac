// battleEngine.js
// Responsável por calcular o resultado de cada casa durante a travessia.

// ─── CALCULA A CHANCE DE PASSAR UMA CASA ─────────────────────────────────────
export function calcPassChance(team, house, godBonus = 0) {

    let chance = house.basePassChance;

    const avgCosmos = team.reduce((sum, k) => sum + k.cosmos, 0) / team.length;
    const cosmosBonus = ((avgCosmos - 50) / 100) * 0.40;
    chance += cosmosBonus;

    const affinityBonus = house.affinityBonus;
    const affinityMatches = team.filter(k => affinityBonus.knights.includes(k.id));
    if (affinityMatches.length > 0) {
        chance += affinityBonus.bonus * affinityMatches.length;
    }

    chance += godBonus;
    chance = Math.max(0.05, Math.min(0.95, chance));

    return chance;
}


// ─── VERIFICA EASTER EGGS ────────────────────────────────────────────────────
// Mesmo que a condição seja atendida, o evento só dispara com certa probabilidade.
// Isso evita que eventos aconteçam com frequência demais.

export function checkEasterEgg(team, house) {
    const egg = house.easterEgg;
    const teamIds = team.map(k => k.id);

    if (egg.condition === "team_contains") {
        const triggered = egg.knights.some(id => teamIds.includes(id));
        if (!triggered) return null;
        // 35% de chance de disparar — condição fácil, então evento é mais raro
        if (Math.random() > 0.35) return null;
        return egg;
    }

    if (egg.condition === "team_contains_all") {
        const triggered = egg.knights.every(id => teamIds.includes(id));
        if (!triggered) return null;
        // 55% de chance de disparar — condição difícil, então evento é mais generoso
        if (Math.random() > 0.55) return null;
        return egg;
    }

    return null;
}


// ─── SIMULA O RESULTADO DE UMA CASA ─────────────────────────────────────────
export function resolveHouse(team, house, godBonus = 0) {

    let passChance = calcPassChance(team, house, godBonus);

    const egg = checkEasterEgg(team, house);
    let easterEggTriggered = false;

    if (egg) {
        passChance = Math.min(0.95, passChance + egg.bonusChance);
        easterEggTriggered = true;
    }

    const roll = Math.random();
    const passed = roll < passChance;

    let fallenKnight = null;
    if (!passed) {
        const randomIndex = Math.floor(Math.random() * team.length);
        fallenKnight = team[randomIndex];
    }

    let reviveGranted = false;
    if (easterEggTriggered && egg.effect === "revive") {
        reviveGranted = true;
    }

    return {
        house: house.id,
        passed,
        passChance: Math.round(passChance * 100),
        roll: Math.round(roll * 100),
        fallenKnight,
        easterEggTriggered,
        easterEggMessage: easterEggTriggered ? egg.message : null,
        reviveGranted,
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