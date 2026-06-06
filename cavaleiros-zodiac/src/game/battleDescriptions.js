// battleDescriptions.js
// Pools de descrições narrativas para as batalhas em cada casa.
// A descrição é escolhida aleatoriamente com base no resultado e na margem.

// ─── VITÓRIA FÁCIL (chance > 75%) ────────────────────────────────────────────
const EASY_WIN = [
    "O Cosmo do time transbordou pelas paredes da casa. O cavaleiro de Ouro recuou sem chance de reação.",
    "A batalha foi decidida antes mesmo do primeiro golpe. O Cosmo dos cavaleiros era incomparável.",
    "O O cavaleiro de Ouro ergueu os olhos e sentiu o peso daquele Cosmo. Não havia o que fazer.",
    "Uma rajada de energia dourada atravessou a casa. O caminho estava livre.",
    "O O cavaleiro de Ouro tentou resistir — foi em vão. Os cavaleiros passaram com facilidade desconcertante.",
    "Nem o mais orgulhoso dos cavaleiros de Ouro poderia negar aquele Cosmo. A passagem foi concedida.",
    "A armadura brilhou. O cavaleiro de Ouro cedeu. A travessia continuou.",
];

// ─── VITÓRIA JUSTA (chance entre 50% e 75%) ───────────────────────────────────
const FAIR_WIN = [
    "Golpes pesados foram trocados. No fim, os cavaleiros se ergueram e o cavaleiro de Ouro não.",
    "A batalha durou o suficiente para deixar marcas. Mas a passagem foi conquistada.",
    "O O cavaleiro de Ouro era forte. Os cavaleiros eram mais determinados.",
    "O Cosmo dos dois lados aqueceu as pedras da casa. No fim, um lado brihou mais forte.",
    "Cada golpe foi respondido. Cada resposta foi superada. A porta se abriu.",
    "Não foi sem esforço — mas jamais seria.  cavaleiro de Ouro foi superado.",
    "Os cavaleiros sentiram o peso daquele confronto. E seguiram em frente mesmo assim.",
    "A armadura resistiu. O Cosmo vacilou. E então explodiu — levando o cavaleiro de Ouro com ele.",
    "Um rugido ecoou pela casa. Quando a poeira baixou, apenas os cavaleiros estavam de pé.",
];

// ─── VITÓRIA POR UM FIO (chance entre 30% e 50%) ─────────────────────────────
const NARROW_WIN = [
    "Estavam no limite. Um cavaleiro caiu de joelhos — mas se levantou. A casa foi superada.",
    "O cavaleiro de Ouro quase venceu. Quase. Um último Cosmo impediu o inevitável.",
    "A derrota estava na boca — e foi engolida de volta com tudo o que sobrou de força.",
    "Nenhum deles sairia ileso. Mas sairiam. E isso era o suficiente.",
    "O cavaleiro de Ouro sorriu antes do golpe final. Não deveria ter hesitado.",
    "Três vezes pareceu que tudo acabaria ali. Três vezes o Cosmo respondeu ao desespero.",
    "A batalha foi feia, dura e incerta. E os cavaleiros venceram do mesmo jeito.",
    "Força já não bastava. Foi a vontade que abriu aquela porta.",
];

// ─── DERROTA DIGNA (chance > 50%, mas falhou) ────────────────────────────────
const HONORABLE_LOSS = [
    "O destino foi cruel com os fortes. O cavaleiro de Ouro venceu por uma margem que a história não vai registrar.",
    "Os cavaleiros lutaram com tudo. O tudo simplesmente não foi suficiente desta vez.",
    "Ninguém poderia ter feito mais. E ainda assim a porta permaneceu fechada.",
    "O Cosmo ardeu até o fim. Mas o fim chegou cedo demais.",
    "A batalha foi digna. A derrota também. O cavaleiro de Ouro curvou a cabeça antes de encerrar.",
    "Houve um momento em que a vitória parecia certa. Esse momento passou.",
    "O guardião ergueu o braço ao fim, não em triunfo — em respeito.",
];

// ─── DERROTA PESADA (chance < 50%) ───────────────────────────────────────────
const HEAVY_LOSS = [
    "O cavaleiro de Ouro mal se moveu. A casa defendeu a si mesma.",
    "Não havia distância suficiente entre o poder deles e o poder do cavaleiro de Ouro.",
    "O Cosmo dos cavaleiros mal aqueceu o ar. O cavaleiro de Ouro olhou com desdém.",
    "A diferença era grande demais. Às vezes o abismo é real.",
    "O cavaleiro de Ouro não se dignificou a usar sua técnica final. Não precisou.",
    "A armadura não foi suficiente. O Cosmo não foi suficiente. Nada foi.",
    "Cada golpe foi absorvido como vento. A resposta do cavaleiro de Ouro não deixou dúvidas.",
    "Havia coragem ali. Coragem sem poder é só uma bela história para contar depois.",
];

// ─── FUNÇÃO PRINCIPAL ─────────────────────────────────────────────────────────
// Recebe o resultado da batalha e retorna uma descrição aleatória adequada.

export function getBattleDescription(passed, passChance) {
    let pool;

    if (passed) {
        if (passChance >= 75) pool = EASY_WIN;
        else if (passChance >= 50) pool = FAIR_WIN;
        else pool = NARROW_WIN;
    } else {
        if (passChance >= 50) pool = HONORABLE_LOSS;
        else pool = HEAVY_LOSS;
    }

    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}
