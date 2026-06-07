// locations.js
// ═══════════════════════════════════════════════════════════════════════════
// Fonte única de configuração das localizações de batalha.
//
// Para ADICIONAR um local → adicione uma entrada em LOCATIONS.
// Para ATIVAR um local   → mude available: true e implemente housesFile + mapPositions.
// ═══════════════════════════════════════════════════════════════════════════

export const LOCATIONS = [

  // ── Santuário de Atena ────────────────────────────────────────────────────
  {
    id:          "sanctuary",
    name:        "Santuário de Atena",
    subtitle:    "As 12 Casas do Zodíaco",
    description: "Atravesse as 12 casas do Santuário, enfrentando os Cavaleiros de Ouro que guardam o caminho até Atena.",
    houseCount:  12,
    available:   true,
    color:       "#5a9de0",
    accentColor: "#c8a800",
    symbol:      "♈♉♊♋♌♍♎♏♐♑♒♓",
    // housesFile e mapPositions já estão em houses.json e Run.jsx
  },

  // ── Reino de Asgard ───────────────────────────────────────────────────────
  {
    id:          "asgard",
    name:        "Reino de Asgard",
    subtitle:    "Os 7 Guerreiros de Odin",
    description: "Enfrente os poderosos Guerreiros de Odin nas terras geladas de Asgard. Uma jornada para os mais corajosos.",
    houseCount:  7,
    available:   false,
    color:       "#78c4d8",
    accentColor: "#b0e0f0",
    symbol:      "ᚠᚢᚦᚨᚱᚲᚷ",
  },

  // ── Império de Poseidon ───────────────────────────────────────────────────
  {
    id:          "poseidon",
    name:        "Império de Poseidon",
    subtitle:    "Os 7 Generais Marinhos",
    description: "Mergulhe nas profundezas do oceano e enfrente os Generais Marinhos de Poseidon nas ruínas subaquáticas.",
    houseCount:  7,
    available:   false,
    color:       "#1abc9c",
    accentColor: "#00e5b0",
    symbol:      "∿∿∿∿∿∿∿",
  },

];

// Helper: busca um local pelo ID (fallback para sanctuary)
export function getLocation(id) {
  return LOCATIONS.find(l => l.id === id) ?? LOCATIONS[0];
}
