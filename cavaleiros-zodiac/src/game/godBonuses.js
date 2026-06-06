// godBonuses.js
// Define as regras de cada deus escolhido no início da run.
// Cada deus modifica o jogo de forma diferente — estilo Balatro.

export const GODS = [

    {
        id: "athena",
        name: "Báculo de Atena",
        description: "A deusa protetora. Modo equilibrado, ideal para aprender o jogo.",
        advantage: "Pool de cavaleiros equilibrado. Todos os easter eggs de lore estão ativos.",
        disadvantage: "Nenhuma desvantagem — é o modo padrão.",
        color: "#FFD700",

        // Modificadores aplicados durante a run
        modifiers: {
            passChanceBonus: 0,          // sem bônus global na chance de passar
            poolFilter: null,             // sem filtro no pool — todos os cavaleiros disponíveis
            easterEggsMultiplier: 1.0,    // easter eggs funcionam normalmente
            reviveCharges: 0,             // sem revive garantido
            survivorScoreMultiplier: 1.0, // pontuação normal por sobreviventes
        }
    },

    {
        id: "hades",
        name: "Espada de Hades",
        description: "O deus dos mortos. Acesso a Espectros, mas os guardiões ficam mais agressivos.",
        advantage: "Espectros disponíveis no pool (poder alto). Cada cavaleiro que cai vira 'espectro' e pode ser usado nas últimas 3 casas.",
        disadvantage: "Chance base de todas as casas reduzida em 10%.",
        color: "#6A0DAD",

        modifiers: {
            passChanceBonus: -0.10,
            poolFilter: ["specter"],       // inclui espectros no pool
            easterEggsMultiplier: 1.0,
            reviveCharges: 0,
            survivorScoreMultiplier: 1.2,  // sobreviver com Hades vale mais
            specialRule: "fallen_become_specters", // cavaleiros caídos retornam como espectros nas últimas 3 casas
        }
    },

    {
        id: "poseidon",
        name: "Tridente de Poseidon",
        description: "O deus dos mares. Generais Marinhos no pool, mas casas de água são mortais.",
        advantage: "Generais Marinhos disponíveis no pool. Bônus de +15% nas casas de Aquário e Peixes.",
        disadvantage: "Casas de Aquário e Peixes têm chance base reduzida em 20% se o time não tiver cavaleiros de afinidade aquática.",
        color: "#1E90FF",

        modifiers: {
            passChanceBonus: 0,
            poolFilter: ["marina"],        // inclui Generais Marinhos no pool
            easterEggsMultiplier: 1.0,
            reviveCharges: 0,
            survivorScoreMultiplier: 1.0,
            houseModifiers: {
                aquarius: { bonus: 0.15, penalty: -0.20, penaltyCondition: "no_water_affinity" },
                pisces: { bonus: 0.15, penalty: -0.20, penaltyCondition: "no_water_affinity" },
            }
        }
    },

    {
        id: "mars",
        name: "Fúria de Marte",
        description: "O deus da guerra de Omega. Caos e poder bruto — a nova geração domina.",
        advantage: "Cavaleiros de Omega têm stats aumentados em 20%. Pool tem maior concentração de Omega.",
        disadvantage: "Cavaleiros clássicos perdem 15% de eficácia. Easter eggs de lore clássico não funcionam.",
        color: "#CC0000",

        modifiers: {
            passChanceBonus: 0,
            poolFilter: ["omega_heavy"],   // pool tem mais cavaleiros de Omega
            easterEggsMultiplier: 0,       // easter eggs desativados
            reviveCharges: 0,
            survivorScoreMultiplier: 1.0,
            seriesModifiers: {
                omega: { statMultiplier: 1.20 },
                classic: { statMultiplier: 0.85 },
                lost_canvas: { statMultiplier: 0.85 },
            }
        }
    },

    {
        id: "chronos",
        name: "O espírito de Chronos",
        description: "O deus do tempo de Next Dimension. Manipule o destino — mas o desgaste é real.",
        advantage: "Pode re-rolar o pool de cavaleiros 1 vez antes de montar o time. Pode repetir uma casa que falhou (1 vez por run).",
        disadvantage: "Cada cavaleiro perde 10 de cosmos por casa passada (desgaste temporal).",
        color: "#C0C0C0",

        modifiers: {
            passChanceBonus: 0,
            poolFilter: null,
            easterEggsMultiplier: 1.0,
            reviveCharges: 0,
            survivorScoreMultiplier: 1.3,  // difícil sobreviver, então vale mais
            specialRule: "time_decay",     // -10 cosmos por casa em cada cavaleiro
            rerollCharges: 1,              // pode re-rolar o pool uma vez
            retryCharges: 1,               // pode repetir uma casa uma vez
        }
    },

    {
        id: "artemis",
        name: "Onda de Ártemis",
        description: "A deusa da lua de Saintia Sho. Só as Cavaleiras de Atena podem brilhar aqui.",
        advantage: "Cavaleiras femininas têm stats aumentados em 30%. Pool prioriza personagens femininas.",
        disadvantage: "Cavaleiros de Ouro masculinos não aparecem no pool.",
        color: "#E0E0FF",

        modifiers: {
            passChanceBonus: 0,
            poolFilter: ["female_heavy"],  // pool prioriza personagens femininas
            easterEggsMultiplier: 1.5,     // easter eggs com personagens femininos valem mais
            reviveCharges: 0,
            survivorScoreMultiplier: 1.2,
            seriesModifiers: {
                female: { statMultiplier: 1.30 },
            },
            blacklist: ["male_gold"],      // sem Cavaleiros de Ouro masculinos
        }
    },

    {
        id: "apollo",
        name: "O calor de Apolo",
        description: "O deus do sol. Cavaleiros de Ouro são abundantes, mas os Bronzes somem.",
        advantage: "Pool tem alta concentração de Cavaleiros de Ouro. Stats de Gold aumentados em 15%.",
        disadvantage: "Cavaleiros de Bronze são raríssimos no pool (máximo 1 por run).",
        color: "#FFA500",

        modifiers: {
            passChanceBonus: 0.05,         // leve bônus global por ter Golds fortes
            poolFilter: ["gold_heavy"],    // pool tem muito mais Gold
            easterEggsMultiplier: 1.0,
            reviveCharges: 0,
            survivorScoreMultiplier: 1.0,
            rankModifiers: {
                gold: { statMultiplier: 1.15 },
                bronze: { statMultiplier: 1.0, maxInPool: 1 }, // máximo 1 Bronze no pool
            }
        }
    },

]

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Retorna um deus pelo id
export function getGod(id) {
    return GODS.find(g => g.id === id) || null;
}

// Retorna o bônus de chance de passagem global do deus
export function getGodPassBonus(godId) {
    const god = getGod(godId);
    return god ? god.modifiers.passChanceBonus : 0;
}

// Retorna o multiplicador de easter eggs do deus
export function getEasterEggMultiplier(godId) {
    const god = getGod(godId);
    return god ? god.modifiers.easterEggsMultiplier : 1.0;
}