// battleEngine.js
// Responsável por calcular o resultado de cada casa durante a travessia.

// ─── CALCULA A CHANCE DE PASSAR UMA CASA ─────────────────────────────────────
// Recebe o time atual (array de cavaleiros) e a casa atual (objeto da house)
// Retorna um número entre 0 e 1 (ex: 0.72 = 72% de chance de passar)

export function calcPassChance(team, house, godBonus = 0) {

    // 1. Começa com a chance base da casa
    let chance = house.basePassChance;

    // 2. Calcula a média de cosmos do time
    const avgCosmos = team.reduce((sum, k) => sum + k.cosmos, 0) / team.length;

    // 3. Quanto maior o cosmos médio do time, maior o bônus (máximo +0.20)
    const cosmosBonus = ((avgCosmos - 50) / 100) * 0.40;
    chance += cosmosBonus;

    // 4. Verifica afinidades: cada cavaleiro com afinidade nessa casa dá bônus
    const affinityBonus = house.affinityBonus;
    const affinityMatches = team.filter(k =>
        affinityBonus.knights.includes(k.id)
    );
    if (affinityMatches.length > 0) {
        chance += affinityBonus.bonus * affinityMatches.length;
    }

    // 5. Bônus do deus escolhido pelo jogador (vem da seleção de deus)
    chance += godBonus;

    // 6. Limita entre 5% e 95% — nunca garante nem impossibilita a passagem
    chance = Math.max(0.05, Math.min(0.95, chance));

    return chance;
}


// ─── VERIFICA EASTER EGGS ────────────────────────────────────────────────────
// Recebe o time e a casa, retorna o easter egg se ativado ou null

export function checkEasterEgg(team, house) {
    const egg = house.easterEgg;
    const teamIds = team.map(k => k.id);

    if (egg.condition === "team_contains") {
        // Basta ter UM dos cavaleiros listados
        const triggered = egg.knights.some(id => teamIds.includes(id));
        return triggered ? egg : null;
    }

    if (egg.condition === "team_contains_all") {
        // Precisa ter TODOS os cavaleiros listados
        const triggered = egg.knights.every(id => teamIds.includes(id));
        return triggered ? egg : null;
    }

    return null;
}


// ─── SIMULA O RESULTADO DE UMA CASA ─────────────────────────────────────────
// Retorna um objeto descrevendo o que aconteceu nessa casa

export function resolveHouse(team, house, godBonus = 0) {

    // Calcula a chance final de passar
    let passChance = calcPassChance(team, house, godBonus);

    // Verifica se algum easter egg foi ativado
    const egg = checkEasterEgg(team, house);
    let easterEggTriggered = false;

    if (egg) {
        // Easter egg dá bônus extra na chance de passagem
        passChance = Math.min(0.95, passChance + egg.bonusChance);
        easterEggTriggered = true;
    }

    // Rola o dado: número aleatório entre 0 e 1
    const roll = Math.random();
    const passed = roll < passChance;

    // Se falhou, um cavaleiro aleatório do time cai
    let fallenKnight = null;
    if (!passed) {
        const randomIndex = Math.floor(Math.random() * team.length);
        fallenKnight = team[randomIndex];
    }

    // Verifica se o easter egg concede revive
    let reviveGranted = false;
    if (easterEggTriggered && egg.effect === "revive") {
        reviveGranted = true;
    }

    return {
        house: house.id,
        passed,
        passChance: Math.round(passChance * 100), // em % para exibir na tela
        roll: Math.round(roll * 100),
        fallenKnight,
        easterEggTriggered,
        easterEggMessage: easterEggTriggered ? egg.message : null,
        reviveGranted,
    };
}


// ─── CALCULA PONTUAÇÃO FINAL ─────────────────────────────────────────────────
// Chamada no fim da run para gerar o placar

export function calcScore(results, survivors, easterEggsFound) {
    const housesPassed = results.filter(r => r.passed).length;

    // Pontos por casa passada
    const housePoints = housesPassed * 100;

    // Bônus por sobreviventes
    const survivorPoints = survivors * 150;

    // Bônus por easter eggs descobertos
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