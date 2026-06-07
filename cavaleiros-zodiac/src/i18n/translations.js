// translations.js
// Fonte única de todas as strings da UI em PT e EN.
// Para adicionar idioma: adicione uma chave de nível superior com o mesmo shape.

export const T = {

  // ══════════════════════════════════════════════════════════════════════════
  // PORTUGUÊS
  // ══════════════════════════════════════════════════════════════════════════
  pt: {
    lang: "pt",

    footer: {
      creator:   "Criado por @kamonbr",
      game:      "A Travessia — fã-game não oficial",
      copyright: "Cavaleiros do Zodíaco © Masami Kurumada · 2025",
    },

    // ── Signos (12 casas, em ordem) ──────────────────────────────────────
    houses: ["Áries","Touro","Gêmeos","Câncer","Leão","Virgem","Libra","Escorpião","Sagitário","Capricórnio","Aquário","Peixes"],

    // ── TitleScreen ───────────────────────────────────────────────────────
    title: {
      eyebrow: "Cavaleiros do Zodíaco",
      game:    "A TRAVESSIA",
      tagline: "uma constelação. um deus. um objetivo.",
      start:   "Iniciar",
      rules: [
        { icon: "⚔", text: "Em cada casa, seu time enfrenta o guardião. A chance de passar depende dos stats dos cavaleiros, das afinidades e do deus escolhido." },
        { icon: "💀", text: "Se a casa não for superada, um cavaleiro cai. A run termina quando todos forem derrotados." },
        { icon: "✨", text: "Certos times ativam easter eggs do lore. Descubra as combinações certas para ganhar vantagens — e até reviver cavaleiros caídos." },
        { icon: "🏆", text: "Sua pontuação final depende das casas passadas, dos sobreviventes e dos eventos especiais descobertos. Bata seu recorde." },
      ],
    },

    // ── LocationSelect ────────────────────────────────────────────────────
    location: {
      eyebrow:    "A TRAVESSIA",
      title:      "Campo de Batalha",
      sub:        "Escolha onde sua saga começa",
      comingSoon: "EM BREVE",
      startBtn:   "Iniciar Travessia →",
      back:       "← Voltar",
      units:      { 12: "casas", 7: "batalhas" },
      locs: {
        sanctuary: {
          name:        "Santuário de Atena",
          subtitle:    "As 12 Casas do Zodíaco",
          description: "Atravesse as 12 casas do Santuário, enfrentando os Cavaleiros de Ouro que guardam o caminho até Atena.",
        },
        asgard: {
          name:        "Reino de Asgard",
          subtitle:    "Os 7 Guerreiros de Odin",
          description: "Enfrente os poderosos Guerreiros de Odin nas terras geladas de Asgard. Uma jornada para os mais corajosos.",
        },
        poseidon: {
          name:        "Império de Poseidon",
          subtitle:    "Os 7 Generais Marinhos",
          description: "Mergulhe nas profundezas do oceano e enfrente os Generais Marinhos de Poseidon nas ruínas subaquáticas.",
        },
      },
    },

    // ── GodSelect ─────────────────────────────────────────────────────────
    god: {
      eyebrow: "Cavaleiros do Zodíaco — A Travessia",
      title:   "Escolha seu Deus",
      sub:     "Cada deus muda as regras da travessia. Escolha com sabedoria.",
      hint:    "Selecione\num deus",
      confirm: "Confirmar →",
      back:    "← Voltar",
      gods: {
        atena: {
          name:  "Báculo de Atena",
          short: "Atena",
          desc:  "A deusa protetora. Modo equilibrado, ideal para aprender o jogo.",
          pros:  ["Pool de cavaleiros equilibrado.", "Todos os easter eggs de lore estão ativos."],
          cons:  ["Nenhuma desvantagem — é o modo padrão."],
        },
        hades: {
          name:  "Espada de Hades",
          short: "Hades",
          desc:  "O deus dos mortos. Guardiões mais agressivos, mas a morte não é definitiva.",
          pros:  ["35% de chance de reviver um cavaleiro caído em batalha."],
          cons:  ["Chance base de todas as casas reduzida em 10%."],
        },
        poseidon: {
          name:  "Tridente de Poseidon",
          short: "Poseidon",
          desc:  "O deus dos mares. Generais Marinhos no pool, mas casas de água são mortais.",
          pros:  ["Pool prioriza Generais Marinhos.", "Bônus de +15% nas casas de Aquário e Peixes com time aquático."],
          cons:  ["Aquário e Peixes têm -20% sem cavaleiros de afinidade aquática."],
        },
        marte: {
          name:  "Fúria de Marte",
          short: "Marte",
          desc:  "O deus da guerra de Omega. Caos e poder bruto — a nova geração domina.",
          pros:  ["Pool restrito a cavaleiros Omega.", "Cosmos de Omega aumentado em 20%."],
          cons:  ["Cavaleiros clássicos e Lost Canvas perdem 15% de cosmos."],
        },
        apolo: {
          name:  "O calor de Apolo",
          short: "Apolo",
          desc:  "O deus do sol. Os Cavaleiros de Ouro, normalmente inacessíveis, surgem no draft.",
          pros:  ["Cavaleiros de Ouro aparecem no pool de draft.", "Cosmos de Gold aumentado em 15%."],
          cons:  ["Leve vantagem — a verdadeira dificuldade são as casas finais."],
        },
        chronos: {
          name:  "O espírito de Chronos",
          short: "Chronos",
          desc:  "O deus do tempo. O cosmos dos cavaleiros se desgasta com o passar das casas.",
          pros:  ["Cosmos inicial dos cavaleiros inalterado."],
          cons:  ["Cada cavaleiro perde 10 de cosmos por casa passada (desgaste temporal)."],
        },
        artemis: {
          name:  "Onda de Ártemis",
          short: "Ártemis",
          desc:  "A deusa da lua. Apenas cavaleiras femininas compõem este time.",
          pros:  ["Cavaleiras têm cosmos aumentado em 30%.", "Pool restrito a cavaleiras femininas."],
          cons:  ["Time composto exclusivamente por cavaleiras — pool limitado."],
        },
        odin: {
          name:  "Lança de Odin",
          short: "Odin",
          desc:  "O deus nórdico de Asgard. Os Guerreiros do Norte ingressam na travessia.",
          pros:  ["Pool prioriza Guerreiros de Asgard (+20% cosmos).", "Bônus de +20% nas sete primeiras casas."],
          cons:  ["Pouca vantagem nas casas finais."],
        },
        renegado: {
          name:  "Sem Divindade",
          short: "Sem Divindade",
          desc:  "Sem deus, sem lealdade. Renegados traçam seu próprio caminho.",
          pros:  ["Cavaleiros negros: +25% cosmos.", "+5% global — imprevisíveis.", "Pool prefere renegados."],
          cons:  ["Cavaleiros divinos: -8% a -20% cosmos."],
        },
      },
    },

    // ── KnightSelect — tela de tamanho ────────────────────────────────────
    size: {
      eyebrow: "Cavaleiros do Zodíaco — A Travessia",
      title:   "Monte seu Time",
      sub:     "Quantos cavaleiros vão na travessia?",
      unit:    "cavaleiros",
      desc: {
        3: "Ágil. Cada cavaleiro vale ouro — a perda de um é crítica.",
        4: "Equilibrado. Margem de erro existe, mas cobra o seu preço.",
        5: "Poderoso. Mais fôlego para as casas mais duras do santuário.",
      },
    },

    // ── KnightSelect — draft ──────────────────────────────────────────────
    draft: {
      title:      "Monte seu Time",
      pickLabel:  (n, total) => `${n}ª escolha de ${total}`,
      boardEmpty: "Escolha seus guerreiros",
      boardSlot:  (n) => `${n}ª escolha`,
      boardFull:  "Constelação formada",
      boardCount: (n, total) => `${n} / ${total} escolhidos`,
      confirmMsg: "Constelação formada. A travessia pode começar.",
      confirmBtn: "Iniciar Travessia",
      poolLabel:  "Escolha 1 cavaleiro",
    },

    // ── Run ───────────────────────────────────────────────────────────────
    run: {
      houseCounter:  (n, total) => `Casa ${n} / ${total}`,
      aliveCounter:  (n) => `Vivos: ${n}`,
      fallenCounter: (n) => `Caídos: ${n}`,
      topbarSep:     "|",
      sections: {
        blessing:      "Bênção",
        constellation: "Constelação",
        team:          "Time",
        menu:          "← Menu",
      },
      battle: {
        faceBtn:    (name) => `Enfrentar ${name}`,
        passed:     "✓ Passagem garantida!",
        failed:     "✗ Barreira não rompida!",
        knightFell: (name) => `💀 ${name} caiu nesta batalha.`,
        revived:    "✨ Um cavaleiro caído foi revivido!",
        rollInfo:   (chance, roll) => `${chance}% · rolagem ${roll}`,
        nextHouse:  "Próxima casa →",
        seeResult:  "Ver resultado final",
        allFallen:  "Todos os cavaleiros caíram.",
        retry:      "↺ Lutar de novo",
      },
      calc: {
        header:    "Cálculo da batalha",
        vs:        (tc, gname, gc) => `time · cosmos ${tc}  vs  ${gname} · cosmos ${gc}`,
        teamCosmos:     "Cosmos time",
        guardianCosmos: "Cosmos guardião",
        base:      "Base da casa",
        teamBonus: "Cosmos do time",
        affinity:  "Afinidade",
        godBonus:  "Bônus de deus",
        finalLine: "Chance final",
        passed:    "passou",
        failed:    "falhou",
      },
    },

    // ── Result ────────────────────────────────────────────────────────────
    result: {
      title:   "Fim da Travessia",
      blessing: "Bênção:",
      constellation: {
        title:      "Sua Constelação",
        alive:      "vivo",
        fallen:     "caído",
        fallenList: "Cavaleiros caídos",
      },
      map: {
        passed:     "passada",
        failed:     "falhou",
        special:    "evento especial",
        notReached: "não alcançada",
      },
      score: {
        title:       "Pontuação Final",
        houses:      "Casas passadas",
        survivors:   "Sobreviventes",
        special:     "Eventos especiais",
        arrow:       "→",
        pts:         "pts",
      },
      history: {
        egg:    "✦ especial",
      },
      buttons: {
        retry:   "Tentar Novamente",
        restart: "Nova Travessia",
      },
      messages: {
        perfect:       "Travessia Perfeita. Atena sorri.",
        great:         "Travessia concluída. Poucos caíram no caminho.",
        good:          "Travessia concluída — à custa de muitas batalhas.",
        complete:      "Chegaram ao fim, mas o preço foi alto.",
        almostThere:   "Quase lá. Os deuses reconhecem sua força.",
        epic:          "Além da metade — a batalha foi épica.",
        halfway:       "Metade do caminho. A saga continua.",
        brave:         "A jornada foi curta, mas valente.",
        brutal:        "Os guardiões foram implacáveis. Tente de novo.",
      },
    },

    // ── battleDescriptions ────────────────────────────────────────────────
    battles: {
      easyWin: [
        "O Cosmo do time transbordou pelas paredes da casa. O guardião recuou sem chance de reação.",
        "A batalha foi decidida antes mesmo do primeiro golpe. O Cosmo dos cavaleiros era incomparável.",
        "O guardião ergueu os olhos e sentiu o peso daquele Cosmo. Não havia o que fazer.",
        "Uma rajada de energia dourada atravessou a casa. O caminho estava livre.",
        "O guardião tentou resistir — foi em vão. Os cavaleiros passaram com facilidade desconcertante.",
        "Nem o mais orgulhoso dos guardiões poderia negar aquele Cosmo. A passagem foi concedida.",
        "A armadura brilhou. O guardião cedeu. A travessia continuou.",
      ],
      fairWin: [
        "Golpes pesados foram trocados. No fim, os cavaleiros se ergueram e o guardião não.",
        "A batalha durou o suficiente para deixar marcas. Mas a passagem foi conquistada.",
        "O guardião era forte. Os cavaleiros eram mais determinados.",
        "O Cosmo dos dois lados aqueceu as pedras da casa. No fim, um lado queimou mais forte.",
        "Cada golpe foi respondido. Cada resposta foi superada. A porta se abriu.",
        "Não foi sem esforço — mas jamais seria. O guardião foi superado.",
        "Os cavaleiros sentiram o peso daquele confronto. E seguiram em frente mesmo assim.",
        "A armadura rangeu. O Cosmo vacilou. E então explodiu — levando o guardião com ele.",
        "Um rugido ecoou pela casa. Quando a poeira baixou, apenas os cavaleiros estavam de pé.",
      ],
      narrowWin: [
        "Estavam no limite. Um cavaleiro caiu de joelhos — mas se levantou. A casa foi superada.",
        "O guardião quase venceu. Quase. Um último Cosmo impediu o inevitável.",
        "A derrota estava na boca — e foi engolida de volta com tudo o que sobrou de força.",
        "Nenhum deles sairia ileso. Mas sairiam. E isso era o suficiente.",
        "O guardião sorriu antes do golpe final. Não deveria ter hesitado.",
        "Três vezes pareceu que tudo acabaria ali. Três vezes o Cosmo respondeu ao desespero.",
        "A batalha foi feia, dura e incerta. E os cavaleiros venceram do mesmo jeito.",
        "Força já não bastava. Foi a vontade que abriu aquela porta.",
      ],
      honorableLoss: [
        "O destino foi cruel com os fortes. O guardião venceu por uma margem que a história não vai registrar.",
        "Os cavaleiros lutaram com tudo. O tudo simplesmente não foi suficiente desta vez.",
        "Ninguém poderia ter feito mais. E ainda assim a porta permaneceu fechada.",
        "O Cosmo ardeu até o fim. Mas o fim chegou cedo demais.",
        "A batalha foi digna. A derrota também. O guardião curvou a cabeça antes de encerrar.",
        "Houve um momento em que a vitória parecia certa. Esse momento passou.",
        "O guardião ergueu o braço ao fim, não em triunfo — em respeito.",
      ],
      heavyLoss: [
        "O guardião mal se moveu. A casa defendeu a si mesma.",
        "Não havia distância suficiente entre o poder deles e o poder do guardião.",
        "O Cosmo dos cavaleiros mal aqueceu o ar. O guardião olhou com desdém.",
        "A diferença era grande demais. Às vezes o abismo é real.",
        "O guardião não se dignificou a usar sua técnica final. Não precisou.",
        "A armadura não foi suficiente. O Cosmo não foi suficiente. Nada foi.",
        "Cada golpe foi absorvido como vento. A resposta do guardião não deixou dúvidas.",
        "Havia coragem ali. Coragem sem poder é só uma bela história para contar depois.",
      ],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH
  // ══════════════════════════════════════════════════════════════════════════
  en: {
    lang: "en",

    footer: {
      creator:   "Created by @kamonbr",
      game:      "The Crossing — unofficial fan game",
      copyright: "Saint Seiya © Masami Kurumada · 2025",
    },

    houses: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"],

    // ── TitleScreen ───────────────────────────────────────────────────────
    title: {
      eyebrow: "Saint Seiya",
      game:    "THE CROSSING",
      tagline: "one constellation. one god. one goal.",
      start:   "Begin",
      rules: [
        { icon: "⚔", text: "In each house, your team faces the guardian. The chance to pass depends on the knights' stats, affinities, and the chosen god." },
        { icon: "💀", text: "If a house is not cleared, a knight falls. The run ends when all knights are defeated." },
        { icon: "✨", text: "Certain teams trigger lore easter eggs. Find the right combinations for bonuses — even reviving fallen knights." },
        { icon: "🏆", text: "Your final score depends on houses cleared, survivors, and special events discovered. Beat your record." },
      ],
    },

    // ── LocationSelect ────────────────────────────────────────────────────
    location: {
      eyebrow:    "THE CROSSING",
      title:      "Battlefield",
      sub:        "Choose where your saga begins",
      comingSoon: "COMING SOON",
      startBtn:   "Begin Journey →",
      back:       "← Back",
      units:      { 12: "houses", 7: "battles" },
      locs: {
        sanctuary: {
          name:        "Athena's Sanctuary",
          subtitle:    "The 12 Zodiac Houses",
          description: "Cross the 12 houses of the Sanctuary, facing the Gold Saints who guard the path to Athena.",
        },
        asgard: {
          name:        "Kingdom of Asgard",
          subtitle:    "The 7 God Warriors",
          description: "Face the powerful God Warriors of Odin in the frozen lands of Asgard. A journey for the bravest.",
        },
        poseidon: {
          name:        "Poseidon's Empire",
          subtitle:    "The 7 Marine Generals",
          description: "Dive into the ocean depths and face Poseidon's Marine Generals in the underwater ruins.",
        },
      },
    },

    // ── GodSelect ─────────────────────────────────────────────────────────
    god: {
      eyebrow: "Saint Seiya — The Crossing",
      title:   "Choose Your Blessing",
      sub:     "Each god changes the rules of the crossing. Choose wisely.",
      hint:    "Select\na god",
      confirm: "Confirm →",
      back:    "← Back",
      gods: {
        atena: {
          name:  "Athena's Staff",
          short: "Athena",
          desc:  "The guardian goddess. Balanced mode — ideal for learning the game.",
          pros:  ["Balanced knight pool.", "All lore easter eggs are active."],
          cons:  ["No disadvantages — this is the default mode."],
        },
        hades: {
          name:  "Blade of Hades",
          short: "Hades",
          desc:  "God of the dead. Guardians are more aggressive, but death is not final.",
          pros:  ["35% chance to revive a fallen knight after each battle."],
          cons:  ["Base pass chance reduced by 10% in all houses."],
        },
        poseidon: {
          name:  "Poseidon's Trident",
          short: "Poseidon",
          desc:  "God of the seas. Marine Generals in the pool, but water houses are deadly.",
          pros:  ["Pool prioritizes Marine Generals.", "+15% in Aquarius and Pisces with an aquatic team."],
          cons:  ["Aquarius and Pisces have -20% without aquatic knights."],
        },
        marte: {
          name:  "Wrath of Mars",
          short: "Mars",
          desc:  "The war god of Omega. Chaos and raw power — the new generation dominates.",
          pros:  ["Pool restricted to Omega knights.", "Omega cosmos increased by 20%."],
          cons:  ["Classic and Lost Canvas knights lose 15% cosmos."],
        },
        apolo: {
          name:  "Apollo's Warmth",
          short: "Apollo",
          desc:  "The sun god. Gold Saints, normally out of reach, appear in the draft.",
          pros:  ["Gold Saints appear in the draft pool.", "Gold rank cosmos increased by 15%."],
          cons:  ["Slight advantage — the real challenge lies in the final houses."],
        },
        chronos: {
          name:  "Spirit of Chronos",
          short: "Chronos",
          desc:  "God of time. Knights' cosmos decays with each house passed.",
          pros:  ["Knights' starting cosmos is unchanged."],
          cons:  ["Each knight loses 10 cosmos per house passed (temporal decay)."],
        },
        artemis: {
          name:  "Artemis's Wave",
          short: "Artemis",
          desc:  "Goddess of the moon. Only female knights may compose this team.",
          pros:  ["Female knights gain 30% more cosmos.", "Pool restricted to female knights."],
          cons:  ["Team is exclusively female — limited pool."],
        },
        odin: {
          name:  "Odin's Spear",
          short: "Odin",
          desc:  "The Nordic god of Asgard. Warriors of the North join the crossing.",
          pros:  ["Pool prioritizes Asgard Warriors (+20% cosmos).", "+20% bonus in the first seven houses."],
          cons:  ["Little advantage in the final houses."],
        },
        renegado: {
          name:  "No Deity",
          short: "No Deity",
          desc:  "No god, no loyalty. Renegades carve their own path.",
          pros:  ["Black knights: +25% cosmos.", "+5% global — unpredictable.", "Pool favors renegades."],
          cons:  ["Divine knights: -8% to -20% cosmos."],
        },
      },
    },

    // ── KnightSelect — size screen ────────────────────────────────────────
    size: {
      eyebrow: "Saint Seiya — The Crossing",
      title:   "Build Your Team",
      sub:     "How many knights will join the crossing?",
      unit:    "knights",
      desc: {
        3: "Agile. Each knight is worth their weight in gold — losing one is critical.",
        4: "Balanced. There is room for error, but it comes at a price.",
        5: "Powerful. More breathing room for the hardest houses of the Sanctuary.",
      },
    },

    // ── KnightSelect — draft ──────────────────────────────────────────────
    draft: {
      title:      "Build Your Team",
      pickLabel:  (n, total) => {
        const sfx = ["st","nd","rd"][n-1] || "th";
        return `${n}${sfx} pick of ${total}`;
      },
      boardEmpty: "Choose your warriors",
      boardSlot:  (n) => {
        const sfx = ["st","nd","rd"][n-1] || "th";
        return `${n}${sfx} pick`;
      },
      boardFull:  "Constellation formed",
      boardCount: (n, total) => `${n} / ${total} chosen`,
      confirmMsg: "Constellation formed. The crossing can begin.",
      confirmBtn: "Begin Crossing",
      poolLabel:  "Choose 1 knight",
    },

    // ── Run ───────────────────────────────────────────────────────────────
    run: {
      houseCounter:  (n, total) => `House ${n} / ${total}`,
      aliveCounter:  (n) => `Alive: ${n}`,
      fallenCounter: (n) => `Fallen: ${n}`,
      topbarSep:     "|",
      sections: {
        blessing:      "Blessing",
        constellation: "Constellation",
        team:          "Team",
        menu:          "← Menu",
      },
      battle: {
        faceBtn:    (name) => `Face ${name}`,
        passed:     "✓ Passage secured!",
        failed:     "✗ Barrier not broken!",
        knightFell: (name) => `💀 ${name} fell in this battle.`,
        revived:    "✨ A fallen knight was revived!",
        rollInfo:   (chance, roll) => `${chance}% · roll ${roll}`,
        nextHouse:  "Next house →",
        seeResult:  "See final result",
        allFallen:  "All knights have fallen.",
        retry:      "↺ Fight again",
      },
      calc: {
        header:         "Battle calculation",
        vs:             (tc, gname, gc) => `team · cosmos ${tc}  vs  ${gname} · cosmos ${gc}`,
        teamCosmos:     "Team cosmos",
        guardianCosmos: "Guardian cosmos",
        base:           "House base",
        teamBonus:      "Team cosmos",
        affinity:       "Affinity",
        godBonus:       "God bonus",
        finalLine:      "Final chance",
        passed:         "passed",
        failed:         "failed",
      },
    },

    // ── Result ────────────────────────────────────────────────────────────
    result: {
      title:   "End of the Crossing",
      blessing: "Blessing:",
      constellation: {
        title:      "Your Constellation",
        alive:      "alive",
        fallen:     "fallen",
        fallenList: "Fallen Knights",
      },
      map: {
        passed:     "passed",
        failed:     "failed",
        special:    "special event",
        notReached: "not reached",
      },
      score: {
        title:       "Final Score",
        houses:      "Houses cleared",
        survivors:   "Survivors",
        special:     "Special events",
        arrow:       "→",
        pts:         "pts",
      },
      history: {
        egg:    "✦ special",
      },
      buttons: {
        retry:   "Try Again",
        restart: "New Crossing",
      },
      messages: {
        perfect:     "Perfect Crossing. Athena smiles.",
        great:       "Crossing complete. Few fell along the way.",
        good:        "Crossing complete — at the cost of many battles.",
        complete:    "They made it to the end, but the price was steep.",
        almostThere: "So close. The gods acknowledge your strength.",
        epic:        "Past the halfway mark — an epic battle.",
        halfway:     "Halfway there. The saga continues.",
        brave:       "A short journey, but a brave one.",
        brutal:      "The guardians were merciless. Try again.",
      },
    },

    // ── battleDescriptions ────────────────────────────────────────────────
    battles: {
      easyWin: [
        "The team's Cosmo overflowed through the walls of the house. The guardian retreated without a chance to react.",
        "The battle was decided before the first blow was struck. The knights' Cosmo was incomparable.",
        "The guardian looked up and felt the weight of that Cosmo. There was nothing to be done.",
        "A burst of golden energy swept through the house. The path was clear.",
        "The guardian tried to resist — in vain. The knights passed with unsettling ease.",
        "Not even the proudest guardian could deny that Cosmo. Passage was granted.",
        "The armor gleamed. The guardian yielded. The crossing continued.",
      ],
      fairWin: [
        "Heavy blows were exchanged. In the end, the knights rose — and the guardian did not.",
        "The battle lasted long enough to leave marks. But passage was earned.",
        "The guardian was strong. The knights were more determined.",
        "The Cosmo of both sides warmed the stones of the house. In the end, one side burned brighter.",
        "Every blow was answered. Every answer was overcome. The door opened.",
        "It wasn't without effort — but it never would be. The guardian was overcome.",
        "The knights felt the weight of that confrontation. And pressed forward anyway.",
        "The armor groaned. The Cosmo wavered. Then it exploded — taking the guardian with it.",
        "A roar echoed through the house. When the dust settled, only the knights remained standing.",
      ],
      narrowWin: [
        "They were at the limit. A knight dropped to one knee — then stood back up. The house was cleared.",
        "The guardian almost won. Almost. One last surge of Cosmo stopped the inevitable.",
        "Defeat was on their lips — and swallowed back down with every last ounce of strength.",
        "None of them would come out unscathed. But they would come out. That was enough.",
        "The guardian smiled before the final blow. They shouldn't have hesitated.",
        "Three times it seemed like everything would end there. Three times the Cosmo answered the despair.",
        "The battle was ugly, hard, and uncertain. The knights won anyway.",
        "Strength was no longer enough. It was will that opened that door.",
      ],
      honorableLoss: [
        "Fate was cruel to the strong. The guardian won by a margin history will not record.",
        "The knights fought with everything. Everything simply wasn't enough this time.",
        "No one could have done more. And yet the door remained closed.",
        "The Cosmo burned to the end. But the end came too soon.",
        "The battle was honorable. So was the defeat. The guardian bowed before ending it.",
        "There was a moment when victory seemed certain. That moment passed.",
        "The guardian raised their arm at the end — not in triumph, but in respect.",
      ],
      heavyLoss: [
        "The guardian barely moved. The house defended itself.",
        "There was no bridge between their power and the guardian's.",
        "The knights' Cosmo barely warmed the air. The guardian looked on with contempt.",
        "The gap was too wide. Sometimes the abyss is real.",
        "The guardian didn't bother using their ultimate technique. They didn't need to.",
        "The armor wasn't enough. The Cosmo wasn't enough. Nothing was.",
        "Every blow was absorbed like wind. The guardian's response left no doubt.",
        "There was courage there. Courage without power is just a fine story to tell afterward.",
      ],
    },
  },
};
