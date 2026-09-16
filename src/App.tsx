import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleDot,
  Clock3,
  Eye,
  FileText,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Menu,
  ScanLine,
  ShieldAlert,
  TimerReset,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

type Feedback = { kind: 'success' | 'error' | ''; message: string };

type Mystery = {
  id: number;
  code: string;
  category: string;
  title: string;
  place: string;
  date: string;
  report: string;
  clue: string;
  artifact: string;
  evidenceLabel: string;
  answer: string;
  unlock: string;
};

type ConfidentialMystery = {
  id: number;
  code: string;
  title: string;
  clue: string;
  answer: string;
};

const mysteries: Mystery[] = [
  { id: 1, code: 'M-01', category: 'A1Z26 / AUSÊNCIA', title: 'O retrato que perdeu o centro', place: 'casa da pedreira', date: '11.04.2014', report: 'Cinco números foram encontrados no verso. A moldura conserva um calor que não pertence a nenhum corpo.', clue: '1-21-19-5-14-3-9-1', artifact: 'negativo sem rosto / margem amarela', evidenceLabel: 'primeira camada · sequência', answer: 'AUSENCIA', unlock: 'A palavra não descreve o retrato. Ela descreve o espaço que ficou entre duas pessoas.' },
  { id: 2, code: 'M-02', category: 'MORSE / SINAL', title: 'A estação que continua chamando', place: 'estação elevatória norte', date: '19.04.2014', report: 'O tanque foi esvaziado sem abrir a válvula. Mesmo assim, o rádio ainda transmite uma pulsação.', clue: '..-. .-. . --.- ..- . -. -.-. .. .-', artifact: 'fita de manutenção / canal 02', evidenceLabel: 'segunda camada · transmissão', answer: 'FREQUENCIA', unlock: 'A pulsação muda quando alguém pronuncia a resposta perto do tanque.' },
  { id: 3, code: 'M-03', category: 'IDIOMAS / CHARADA', title: 'Três bocas na mesma parede', place: 'prédio São Jerônimo', date: '27.04.2014', report: 'Um depoimento chegou de uma forma que ninguém entendeu. Um investigador desistiu e saiu da sala.', clue: 'Três línguas se misturaram no mesmo parágrafo.\nUma fala de sangue.\nOutra fala de medo.\nA terceira fala de morte.\nQuando as três se encontram no final da leitura, o que sobra no silêncio que o tradutor não quis escrever?', artifact: 'depoimento trilíngue / carbono úmido', evidenceLabel: 'terceira camada · reação', answer: 'MEDO', unlock: 'A parede só responde quando a investigadora admite que também sentiu isso.' },
  { id: 4, code: 'M-04', category: 'TABELA / MORSE / RITUAL', title: 'O pedido sob a palavra', place: 'capela sem altar', date: '03.05.2014', report: 'A folha traz uma sequência numérica e um sinal que ninguém quis repetir em voz alta.', clue: 'A=1  C=3  L=12  S=19\nAbaixo dela, o mesmo sinal que o rádio nunca parou de emitir:\n••• ━━━ •••', artifact: 'folha de rito / lacre quebrado', evidenceLabel: 'quarta camada · confirmação sonora', answer: 'SOS', unlock: 'O pedido não foi enviado para fora. Algo respondeu de dentro.' },
  { id: 5, code: 'M-05', category: 'CIFRA / REPETIÇÃO', title: 'A anotação que volta diferente', place: 'arquivo municipal', date: '18.05.2014', report: 'Um feriado que normalmente seria santo, mas como nada aqui segue o padrão, isso também não foi diferente. Ainda não conseguimos decifrar o final. Deixamos a pasta na quarta gaveta de César.', clue: 'Rexep qegefvs', artifact: 'diário sem assinatura / quarta gaveta', evidenceLabel: 'quinta camada · cifra quebrada', answer: 'NATAL MACABRO', unlock: 'A gaveta quatro está vazia, mas devolve a última palavra escrita nela.' },
  { id: 6, code: 'M-06', category: 'CHARADA / ELEMENTO', title: 'O selo sem nome', place: 'arquivo de ritos', date: '02.06.2014', report: 'A parede da capela estava coberta de símbolos que sumiam quando se olhava de frente. Só de lado eles voltavam.', clue: 'Tire o nome do que alimenta, o nome do que consome e o nome do que transforma.\nO que ainda resta no centro do círculo?', artifact: 'selo de cera / inscrição', evidenceLabel: 'sexta camada · identidade', answer: 'VAZIO', unlock: 'O selo não pede força. Pede que alguém seja chamado corretamente.' },
  { id: 7, code: 'M-07', category: 'CHARADA / SILÊNCIO', title: 'O peso que envelhece', place: 'estação antiga', date: '15.06.2014', report: 'O gravador foi encontrado ligado. Ninguém havia apertado o botão. A fita continha apenas um único suspiro repetido 47 vezes.', clue: 'Ele cresce quando ninguém fala.\nEle some quando todos gritam.\nQual é a única coisa que se alimenta do silêncio absoluto?', artifact: 'placa de ferro / cálculo no verso', evidenceLabel: 'sétima camada · resto', answer: 'SILENCIO', unlock: 'A balança marca zero quando o objeto é chamado pelo que ele carrega.' },
  { id: 8, code: 'M-08', category: 'ELEMENTOS / EXPOSIÇÃO', title: 'A palavra que não encara o dia', place: 'corredor do espelho', date: '29.06.2014', report: 'No porão da granja havia uma mesa com cinco copos. Quatro estavam cheios de algo que não era líquido. O quinto estava vazio e ainda assim pesava.', clue: 'Sangue. Morte. Energia. Conhecimento.\nQual é o quinto que não pode ser nomeado sem pagar o preço?', artifact: 'fragmento de espelho / vapor seco', evidenceLabel: 'oitava camada · orientação', answer: 'EXPOSICAO', unlock: 'A palavra invertida não é uma tradução. É a prova de que o espelho está olhando de volta.' },
  { id: 9, code: 'M-09', category: 'MEMBRANA / CHARADA', title: 'A porta que exige negação', place: 'avenida do moinho', date: '07.07.2014', report: 'O relatório de campo dizia apenas: “A marca não estava no corpo. O corpo estava na marca.”', clue: 'Quando a Membrana afina, o que passa primeiro?\nNão é o monstro. Não é o ritual.\nÉ o que torna tudo possível.', artifact: 'marco de porta / unha sob a tinta', evidenceLabel: 'nona camada · intenção', answer: 'MEMBRANA', unlock: 'A porta abriu para a frase que ninguém teve coragem de dizer em voz alta.' },
  { id: 10, code: 'M-10', category: 'FRASE / ORDEM', title: 'O documento que sussurra', place: 'escola desativada', date: '21.07.2014', report: 'Na mesa do agente havia um papel dobrado sete vezes. Dentro dele só havia uma frase incompleta.', clue: '“O paranormal não vem para a nossa realidade de maneira...”', artifact: 'caderno de chamada / folha 10', evidenceLabel: 'décima camada · intervalo', answer: 'FACIL', unlock: 'O silêncio não é ausência de registro. É o registro que foi deixado de fora.' },
  { id: 11, code: 'M-11', category: 'FRASE / GUERREIRO', title: 'A testemunha sem corpo', place: 'casa 44, rua baixa', date: '05.08.2014', report: 'O diário de bordo da equipe terminava no meio de uma frase.', clue: '“Vocês acham que eu sou um herói?! Eu sou um...”', artifact: 'planta incompleta / quarto sem medida', evidenceLabel: 'décima primeira camada · contradição', answer: 'GUERREIRO', unlock: 'A planta ganhou um cômodo quando a certeza foi retirada.' },
  { id: 12, code: 'M-12', category: 'LEMA / CONHECIMENTO', title: 'Cinco entraram', place: 'observatório desativado', date: '17.08.2014', report: 'No caderno de um ocultista havia a anotação mais conhecida do Outro Lado.', clue: '“Saber tudo é perder tudo.”\nQuem usa esse lema?', artifact: 'calendários sobrepostos / gravação solar', evidenceLabel: 'décima segunda camada · resto humano', answer: 'CONHECIMENTO', unlock: 'A saída não devolve a pessoa. Devolve a versão que ficou para trás.' },
  { id: 13, code: 'M-13', category: 'FRASE / ENERGIA', title: 'A coisa que cresce calada', place: 'torre de transmissão', date: '26.08.2014', report: 'O rádio da torre só captava uma frequência em loop.', clue: '“O Caos é inevitável, e tudo deve ser o...”', artifact: 'transcrição de rádio / canal morto', evidenceLabel: 'décima terceira camada · crescimento', answer: 'CAOS', unlock: 'A gravação não contém uma voz. Contém o espaço exato onde ela deveria estar.' },
  { id: 14, code: 'M-14', category: 'FRASE / MORTE', title: 'A mentira que fecha o círculo', place: 'viaduto leste', date: '09.09.2014', report: 'A última página do relatório estava manchada. No centro, uma frase riscada e reescrita.', clue: '“Tudo tem um começo e um fim, e o Tempo leva todas as coisas.”\nQual elemento carrega essa frase?', artifact: 'croqui infantil / giz mineral', evidenceLabel: 'décima quarta camada · círculo', answer: 'MORTE', unlock: 'O ritual aceitou a contradição como uma assinatura.' },
  { id: 15, code: 'M-15', category: 'NARRATIVA / EXTRAÇÃO', title: 'O que acorda do outro lado', place: 'pensão das acácias', date: '23.09.2014', report: 'A folha final foi escrita por alguém que voltou diferente. A ameaça não fala do que existe no Outro Lado.', clue: '“O maior perigo não é o que vem do Outro Lado.\nÉ o que o Outro Lado desperta em você.”\n\nO que exatamente é despertado?', artifact: 'registro de umidade / amostra sem origem', evidenceLabel: 'décima quinta camada · verbo', answer: 'CURIOSIDADE', unlock: 'A curiosidade foi a única testemunha que atravessou sem ser convidada.' },
  { id: 16, code: 'M-16', category: 'SUBTRAÇÃO / CONCLUSÃO', title: 'Depois que tudo é retirado', place: 'arquivo de origem', date: '01.10.2014', report: 'A pasta foi encontrada aberta. Todas as fichas tinham sido riscadas, menos uma. Nela estava escrito apenas: “o que ainda resta”.', clue: 'Tire Medo. Tire Morte. Tire Sangue. Tire Energia. Tire Conhecimento.\nO que sobra quando tudo é removido?', artifact: 'folha de encerramento / verso lacrado', evidenceLabel: 'décima sexta camada · remoção', answer: 'NADA', unlock: 'O arquivo não está encerrado. Ele está esperando alguém decidir se deve continuar.' },
];

const confidentialMysteries: ConfidentialMystery[] = [
  {
    id: 1,
    code: 'C-01',
    title: 'A margem que sangra em código',
    clue: '... --- -- -... .-. .-\n\na investigação foi pausada por ninguém conseguir decifrar esse código',
    answer: 'SOMBRA',
  },
  {
    id: 2,
    code: 'C-02',
    title: 'A sala que engole letras',
    clue: 'A sala tem quatro paredes e cinco cantos.\nCada canto repete uma letra do seu nome e apaga uma do nome da entidade.\nQuando nenhuma letra sobra de nenhum dos dois, o que foi levado junto com a voz?',
    answer: 'IDENTIDADE',
  },
  {
    id: 3,
    code: 'C-03',
    title: 'O intervalo que aponta para trás',
    clue: '3 · 1 · 12 · 1 · 13 · 9 · 4 · 1 · 4 · 5\nO que a sequência esconde quando convertida?',
    answer: 'CALAMIDADE',
  },
  {
    id: 4,
    code: 'C-04',
    title: 'O nome no verso',
    clue: 'Ela apareceu em um especial de Natal.\nCaminhou entre assassinos e sobreviventes.\nAlguns dizem que seu segundo nome é Trovi.\nQual nome estava escondido no verso da fotografia?',
    answer: 'MELISSA',
  },
  {
    id: 5,
    code: 'C-05',
    title: 'A pergunta escrita depois da resposta',
    clue: 'A pergunta foi escrita depois da resposta.\nA resposta foi escrita antes da testemunha.\nSe o começo só aparece no fim e o fim já existia no começo, qual é o movimento que a pasta descreve?',
    answer: 'CICLO',
  },
  {
    id: 6,
    code: 'C-06',
    title: 'O elemento que cobra o preço',
    clue: 'Medo, Morte, Sangue, Energia e Conhecimento.\nQual desses elementos é o único que não pode ser ritualizado sem que o agente perca parte de si mesmo?',
    answer: 'MEDO',
  },
  {
    id: 7,
    code: 'C-07',
    title: 'O agente das tatuagens',
    clue: 'Antes de ser agente, ele espalhava histórias de monstros pela internet. Depois virou um dos mais sérios da Ordem.\nQual agente carrega tatuagens de Morte e o mesmo nome do criador do universo?',
    answer: 'CELLBIT',
  },
  {
    id: 8,
    code: 'C-08',
    title: 'Do outro lado da mesa',
    clue: 'Alguém do outro lado da mesa sempre soube mais do que deveria.\nQuem cria as regras e ainda assim se surpreende com os jogadores?',
    answer: 'MESTRE',
  },
  {
    id: 9,
    code: 'C-09',
    title: 'O agente que voltou',
    clue: 'Na pasta secreta havia uma anotação solta sobre um agente que sumiu depois de uma missão em Bariguara.\nQual agente voltou da aposentadoria apenas porque o Senhor Veríssimo pediu?',
    answer: 'BALU',
  },
  {
    id: 10,
    code: 'C-10',
    title: 'A versão incompleta de streets',
    clue: 'Like you, like you\nLike you, ooh-oh\nI found it hard to find someone like you\nLike you, like you\nSend your location\nQual frase falta para completar o trecho?',
    answer: 'COME THROUGH',
  },
  {
    id: 11,
    code: 'C-11',
    title: 'A faixa cortada de manchild',
    clue: 'Stupid\nOr is it slow?\nMaybe it\'s\nBut there\'s a cuter word for it, I know\nQual palavra completa a frase?',
    answer: 'USELESS',
  },
  {
    id: 12,
    code: 'C-12',
    title: 'A prova que não faz sentido',
    clue: 'Isso não faz sentido, mas estava junto das provas. De toda forma estamos investigando.\nQual seu sabor de sorvete favorito?',
    answer: 'MORANGO',
  },
  {
    id: 13,
    code: 'C-13',
    title: 'A frase da ação',
    clue: 'Durante uma ação alguém gritou algo que ninguém esperava.\n“Aqui o seu ______”\nComplete a frase que Beamon falou.',
    answer: 'JUNTO',
  },
  {
    id: 14,
    code: 'C-14',
    title: 'A primeira lição',
    clue: '“O paranormal não vem para a nossa realidade de maneira...”',
    answer: 'FACIL',
  },
  {
    id: 15,
    code: 'C-15',
    title: 'O sobrevivente',
    clue: 'Um sobrevivente olhou para o que restou da equipe e falou baixo, quase para si mesmo.\n“Vocês acham que eu sou um herói?! Eu sou um...”',
    answer: 'GUERREIRO',
  },
  {
    id: 16,
    code: 'C-16',
    title: 'A equipe no caos',
    clue: 'No meio do caos alguém ainda gritava o nome da equipe.\nQual era o nome da equipe que Joui defendia?',
    answer: 'EQUIPE E',
  },
  {
    id: 17,
    code: 'C-17',
    title: 'A frequência do caos',
    clue: 'O rádio só repetia a mesma coisa em loop.\n“O Caos é inevitável...”\nComplete a frase-guia do elemento.',
    answer: 'E TUDO DEVE SER O CAOS',
  },
  {
    id: 18,
    code: 'C-18',
    title: 'A anotação final',
    clue: 'A última anotação de um ocultista antes de desaparecer.\n“Saber tudo é ______ tudo.”',
    answer: 'PERDER',
  },
];

const incidentCards = [
  { code: 'INC / 01', tag: 'DESAPARECIMENTO', title: 'O último sorriso', copy: 'O negativo mostra alguém que a família jura nunca ter conhecido. O olhar ainda está no papel.', tone: 'paper', paperValue: '16', paperTone: 'yellow' },
  { code: 'INC / 02', tag: 'PARADA NOTURNA', title: 'Posto fantasma', copy: 'As bombas ainda marcam litros. Ninguém abriu o caixa. O farol continua aceso na pista vazia.', tone: 'dark', paperValue: '09', paperTone: 'yellow', paperBlur: true },
  { code: 'INC / 03', tag: 'TESTEMUNHA', title: 'Princesa Carpenter', copy: 'Ela olha para mulheres como se olhasse para uma presa.', tone: 'paper', paperValue: '20', paperTone: 'yellow' },
  { code: 'INC / 04', tag: 'RITUAL / LOCAL', title: 'A garagem marcada', copy: 'O círculo no concreto não estava no laudo. Os veículos formam um perímetro que ninguém pediu — e ninguém ousou atravessar.', tone: 'dark', paperValue: '08', paperTone: 'yellow', paperBlur: true },
  { code: 'INC / 05', tag: 'CAMPO', title: 'Granja suspeita', copy: 'A estrada termina antes da porteira. Do lado de dentro, algo espera. O mapa preferiu ficar em branco.', tone: 'paper', paperValue: '31', paperTone: 'ink', paperBlur: true },
];

const loosePapers = [
  { id: 'paper-01', text: '1·6', note: 'margem / 01', tone: 'correct', position: 'loose-paper-a', rotate: '-7deg', zone: 'occurrences', correct: true },
  { id: 'paper-02', text: 'sem rosto', note: 'rasura / 04', tone: 'faded', position: 'loose-paper-b', rotate: '5deg', zone: 'occurrences', correct: false },
  { id: 'paper-03', text: '0·9', note: 'verso / 02', tone: 'correct', position: 'loose-paper-c', rotate: '8deg', zone: 'occurrences', correct: true },
  { id: 'paper-04', text: '02:17', note: 'hora não confirmada', tone: 'faded', position: 'loose-paper-d', rotate: '-4deg', zone: 'occurrences', correct: false },
  { id: 'paper-05', text: '2·0', note: 'margem / 03', tone: 'correct', position: 'loose-paper-e', rotate: '-3deg', zone: 'occurrences', correct: true },
  { id: 'paper-06', text: 'não abrir', note: 'anotação de campo', tone: 'faded', position: 'loose-paper-f', rotate: '6deg', zone: 'occurrences', correct: false },
  { id: 'paper-07', text: '0·8', note: 'verso / 04', tone: 'correct', position: 'loose-paper-g', rotate: '-8deg', zone: 'occurrences', correct: true },
  { id: 'paper-08', text: 'a sala escuta', note: 'carvão apagado', tone: 'faded', position: 'loose-paper-h', rotate: '3deg', zone: 'occurrences', correct: false },
  { id: 'paper-09', text: '03·14', note: 'relógio / cópia', tone: 'faded', position: 'loose-paper-i', rotate: '-5deg', zone: 'evidence', correct: false },
  { id: 'paper-10', text: 'quarto 12', note: 'planta / erro', tone: 'faded', position: 'loose-paper-j', rotate: '6deg', zone: 'evidence', correct: false },
  { id: 'paper-11', text: '333', note: 'folha sem assinatura', tone: 'faded', position: 'loose-paper-k', rotate: '-2deg', zone: 'evidence', correct: false },
  { id: 'paper-12', text: '07', note: 'carimbo / margem', tone: 'faded', position: 'loose-paper-l', rotate: '4deg', zone: 'evidence', correct: false },
];

const timeline = [
  ['11.04.2014', 'A primeira fissura', 'Uma fotografia familiar perde um corpo. A sombra permanece no negativo.'],
  ['03.05.2014', 'O minuto que não fecha', 'A praça registra uma hora que nenhum relógio consegue confirmar.'],
  ['17.08.2014', 'A noite que se estende', 'O observatório abre as janelas para um horário que não existe no calendário.'],
  ['01.10.2014', 'O arquivo responde', 'Dezesseis ocorrências ocupam a mesma sala. Cada uma em uma camada diferente.'],
];

const FINAL_RIDDLE_ANSWER = 'ESPERA';
const FINAL_RIDDLE_TEXT = 'Quatro gavetas guardam a mesma ausência.\nNenhuma conhece o nome dela.\nUma colher apontou para o teto.\nO teto respondeu com sete passos.\nA janela fechou por dentro.\n\nO que ainda resta do lado de fora da pergunta\nquando tudo já foi contado e ninguém se move?';
const FINAL_ATTEMPT_LIMIT = 3;
const FINAL_SOLVE_WINDOW_MS = 60_000;
const FINAL_COOLDOWN_MS = 5 * 60_000;

const PHOTO_GALLERY = [
  { src: 'photos/char-01.jpg', label: 'registro · sujeito 01' },
  { src: 'photos/char-02.jpg', label: 'registro · sujeito 02' },
  { src: 'photos/char-03.jpg', label: 'registro · sujeito 03' },
  { src: 'photos/char-04.jpg', label: 'registro · sujeito 04' },
  { src: 'photos/char-05.jpg', label: 'registro · sujeito 05' },
  { src: 'photos/char-06.jpg', label: 'registro · sujeito 06' },
  { src: 'photos/char-07.jpg', label: 'registro · sujeito 07' },
  { src: 'photos/char-08.jpg', label: 'registro · sujeito 08' },
  { src: 'photos/char-09.jpg', label: 'registro · sujeito 09' },
  { src: 'photos/char-10.jpg', label: 'registro · sujeito 10' },
  { src: 'photos/char-11.jpg', label: 'registro · sujeito 11' },
  { src: 'photos/char-12.jpg', label: 'registro · sujeito 12' },
  { src: 'photos/place-cidade.jpg', label: 'local · cidade' },
  { src: 'photos/place-posto.jpg', label: 'local · posto' },
  { src: 'photos/place-garagem.jpg', label: 'local · garagem' },
  { src: 'photos/place-granja.jpg', label: 'local · granja' },
  { src: 'photos/place-floresta.jpg', label: 'local · floresta' },
  { src: 'photos/place-torre.jpg', label: 'local · torre' },
  { src: 'photos/place-circo.jpg', label: 'local · circo' },
  { src: 'photos/place-ordo.jpg', label: 'local · sala de ocultismo' },
  { src: 'photos/place-mato.jpg', label: 'local · mato' },
  { src: 'photos/place-pizzaria.jpg', label: 'local · pizzaria' },
  { src: 'photos/sticky-verso.jpg', label: 'verso · pasta lacrada' },
];

function galleryIndexFor(path: string) {
  const base = path.replace('-face', '');
  const i = PHOTO_GALLERY.findIndex((p) => p.src === base || p.src === path);
  return i >= 0 ? i : 0;
}


const INVESTIGATOR_ANSWER = 'olo2008';

const puzzleStorage = {
  solved: 'arquivo-paranormal-investigacao-2026-v2-solved',
  attempts: 'arquivo-paranormal-investigacao-2026-v2-attempts',
  locks: 'arquivo-paranormal-investigacao-2026-v2-locks',
  paperClicks: 'arquivo-paranormal-investigacao-2026-v2-paper-clicks',
  codeVerified: 'arquivo-paranormal-investigacao-2026-v2-code-verified',
  confidentialOpen: 'arquivo-paranormal-confidential-v2-open',
  confidentialSolved: 'arquivo-paranormal-confidential-v2-solved',
  finalGate: 'arquivo-paranormal-final-gate-v1',
  volume: 'arquivo-paranormal-volume-v1',
  investigator: 'arquivo-paranormal-investigator-v1',
  giftOpened: 'arquivo-paranormal-gift-opened-v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

type AmbientState = {
  audio: HTMLAudioElement;
  theme: 'archive' | 'confidential';
};

type FinalGateState = {
  attempts: number;
  lockUntil: number;
  windowUntil: number;
  solved: boolean;
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [investigatorUnlocked, setInvestigatorUnlocked] = useState(() =>
    readStorage<boolean>(puzzleStorage.investigator, false),
  );
  const [giftOpened, setGiftOpened] = useState(() =>
    readStorage<boolean>(puzzleStorage.giftOpened, false),
  );
  const [investigatorOpen, setInvestigatorOpen] = useState(false);
  const [investigatorInput, setInvestigatorInput] = useState('');
  const [investigatorFeedback, setInvestigatorFeedback] = useState('');
  const [activeIncident, setActiveIncident] = useState<string | null>(null);
  const [activeId, setActiveId] = useState(() => {
    const solved = readStorage<number[]>(puzzleStorage.solved, []);
    return Math.min(mysteries.findIndex((item) => !solved.includes(item.id)) + 1 || 1, mysteries.length);
  });
  const [solved, setSolved] = useState<number[]>(() => readStorage<number[]>(puzzleStorage.solved, []));
  const [attempts, setAttempts] = useState<Record<number, number>>(() => readStorage<Record<number, number>>(puzzleStorage.attempts, {}));
  const [locks, setLocks] = useState<Record<number, number>>(() => readStorage<Record<number, number>>(puzzleStorage.locks, {}));
  const [now, setNow] = useState(Date.now());
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>({ kind: '', message: '' });
  const [paperClicks, setPaperClicks] = useState<Record<string, number>>(() => readStorage<Record<string, number>>(puzzleStorage.paperClicks, {}));
  const [paperFeedback, setPaperFeedback] = useState('');
  const [codeVerified, setCodeVerified] = useState(() => readStorage<boolean>(puzzleStorage.codeVerified, false));
  const [confidentialOpen, setConfidentialOpen] = useState(() => readStorage<boolean>(puzzleStorage.confidentialOpen, false));
  const [confidentialActiveId, setConfidentialActiveId] = useState(() => {
    const solved = readStorage<number[]>(puzzleStorage.confidentialSolved, []);
    return Math.min(confidentialMysteries.findIndex((item) => !solved.includes(item.id)) + 1 || 1, confidentialMysteries.length);
  });
  const [confidentialSolved, setConfidentialSolved] = useState<number[]>(() => readStorage<number[]>(puzzleStorage.confidentialSolved, []));
  const [confidentialAnswer, setConfidentialAnswer] = useState('');
  const [confidentialFeedback, setConfidentialFeedback] = useState<Feedback>({ kind: '', message: '' });
  const [musicOn, setMusicOn] = useState(true);
  const [musicTheme, setMusicTheme] = useState<'archive' | 'confidential'>('archive');
  const [volume, setVolume] = useState(() => {
    const stored = readStorage<number>(puzzleStorage.volume, 0.55);
    return Math.min(1, Math.max(0, stored));
  });
  const [showVolume, setShowVolume] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [finalGate, setFinalGate] = useState<FinalGateState>(() =>
    readStorage<FinalGateState>(puzzleStorage.finalGate, {
      attempts: 0,
      lockUntil: 0,
      windowUntil: 0,
      solved: false,
    }),
  );
  const [finalAnswer, setFinalAnswer] = useState('');
  const [finalFeedback, setFinalFeedback] = useState<Feedback>({ kind: '', message: '' });
  const [showFinalRiddle, setShowFinalRiddle] = useState(false);
  const audioRef = useRef<AmbientState | null>(null);
  const audioStartedRef = useRef(false);
  const presentPlaylist = useRef<string[]>([
    'music/nosense.mp3',
    'music/femme-fatale.mp3',
    'music/streets.mp3',
  ]);
  const presentIndex = useRef(0);
  const presentAudioRef = useRef<HTMLAudioElement | null>(null);
  const presentFadeTimer = useRef<number | null>(null);
  const presentActive = useRef(false);
  const previousGiftOpened = useRef(giftOpened);

  const current = mysteries[activeId - 1];
  const validationPrompts = [
    'Qual leitura sobrevive à segunda camada?',
    'A primeira camada cedeu. O que a próxima margem revela?',
    'Uma resposta abriu caminho. Qual palavra permanece?',
    'O arquivo reconhece o seu olhar. O que ainda está oculto?',
    'Cada ocorrência deixa um vestígio. Qual deles confirma a leitura?',
    'A margem mudou de lugar. Que sentido sobrevive ao ruído?',
    'O silêncio respondeu. Qual é a próxima leitura?',
    'A pasta perdeu mais uma camada. O que ficou no centro?',
    'O registro está quase completo. Qual ausência ainda fala?',
    'A resposta atravessou o papel. O que vem depois dela?',
    'A investigação avança. Qual detalhe não pode ser apagado?',
    'A décima segunda margem respira. O que ela esconde?',
    'O arquivo já conhece parte da verdade. Qual é a próxima chave?',
    'A última camada se aproxima. O que permanece entre as linhas?',
    'Quase tudo foi lido. Qual vestígio ainda pede atenção?',
    'Depois de tudo retirado, o que ainda resta?'
  ];
  const validationPrompt = validationPrompts[Math.min(solved.length, validationPrompts.length - 1)];
  const solvedSet = useMemo(() => new Set(solved), [solved]);
  const confidentialSolvedSet = useMemo(() => new Set(confidentialSolved), [confidentialSolved]);
  const confidentialCurrent = confidentialMysteries[confidentialActiveId - 1];
  const codePapers = useMemo(() => loosePapers.filter((paper) => paper.correct), []);
  const confirmedPaperCount = codePapers.filter((paper) => (paperClicks[paper.id] ?? 0) >= 2).length;
  const isComplete = solved.length === mysteries.length;
  const confidentialComplete = confidentialSolved.length === confidentialMysteries.length;
  const giftUnlocked = investigatorUnlocked && confidentialComplete;
  const codeReady = isComplete && confirmedPaperCount === codePapers.length;
  const lockRemaining = Math.max(0, (locks[activeId] ?? 0) - now);
  const isLocked = lockRemaining > 0;
  const canOpen = (id: number) => id === 1 || solvedSet.has(id - 1);
  const finalLockRemaining = Math.max(0, finalGate.lockUntil - now);
  const finalWindowRemaining = Math.max(0, finalGate.windowUntil - now);
  const finalIsLocked = finalLockRemaining > 0;
  const finalWindowActive = finalWindowRemaining > 0 && !finalGate.solved;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lockUntil = locks[activeId] ?? 0;
    if (lockUntil > 0 && lockUntil <= now && (attempts[activeId] ?? 0) >= 3) {
      setAttempts((previous) => ({ ...previous, [activeId]: 0 }));
      setLocks((previous) => {
        const next = { ...previous };
        delete next[activeId];
        return next;
      });
      setFeedback({ kind: '', message: '' });
    }
  }, [activeId, attempts, locks, now]);

  useEffect(() => {
    window.localStorage.setItem(puzzleStorage.solved, JSON.stringify(solved));
    window.localStorage.setItem(puzzleStorage.attempts, JSON.stringify(attempts));
    window.localStorage.setItem(puzzleStorage.locks, JSON.stringify(locks));
    window.localStorage.setItem(puzzleStorage.paperClicks, JSON.stringify(paperClicks));
    window.localStorage.setItem(puzzleStorage.codeVerified, JSON.stringify(codeVerified));
    window.localStorage.setItem(puzzleStorage.confidentialOpen, JSON.stringify(confidentialOpen));
    window.localStorage.setItem(puzzleStorage.confidentialSolved, JSON.stringify(confidentialSolved));
    window.localStorage.setItem(puzzleStorage.finalGate, JSON.stringify(finalGate));
    window.localStorage.setItem(puzzleStorage.volume, JSON.stringify(volume));
    window.localStorage.setItem(puzzleStorage.investigator, JSON.stringify(investigatorUnlocked));
    window.localStorage.setItem(puzzleStorage.giftOpened, JSON.stringify(giftOpened));
  }, [solved, attempts, locks, paperClicks, codeVerified, confidentialOpen, confidentialSolved, finalGate, volume, investigatorUnlocked, giftOpened]);

  useEffect(() => {
    if (finalGate.lockUntil > 0 && finalGate.lockUntil <= now && finalGate.attempts >= FINAL_ATTEMPT_LIMIT) {
      setFinalGate((prev) => ({ ...prev, attempts: 0, lockUntil: 0, windowUntil: 0 }));
      setFinalFeedback({ kind: '', message: '' });
    }
  }, [finalGate.lockUntil, finalGate.attempts, now]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.audio.volume = musicOn ? volume : 0;
    }
  }, [volume, musicOn, musicTheme]);

  // sino ocasional a cada 45–90s
  useEffect(() => {
    if (!musicOn) return;
    let cancelled = false;
    let timer: number;
    const schedule = () => {
      const delay = 45000 + Math.random() * 45000;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        playBell();
        schedule();
      }, delay);
    };
    schedule();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [musicOn, volume]);

  useEffect(() => {
  return () => {
    const ambient = audioRef.current;

    try {
      ambient?.audio.pause();
      ambient?.audio.removeAttribute('src');
      ambient?.audio.load();
    } catch {
      // ignora erros de limpeza do áudio
    }

    audioRef.current = null;
  };
}, []);

  function jumpTo(id: string) {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function disposeAmbient() {
    const ambient = audioRef.current;
    if (!ambient) return;
    try {
      ambient.audio.pause();
      ambient.audio.src = '';
    } catch { /* */ }
    audioRef.current = null;
  }

  function musicUrl(theme: 'archive' | 'confidential') {
    const base = import.meta.env.BASE_URL;
    return theme === 'archive'
      ? `${base}music/suspense.mp3`
      : `${base}music/horror.mp3`;
  }

  function startAmbient(theme: 'archive' | 'confidential') {
    // se o presente já está tocando a playlist, não volta pro ambient
    if (presentActive.current) return;
    disposeAmbient();
    const audio = new Audio(musicUrl(theme));
    audio.loop = true;
    audio.volume = Math.min(1, Math.max(0, volume));
    audio.preload = 'auto';
    audio.addEventListener('error', () => {
      // Mantém a possibilidade de tentar novamente caso o navegador bloqueie
      // o carregamento/execução do áudio.
      audioStartedRef.current = false;
    });
    audioRef.current = { audio, theme };
    setMusicTheme(theme);
    void audio.play().then(() => {
      audioStartedRef.current = true;
    }).catch(() => {
      // Alguns navegadores só liberam áudio após um toque/clique real.
      audioStartedRef.current = false;
    });
  }

  function ensureAmbient(theme?: 'archive' | 'confidential') {
    const nextTheme = theme ?? musicTheme;
    if (!audioRef.current || audioRef.current.theme !== nextTheme) {
      startAmbient(nextTheme);
    } else {
      const a = audioRef.current.audio;
      a.volume = musicOn ? volume : 0;
      if (a.paused) void a.play().catch(() => {});
    }
  }

  function handleMusicButton() {
    // O botão principal também precisa iniciar/reiniciar o áudio dentro do gesto
    // real do usuário. Antes ele apenas abria o painel de volume.
    if (volume <= 0) setVolume(0.55);
    if (!musicOn) setMusicOn(true);
    if (presentActive.current) {
      if (presentAudioRef.current) {
        presentAudioRef.current.volume = volume > 0 ? volume : 0.55;
        void presentAudioRef.current.play().catch(() => {});
      } else {
        presentActive.current = true;
        playPresentTrack(presentIndex.current);
      }
    } else {
      const theme = confidentialOpen && finalGate.solved ? 'confidential' : 'archive';
      startAmbient(theme);
    }
  }

  function toggleMute() {
    if (musicOn) {
      setMusicOn(false);
      if (audioRef.current) audioRef.current.audio.volume = 0;
      if (presentAudioRef.current) presentAudioRef.current.volume = 0;
    } else {
      setMusicOn(true);
      if (presentActive.current) {
        if (presentAudioRef.current) presentAudioRef.current.volume = volume;
        else playPresentTrack(presentIndex.current);
      } else {
        ensureAmbient();
        if (audioRef.current) audioRef.current.audio.volume = volume;
      }
    }
  }

  // Playlist do presente: nosense → femme-fatale → streets → nosense... (com fade)
  function clearPresentFade() {
    if (presentFadeTimer.current !== null) {
      window.clearInterval(presentFadeTimer.current);
      presentFadeTimer.current = null;
    }
  }

  function stopPresentMusic() {
    presentActive.current = false;
    clearPresentFade();
    if (presentAudioRef.current) {
      try {
        presentAudioRef.current.onended = null;
        presentAudioRef.current.pause();
        presentAudioRef.current.src = '';
      } catch { /* */ }
      presentAudioRef.current = null;
    }
  }

  function fadeAudio(audio: HTMLAudioElement, from: number, to: number, ms: number, onDone?: () => void) {
    clearPresentFade();
    const steps = Math.max(1, Math.floor(ms / 50));
    let step = 0;
    audio.volume = from;
    presentFadeTimer.current = window.setInterval(() => {
      step += 1;
      const t = step / steps;
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (step >= steps) {
        clearPresentFade();
        audio.volume = to;
        onDone?.();
      }
    }, 50);
  }

  function playPresentTrack(index: number) {
    if (!musicOn || !presentActive.current) return;
    const base = import.meta.env.BASE_URL;
    const tracks = presentPlaylist.current;
    const i = ((index % tracks.length) + tracks.length) % tracks.length;
    presentIndex.current = i;

    try {
      const prev = presentAudioRef.current;
      const next = new Audio(`${base}${tracks[i]}`);
      next.volume = 0;
      next.preload = 'auto';
      presentAudioRef.current = next;

      const startNext = () => {
        void next.play().then(() => {
          fadeAudio(next, 0, musicOn ? volume : 0, 1200);
        }).catch(() => {});
        next.onended = () => {
          // fade-out do atual e sobe a próxima (loop)
          fadeAudio(next, next.volume, 0, 900, () => {
            try { next.pause(); next.src = ''; } catch { /* */ }
            playPresentTrack(i + 1);
          });
        };
      };

      if (prev) {
        // fade-out da anterior (macabra ou faixa anterior) e sobe a nova
        fadeAudio(prev, prev.volume, 0, 1000, () => {
          try { prev.pause(); prev.src = ''; } catch { /* */ }
          startNext();
        });
      } else {
        startNext();
      }
    } catch { /* */ }
  }

  // Ao reabrir o site, o presente volta a ficar disponível se os requisitos
  // já estiverem concluídos. O progresso dos enigmas continua salvo.
  useEffect(() => {
    setGiftOpened(false);
    previousGiftOpened.current = false;
    stopPresentMusic();
  }, []);

  useEffect(() => {
    const wasGiftOpened = previousGiftOpened.current;

    // A playlist do presente só pode começar no momento em que o presente
    // acabou de ser aberto. Assim, recarregar a página não inicia o presente
    // antes da hora só porque o progresso ficou salvo no localStorage.
    if (giftOpened && !wasGiftOpened) {
      if (!musicOn) {
        previousGiftOpened.current = giftOpened;
        return;
      }
      presentActive.current = true;
      const ambient = audioRef.current?.audio;
      if (ambient) {
        fadeAudio(ambient, ambient.volume, 0, 1000, () => {
          disposeAmbient();
          presentIndex.current = 0;
          playPresentTrack(0);
        });
      } else {
        disposeAmbient();
        presentIndex.current = 0;
        playPresentTrack(0);
      }
    } else if (!giftOpened) {
      stopPresentMusic();
    }

    previousGiftOpened.current = giftOpened;
  }, [giftOpened, musicOn]);

  function openGift() {
    // Inicia a primeira faixa dentro do gesto real do usuário.
    // Isso evita que iOS/Android bloqueiem o play depois do fade assíncrono.
    previousGiftOpened.current = true;
    setGiftOpened(true);
    if (!musicOn) return;

    // Para a música normal imediatamente antes de iniciar a playlist.
    // Assim as duas nunca ficam tocando ao mesmo tempo.
    presentActive.current = true;
    disposeAmbient();
    clearPresentFade();
    presentIndex.current = 0;
    playPresentTrack(0);
  }

  function playBell() {
    if (!musicOn || volume <= 0) return;
    try {
      const bell = new Audio(`${import.meta.env.BASE_URL}music/bell.mp3`);
      bell.volume = Math.min(0.55, volume * 0.7);
      void bell.play().catch(() => {});
    } catch { /* */ }
  }


  function submitInvestigator(e?: { preventDefault(): void }) {
    e?.preventDefault();
    const normalized = investigatorInput.trim().toLowerCase().replace(/\s+/g, '');
    if (normalized === INVESTIGATOR_ANSWER) {
      setInvestigatorUnlocked(true);
      setInvestigatorFeedback('identidade confirmada.');
      setInvestigatorOpen(false);
    } else {
      setInvestigatorFeedback('sinal não reconhecido.');
    }
  }

  function openGallery(path: string, e?: { stopPropagation(): void; preventDefault(): void }) {
    e?.stopPropagation();
    e?.preventDefault();
    setGalleryIndex(galleryIndexFor(path));
  }

  function galleryPrev() {
    setGalleryIndex((i) => (i === null ? 0 : (i - 1 + PHOTO_GALLERY.length) % PHOTO_GALLERY.length));
  }

  function galleryNext() {
    setGalleryIndex((i) => (i === null ? 0 : (i + 1) % PHOTO_GALLERY.length));
  }

  useEffect(() => {
    if (galleryIndex === null) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setGalleryIndex(null);
      if (ev.key === 'ArrowLeft') galleryPrev();
      if (ev.key === 'ArrowRight') galleryNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [galleryIndex]);

  function beginArchive() {
    ensureAmbient('archive');
    jumpTo('ocorrencias');
  }

  function selectMystery(id: number) {
    if (!canOpen(id)) return;
    setActiveId(id);
    setAnswer('');
    setFeedback({ kind: '', message: '' });
    document.getElementById('quadro')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLocked || solvedSet.has(current.id)) return;
    const normalized = answer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const expected = current.answer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalized === expected) {
      const nextSolved = [...new Set([...solved, current.id])].sort((a, b) => a - b);
      setSolved(nextSolved);
      setAnswer('');
      setFeedback({ kind: 'success', message: current.unlock });
      if (current.id < mysteries.length) setActiveId(current.id + 1);
      return;
    }
    const nextAttempts = (attempts[current.id] ?? 0) + 1;
    setAttempts((previous) => ({ ...previous, [current.id]: nextAttempts }));
    if (nextAttempts >= 3) {
      const until = Date.now() + 60000;
      setLocks((previous) => ({ ...previous, [current.id]: until }));
      setFeedback({ kind: 'error', message: 'Devido a muitas tentativas e erros, o papel acabou se rasgando um pouco. Um novo está sendo impresso já.' });
    } else {
      setFeedback({ kind: 'error', message: 'A evidência não confirma essa leitura. Volte ao quadro e compare os vestígios.' });
    }
  }

  function handlePaperClick(paper: (typeof loosePapers)[number]) {
    if (!paper.correct) {
      setPaperFeedback('A margem não reconhece esse papel. Talvez ele tenha chegado antes da gaveta.');
      return;
    }
    const nextClicks = { ...paperClicks, [paper.id]: Math.min(2, (paperClicks[paper.id] ?? 0) + 1) };
    setPaperClicks(nextClicks);
    const nextConfirmed = codePapers.filter((item) => (nextClicks[item.id] ?? 0) >= 2).length;
    setPaperFeedback(nextConfirmed === codePapers.length
      ? isComplete ? 'A margem perdeu o último segredo e ficou quieta.' : 'A margem continua quieta até o último registro.'
      : 'O papel mudou de posição, mas a frase continua sem assunto.');
    if (isComplete && nextConfirmed === codePapers.length) setCodeVerified(true);
  }

  function resetInvestigation() {
    Object.values(puzzleStorage).forEach((key) => {
      if (key !== puzzleStorage.volume) window.localStorage.removeItem(key);
    });
    setSolved([]);
    setAttempts({});
    setLocks({});
    setPaperClicks({});
    setCodeVerified(false);
    setConfidentialOpen(false);
    setConfidentialSolved([]);
    setActiveId(1);
    setConfidentialActiveId(1);
    setAnswer('');
    setFeedback({ kind: '', message: '' });
    setPaperFeedback('');
    setConfidentialFeedback({ kind: '', message: '' });
    setFinalGate({ attempts: 0, lockUntil: 0, windowUntil: 0, solved: false });
    setFinalAnswer('');
    setFinalFeedback({ kind: '', message: '' });
    setShowFinalRiddle(false);
    disposeAmbient();
    setMusicTheme('archive');
    setMusicOn(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openFinalRiddle() {
    if (!codeReady) return;
    setShowFinalRiddle(true);
    setFinalFeedback({ kind: '', message: '' });
    if (!finalGate.solved && !finalIsLocked) {
      setFinalGate((prev) => ({
        ...prev,
        windowUntil: Date.now() + FINAL_SOLVE_WINDOW_MS,
        attempts: prev.attempts >= FINAL_ATTEMPT_LIMIT ? 0 : prev.attempts,
      }));
    }
    window.setTimeout(() => {
      document.getElementById('charada-final')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  }

  function submitFinalRiddle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (finalGate.solved || finalIsLocked) return;
    if (finalGate.windowUntil > 0 && finalGate.windowUntil <= Date.now() && !finalGate.solved) {
      setFinalGate((prev) => ({
        ...prev,
        lockUntil: Date.now() + FINAL_COOLDOWN_MS,
        windowUntil: 0,
        attempts: FINAL_ATTEMPT_LIMIT,
      }));
      setFinalFeedback({
        kind: 'error',
        message: 'O tempo se esgotou. O papel se fecha sozinho. Aguarde 5 minutos para uma nova impressão.',
      });
      return;
    }
    const normalized = finalAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalized === FINAL_RIDDLE_ANSWER) {
      setFinalGate({ attempts: 0, lockUntil: 0, windowUntil: 0, solved: true });
      setFinalAnswer('');
      setFinalFeedback({ kind: 'success', message: 'A margem reconheceu a espera. O lacre da segunda pasta cedeu.' });
      window.setTimeout(() => {
        setCodeVerified(true);
        setConfidentialOpen(true);
        startAmbient('confidential');
        setShowFinalRiddle(false);
        jumpTo('arquivo-confidencial');
      }, 1200);
      return;
    }
    const nextAttempts = finalGate.attempts + 1;
    if (nextAttempts >= FINAL_ATTEMPT_LIMIT) {
      setFinalGate({
        attempts: nextAttempts,
        lockUntil: Date.now() + FINAL_COOLDOWN_MS,
        windowUntil: 0,
        solved: false,
      });
      setFinalFeedback({
        kind: 'error',
        message: 'Devido a muitas tentativas e erros, o papel acabou se rasgando um pouco. Um novo está sendo impresso já. Aguarde 5 minutos.',
      });
    } else {
      setFinalGate((prev) => ({ ...prev, attempts: nextAttempts }));
      setFinalFeedback({
        kind: 'error',
        message: `Leitura rejeitada. Tentativas restantes: ${FINAL_ATTEMPT_LIMIT - nextAttempts}.`,
      });
    }
  }

  function enterConfidentialFile() {
    if (!codeReady) return;
    if (finalGate.solved) {
      setCodeVerified(true);
      setConfidentialOpen(true);
      startAmbient('confidential');
      window.setTimeout(() => jumpTo('arquivo-confidencial'), 60);
      return;
    }
    openFinalRiddle();
  }

  function submitConfidentialAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confidentialSolvedSet.has(confidentialCurrent.id)) return;
    const normalized = confidentialAnswer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const expected = confidentialCurrent.answer.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (normalized === expected) {
      const nextSolved = [...new Set([...confidentialSolved, confidentialCurrent.id])].sort((a, b) => a - b);
      setConfidentialSolved(nextSolved);
      setConfidentialAnswer('');
      setConfidentialFeedback({ kind: 'success', message: 'A folha aceitou a leitura. O próximo lacre perdeu uma camada.' });
      if (confidentialCurrent.id < confidentialMysteries.length) setConfidentialActiveId(confidentialCurrent.id + 1);
      return;
    }
    setConfidentialFeedback({ kind: 'error', message: 'A pasta devolveu a pergunta sem a resposta. Leia a margem antes de tentar novamente.' });
  }


  useEffect(() => {
    const kick = () => {
      if (!audioStartedRef.current) {
        // Mistério no início; macabra somente após abrir a parte secreta.
        const theme = confidentialOpen && finalGate.solved ? 'confidential' : 'archive';
        setMusicOn(true);
        startAmbient(theme);
      } else if (audioRef.current?.audio.paused && musicOn) {
        void audioRef.current.audio.play().catch(() => {});
      }
    };
    // iOS/Android podem bloquear autoplay; escute gestos reais de toque e clique.
    window.addEventListener('touchstart', kick, { passive: true });
    window.addEventListener('pointerdown', kick);
    window.addEventListener('click', kick);
    window.addEventListener('keydown', kick);
    return () => {
      window.removeEventListener('touchstart', kick);
      window.removeEventListener('pointerdown', kick);
      window.removeEventListener('click', kick);
      window.removeEventListener('keydown', kick);
    };
  }, [confidentialOpen, finalGate.solved]);

  // quando a confidencial abre, troca o tema; quando fecha, volta
  // (não interfere se o presente já estiver tocando)
  useEffect(() => {
    if (!audioStartedRef.current) return;
    if (giftOpened || presentActive.current) return;
    if (confidentialOpen && finalGate.solved) {
      if (musicTheme !== 'confidential') startAmbient('confidential');
    } else if (musicTheme === 'confidential') {
      startAmbient('archive');
    }
  }, [confidentialOpen, finalGate.solved, giftOpened]);

  return (
    <div className="arg-shell overflow-hidden">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[74px] flex-col items-center justify-between border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] py-7 text-[hsl(var(--sidebar-foreground))] lg:flex">
        <button onClick={() => jumpTo('inicio')} className="group flex flex-col items-center gap-2" data-testid="button-rail-home" aria-label="Voltar ao início">
          <span className="flex h-9 w-9 items-center justify-center border border-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary))] transition-transform group-hover:rotate-45"><Fingerprint size={17} /></span>
          <span className="font-data text-[8px] tracking-[.3em] [writing-mode:vertical-rl]">ARQ / AP</span>
        </button>
        <div className="flex flex-col items-center gap-7 text-[hsl(var(--sidebar-foreground))]/55">
          <button onClick={() => jumpTo('ocorrencias')} data-testid="button-rail-cases" aria-label="Ir para ocorrências"><FileText size={16} /></button>
          <button onClick={() => jumpTo('evidencias')} data-testid="button-rail-evidence" aria-label="Ir para evidências"><ScanLine size={16} /></button>
          <button onClick={() => jumpTo('quadro')} data-testid="button-rail-board" aria-label="Ir para quadro de investigação"><KeyRound size={16} /></button>
        </div>
        <span className="font-data text-[8px] tracking-[.22em] text-[hsl(var(--sidebar-foreground))]/45 [writing-mode:vertical-rl]">NÃO OFICIAL · FICÇÃO</span>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-30 flex h-[74px] items-center justify-between border-b border-[hsl(var(--border))]/70 bg-[hsl(var(--background))]/88 px-5 backdrop-blur-md lg:left-[74px] lg:px-12">
        <button onClick={() => jumpTo('inicio')} className="flex items-center gap-3" data-testid="button-header-logo">
          <span className="font-data text-[10px] tracking-[.25em] text-[hsl(var(--primary))]">AP</span><span className="h-3 w-px bg-[hsl(var(--border))]" /><span className="font-data text-[10px] tracking-[.18em]">ARQUIVO PARANORMAL</span>
        </button>
         <nav className="hidden items-center gap-8 font-data text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))] md:flex">
          <button onClick={() => jumpTo('ocorrencias')} className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="button-nav-cases">Ocorrências</button>
          <button onClick={() => jumpTo('evidencias')} className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="button-nav-evidence">Evidências</button>
          <button onClick={() => jumpTo('linha-do-tempo')} className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="button-nav-timeline">Cronologia</button>
          <button onClick={() => jumpTo('quadro')} className="transition-colors hover:text-[hsl(var(--primary))]" data-testid="button-nav-board">Quadro criminal</button>
        </nav>
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => { handleMusicButton(); setShowVolume((v) => !v); }}
            className="flex items-center gap-2 border border-[hsl(var(--border))] px-3 py-2 font-data text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]"
            data-testid="button-toggle-music"
            aria-pressed={musicOn}
            aria-label="Controle de volume"
          >
            {musicOn && volume > 0 ? <Volume2 size={13} /> : <VolumeX size={13} />}
            <span className="hidden sm:inline">{musicOn ? (musicTheme === 'archive' ? 'sinal' : 'assombro') : 'mudo'}</span>
          </button>
          {showVolume && (
            <div className="absolute right-0 top-full z-50 mt-2 flex w-44 flex-col gap-2 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 shadow-lg">
              <div className="flex items-center justify-between font-data text-[9px] uppercase tracking-[.12em] text-[hsl(var(--muted-foreground))]">
                <span>volume</span>
                <button type="button" onClick={toggleMute} className="text-[hsl(var(--primary))]">{musicOn ? 'silenciar' : 'ativar'}</button>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setVolume(v);
                  if (v > 0 && !musicOn) setMusicOn(true);
                  ensureAmbient();
                }}
                className="volume-slider w-full"
                aria-label="Volume do ambiente"
                data-testid="input-volume"
              />
              <p className="font-data text-[8px] tracking-[.1em] text-[hsl(var(--muted-foreground))]/70">
                {musicTheme === 'archive' ? 'modo: concentração' : 'modo: macabro'}
              </p>
            </div>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="border border-[hsl(var(--border))] p-2 md:hidden" data-testid="button-mobile-menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="fixed left-0 right-0 top-[74px] z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 shadow-lg md:hidden">
          <div className="grid gap-1 font-data text-[11px] uppercase tracking-[.17em]">
            <button onClick={() => jumpTo('ocorrencias')} className="border-b border-[hsl(var(--border))]/60 py-3 text-left" data-testid="button-mobile-cases">01 / Ocorrências</button>
            <button onClick={() => jumpTo('evidencias')} className="border-b border-[hsl(var(--border))]/60 py-3 text-left" data-testid="button-mobile-evidence">02 / Evidências</button>
            <button onClick={() => jumpTo('quadro')} className="py-3 text-left" data-testid="button-mobile-board">03 / Quadro criminal</button>
          </div>
        </div>
      )}

      <main className="lg:pl-[74px]">
        <section id="inicio" className="relative flex min-h-[100dvh] items-end overflow-hidden border-b border-[hsl(var(--border))] px-6 pb-14 pt-32 sm:px-12 lg:px-[8vw] lg:pb-20">
          <div className="absolute inset-0" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}element-wheel.svg`} alt="" className="hero-element-wheel absolute left-[8%] top-[12%] h-[min(52vw,560px)] w-[min(52vw,560px)] opacity-[0.38]" /><img src={`${import.meta.env.BASE_URL}element-wheel.svg`} alt="" className="hero-element-wheel-rev absolute right-[4%] top-[28%] h-[min(28vw,280px)] w-[min(28vw,280px)] opacity-[0.18]" /></div>
          <div className="absolute right-[7vw] top-[22vh] hidden w-48 rotate-[7deg] border border-[hsl(var(--border))] bg-[hsl(39_38%_84%)] p-4 text-[hsl(var(--foreground))] shadow-lg lg:block"><div className="tape -top-3 left-5 rotate-[-4deg]" /><div className="font-data text-[8px] leading-5 opacity-70">OBSERVAÇÃO<br />Sala de ocultismo<br />registrada às 02:17.<br /><br />Não remover a<br />fotografia do verso.</div><img src={`${import.meta.env.BASE_URL}photos/sticky-verso.jpg`} alt="" className="sticky-photo photo-clickable" onClick={(e) => openGallery('photos/sticky-verso.jpg', e)} /></div>
          <div className="relative z-10 max-w-5xl">
            <div className="reveal eyebrow mb-7 flex items-center gap-3 text-[hsl(var(--primary))]"><CircleDot size={11} className="flicker" /> caso não catalogado · arquivo paranormal · acesso restrito</div>
            <h1 className="reveal delay-1 font-display text-[clamp(3.35rem,10.5vw,10rem)] font-bold leading-[.82] tracking-[-.075em]">Arquivo<br /><span className="text-[hsl(var(--primary))]">Paranormal</span></h1>
            <div className="reveal delay-2 mt-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-md text-sm leading-7 text-[hsl(var(--muted-foreground))]">Dezesseis ocorrências. Uma cidade que insiste em esquecer. <span className="text-[hsl(var(--foreground))]">O arquivo não está vazio.</span></p><button onClick={beginArchive} className="group flex w-fit items-center gap-4 border border-[hsl(var(--foreground))] px-5 py-3 font-data text-[10px] uppercase tracking-[.17em] transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]" data-testid="button-open-file">abrir a pasta <ArrowDownRight size={15} className="transition-transform group-hover:translate-y-1 group-hover:translate-x-1" /></button></div>
          </div>
          <div className="absolute bottom-7 right-6 hidden items-center gap-3 font-data text-[9px] tracking-[.2em] text-[hsl(var(--muted-foreground))] sm:flex"><span className="h-px w-10 bg-[hsl(var(--border))]" /> role para continuar / 01</div>
        </section>

        <section id="ocorrencias" className="relative overflow-visible border-b border-[hsl(var(--border))] px-6 py-24 sm:px-12 lg:px-[8vw] lg:py-36">
          <div className="loose-paper-field">
            {loosePapers.filter((paper) => paper.zone === 'occurrences').map((paper) => <button key={paper.id} onClick={() => handlePaperClick(paper)} className={`loose-paper ${paper.position} ${paper.tone === 'correct' ? 'loose-paper-correct' : 'loose-paper-faded'}`} style={{ '--paper-rotate': paper.rotate } as CSSProperties} aria-label={`fragmento ${paper.note}`} data-testid={`button-loose-paper-${paper.id}`}><span>{paper.text}</span><small>{paper.note}</small></button>)}
          </div>
          <div className="relative z-10 grid gap-14 lg:grid-cols-[.68fr_1.32fr] lg:gap-24">
            <div className="reveal"><p className="eyebrow text-[hsl(var(--primary))]">01 / pasta de ocorrências</p><h2 className="mt-5 max-w-sm font-display text-4xl leading-[1.04] sm:text-5xl">Começa sempre com algo que <em>desaparece</em>.</h2><p className="mt-7 max-w-sm text-sm leading-7 text-[hsl(var(--muted-foreground))]">Cada capa esconde um recorte que o mapa preferiu apagar. Abra com cuidado. O intervalo entre duas linhas ainda respira.</p><div className="mt-10 flex items-center gap-3 font-data text-[9px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]"><ShieldAlert size={16} className="text-[hsl(var(--primary))]" /> circulação limitada · 05 recortes</div></div>
            <div className="grid gap-5 sm:grid-cols-2">
              {incidentCards.map((item, index) => {
                const open = activeIncident === item.code;
                return <button key={item.code} onClick={() => setActiveIncident(open ? null : item.code)} className={`paper-lift reveal delay-${(index % 3) + 1} relative min-h-[220px] text-left ${item.tone === 'dark' ? 'paper-dark border border-[hsl(var(--card))]/20' : 'paper'} ${index === 4 ? 'sm:col-span-2 lg:max-w-[calc(50%-10px)]' : ''}`} data-testid={`button-incident-${index + 1}`} aria-expanded={open}>
                  <div className="absolute right-4 top-4 font-data text-[9px] opacity-50">{item.code}</div><div className="flex h-full flex-col justify-between p-6"><div><p className="eyebrow opacity-55">capa de notícia · {item.tag}</p><h3 className="mt-4 max-w-[240px] font-display text-2xl leading-tight">{item.title}</h3><img src={`${import.meta.env.BASE_URL}${['photos/char-01-face.jpg','photos/place-posto.jpg','photos/char-03-face.jpg','photos/place-garagem.jpg','photos/place-granja.jpg'][index]}`} alt="" className="incident-photo photo-clickable" loading="lazy" onClick={(e) => openGallery(['photos/char-01.jpg','photos/place-posto.jpg','photos/char-03.jpg','photos/place-garagem.jpg','photos/place-granja.jpg'][index], e)} /></div><div><div className={`news-paper-fragment ${item.paperTone === 'yellow' ? 'news-paper-yellow' : 'news-paper-ink'}`}><span className={item.paperBlur ? 'blur-[3px]' : ''}>{item.paperValue}</span><span className="font-data text-[8px] uppercase tracking-[.12em] opacity-55">recorte</span></div><p className={`mt-5 text-sm leading-6 ${open ? '' : 'line-clamp-2'}`}>{item.copy}</p><div className="mt-5 flex items-center justify-between border-t border-current/15 pt-3 font-data text-[9px] opacity-55"><span>{open ? 'recorte aberto' : 'abrir recorte'}</span>{open ? <ChevronDown size={14} /> : <ArrowUpRight size={14} />}</div></div></div>
                </button>;
              })}
            </div>
          </div>
        </section>

        <section id="evidencias" className="relative overflow-hidden border-b border-[hsl(var(--border))] bg-[hsl(31_28%_23%)] px-6 py-24 text-[hsl(var(--card))] sm:px-12 lg:px-[8vw] lg:py-36">
          <div className="loose-paper-field loose-paper-evidence-field">
            {loosePapers.filter((paper) => paper.zone === 'evidence').map((paper) => <div key={paper.id} className={`loose-paper ${paper.position} ${paper.tone === 'correct' ? 'loose-paper-correct' : 'loose-paper-faded'}`} style={{ '--paper-rotate': paper.rotate } as CSSProperties}><span>{paper.text}</span><small>{paper.note}</small></div>)}
          </div>
          <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="eyebrow text-[hsl(43_65%_51%)]">02 / vestígios anexados</p><h2 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">A prova nunca chega<br /><em className="text-[hsl(43_65%_51%)]">inteira.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[hsl(var(--card))]/60">Três molduras vazias. Três rostos que o arquivo se recusou a nomear. O que falta em cada imagem pode ser a única coisa que ainda liga uma ocorrência à outra.</p></div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              ['portrait-slot', 'TESTEMUNHA / 01', 'cabelo perfeito', 'tatuagens · olhar desviado · arquivo 05', 'paper-dark'],
              ['photo-slot', 'REGISTRO / 02', 'estranho branco?', 'runas ao fundo · risco alto', 'paper'],
              ['frame-slot', 'FRAGMENTO / 03', 'jae arlecchino', 'sorriso forçado · marcas no pescoço', 'paper-dark'],
            ].map(([id, label, title, meta, tone], index) => <button key={id} onClick={() => setActiveIncident(activeIncident === id ? null : id)} className={`paper-lift reveal delay-${index + 1} group relative min-h-[300px] text-left ${tone === 'paper-dark' ? 'paper-dark border border-[hsl(var(--card))]/20' : 'paper'}`} data-testid={`button-asset-slot-${index + 1}`}>
              <div className="flex h-full flex-col justify-between p-6"><div><img src={`${import.meta.env.BASE_URL}${['photos/char-05-face.jpg','photos/char-07-face.jpg','photos/char-10-face.jpg'][index]}`} alt="" className="asset-photo photo-clickable" loading="lazy" onClick={(e) => openGallery(['photos/char-05.jpg','photos/char-07.jpg','photos/char-10.jpg'][index], e)} /><p className="eyebrow opacity-55">{label}</p><h3 className="mt-3 font-display text-2xl leading-tight">{title}</h3></div><div className="flex items-center justify-between border-t border-current/15 pt-3 font-data text-[9px] opacity-55"><span>{activeIncident === id ? 'campo selecionado · ' : ''}{meta}</span><ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div></div>
            </button>)}
          </div>
          <div className="reveal delay-3 mt-14 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[hsl(var(--card))]/20 pt-5 font-data text-[9px] uppercase tracking-[.15em] text-[hsl(var(--card))]/55"><span>slots de evidência aguardam anexos</span><span className="hidden h-px w-14 bg-[hsl(43_65%_51%)] sm:block" /><span className="text-[hsl(43_65%_51%)]">material original · sem imagens oficiais</span></div>
        </section>

        <section id="linha-do-tempo" className="relative border-b border-[hsl(var(--border))] px-6 py-24 sm:px-12 lg:px-[8vw] lg:py-36">
          <div className="grid gap-14 lg:grid-cols-[.55fr_1.45fr] lg:gap-24"><div className="reveal"><p className="eyebrow text-[hsl(var(--primary))]">03 / cronologia contaminada</p><h2 className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl">Datas que não querem ficar <em>paradas</em>.</h2><div className="mt-9 flex items-center gap-3 font-data text-[10px] text-[hsl(var(--muted-foreground))]"><Clock3 size={17} className="text-[hsl(var(--primary))]" /> sincronização perdida</div></div><div className="relative"><div className="absolute bottom-4 left-[7px] top-4 w-px bg-[hsl(var(--border))]" />{timeline.map(([date, title, body], index) => <div key={date} className={`reveal delay-${index + 1} relative grid grid-cols-[40px_1fr] gap-5 pb-12 last:pb-0 sm:grid-cols-[100px_1fr] sm:gap-8`}><div className="relative z-10 mt-1 flex h-4 w-4 items-center justify-center bg-[hsl(var(--background))]"><span className="h-2 w-2 rounded-full bg-[hsl(var(--primary))]" /></div><div><p className="font-data text-[10px] tracking-[.14em] text-[hsl(var(--primary))]">{date}</p><h3 className="mt-2 font-display text-2xl">{title}</h3><p className="mt-2 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">{body}</p></div></div>)}</div></div>
        </section>

        <section id="quadro" className="relative overflow-hidden border-b border-[hsl(var(--border))] bg-[hsl(25_26%_16%)] px-6 py-24 text-[hsl(38_29%_87%)] sm:px-12 lg:px-[8vw] lg:py-36">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[hsl(43_65%_51%)]/20 opacity-40" /><div className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full border border-[hsl(43_65%_51%)]/10 opacity-30" />
          <div className="relative"><div className="reveal flex flex-col justify-between gap-8 border-b border-[hsl(38_29%_87%)]/15 pb-10 md:flex-row md:items-end"><div><p className="eyebrow text-[hsl(43_65%_51%)]">04 / quadro criminal · arquivo paranormal</p><h2 className="mt-5 max-w-3xl font-display text-5xl leading-[.98] sm:text-7xl">Dezesseis fichas.<br /><span className="text-[hsl(43_65%_51%)]">Uma sala.</span></h2><p className="mt-8 max-w-xl text-sm leading-7 text-[hsl(38_29%_87%)]/60">As fichas não guardam crimes isolados. Cada ocorrência contaminou a próxima. Siga apenas o arquivo que perdeu o lacre e trate toda resposta como uma anotação de campo ainda contestável.</p><p className="mt-4 font-data text-[9px] uppercase tracking-[.16em] text-[hsl(43_65%_51%)]/75">camada 03 · o quadro não mostra todas as conexões</p></div><div className="progress-stamp"><span className="font-data text-3xl text-[hsl(43_65%_51%)]">{solved.length.toString().padStart(2, '0')}</span><span className="font-data text-[9px] uppercase tracking-[.15em] text-[hsl(38_29%_87%)]/55"> / 16 resolvidos</span></div></div>
            <div className="criminal-board mt-10">
              <div className="board-thread board-thread-one" /><div className="board-thread board-thread-two" /><div className="board-stamp">CASOS CONECTADOS<br /><span>não catalogados</span></div>
              <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
              {mysteries.map((item) => { const available = canOpen(item.id); const done = solvedSet.has(item.id); const casePhotos: Record<number, string> = {1:'photos/place-floresta.jpg',4:'photos/char-02-face.jpg',6:'photos/place-torre.jpg',8:'photos/place-circo.jpg',11:'photos/char-06-face.jpg',14:'photos/place-mato.jpg',16:'photos/char-09-face.jpg'}; const photoSrc = casePhotos[item.id]; return <button key={item.id} onClick={() => selectMystery(item.id)} disabled={!available} className={`case-tab ${done ? 'case-tab-done' : ''} ${item.id === activeId ? 'case-tab-active' : ''} ${!available ? 'case-tab-locked' : ''}`} data-testid={`button-mystery-${item.id}`} aria-label={`${item.code}: ${item.title}`}><span className="font-data text-[10px]">{item.code}</span>{photoSrc && <img src={`${import.meta.env.BASE_URL}${photoSrc}`} alt="" className="case-photo photo-clickable" loading="lazy" onClick={(e) => openGallery(photoSrc, e)} />}<span className="mt-2 line-clamp-2 font-display text-base leading-tight sm:text-lg">{item.title}</span><span className="mt-4 flex items-center justify-between font-data text-[8px] uppercase tracking-[.13em] opacity-55"><span>{done ? 'resolvido' : available ? 'consultar' : 'lacrado'}</span>{done ? <Check size={13} /> : available ? <ArrowUpRight size={13} /> : <LockKeyhole size={12} />}</span></button>; })}
              </div>
            </div>
            <div className="mt-12 grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
              <div className="reveal"><div className="border border-[hsl(38_29%_87%)]/20 bg-[hsl(25_20%_20%)] p-6 sm:p-9"><div className="flex items-center justify-between border-b border-[hsl(38_29%_87%)]/15 pb-5 font-data text-[9px] uppercase tracking-[.16em]"><span>{current.code} / {current.category}</span><span className={solvedSet.has(current.id) ? 'text-[hsl(43_65%_51%)]' : 'text-[hsl(38_29%_87%)]/45'}>{solvedSet.has(current.id) ? '● encerrado' : '● em consulta'}</span></div><p className="mt-8 font-data text-[10px] uppercase tracking-[.14em] text-[hsl(43_65%_51%)]">{current.date} · {current.place}</p><h3 className="mt-3 font-display text-4xl leading-tight">{current.title}</h3><p className="mt-6 text-sm leading-7 text-[hsl(38_29%_87%)]/65">{current.report}</p><div className="torn-evidence mt-8"><div className="stain left-4 top-3 h-14 w-20" /><div className="stain right-8 bottom-2 h-20 w-24" /><p className="relative eyebrow text-[hsl(25_26%_16%)]/60">{current.artifact}</p><p className="relative mt-5 max-w-md font-data text-base leading-8 tracking-[.06em] sm:text-lg text-[hsl(25_26%_16%)]">{current.clue}</p><p className="relative mt-5 font-data text-[9px] uppercase tracking-[.12em] text-[hsl(25_26%_16%)]/50">{current.evidenceLabel} · leitura incompleta</p></div></div></div>
              <div className="reveal delay-1"><div className="mb-5 flex items-center justify-between font-data text-[9px] uppercase tracking-[.14em] text-[hsl(38_29%_87%)]/45"><span>registro ativo / {current.id.toString().padStart(2, '0')} de 16</span><span>{solved.length} concluídos</span></div><div className="border border-[hsl(38_29%_87%)]/20 bg-[hsl(25_20%_20%)] p-6 sm:p-9"><p className="eyebrow text-[hsl(43_65%_51%)]">campo de validação</p>{solvedSet.has(current.id) ? <div className="secret-shimmer mt-8 border border-[hsl(43_65%_51%)]/40 p-6 sm:p-8"><div className="flex items-center gap-3 font-data text-[10px] uppercase tracking-[.15em] text-[hsl(43_65%_51%)]"><Check size={15} /> fragmento liberado</div><h3 className="mt-7 font-display text-3xl leading-tight">{current.unlock}</h3><p className="mt-5 text-sm leading-7 text-[hsl(38_29%_87%)]/60">A próxima ocorrência está marcada no quadro. O papel não foi removido da pasta.</p></div> : <><p className="mt-7 max-w-xl font-display text-2xl leading-snug">{validationPrompt}</p><form onSubmit={submitAnswer} className="mt-8 flex flex-col gap-3 sm:flex-row"><label htmlFor="mystery-answer" className="sr-only">Resposta da ocorrência {current.code}</label><input id="mystery-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={isLocked} placeholder={isLocked ? 'campo temporariamente lacrado' : 'registrar leitura final'} aria-label="Resposta da ocorrência" className="min-h-12 flex-1 border border-[hsl(38_29%_87%)]/25 bg-transparent px-4 font-data text-xs uppercase tracking-[.12em] outline-none transition-colors placeholder:text-[hsl(38_29%_87%)]/25 focus:border-[hsl(43_65%_51%)] disabled:cursor-not-allowed disabled:opacity-45" data-testid="input-mystery-answer" /><button type="submit" disabled={isLocked} className="flex min-h-12 items-center justify-center gap-3 bg-[hsl(43_65%_51%)] px-6 font-data text-[10px] uppercase tracking-[.14em] text-[hsl(25_26%_16%)] transition-colors hover:bg-[hsl(38_29%_87%)] disabled:cursor-not-allowed disabled:opacity-45" data-testid="button-submit-mystery">anexar leitura <ArrowUpRight size={14} /></button></form>{isLocked && <div className="mt-5 flex items-center gap-3 border-l-2 border-[hsl(43_65%_51%)] px-3 py-2 font-data text-[10px] leading-5 text-[hsl(43_65%_51%)]" data-testid="status-mystery-lock"><TimerReset size={14} /> consulta suspensa · {Math.ceil(lockRemaining / 1000)}s restantes</div>}{feedback.message && <p className={`mt-5 border-l-2 px-3 py-2 font-data text-[10px] leading-5 ${feedback.kind === 'success' ? 'border-[hsl(43_65%_51%)] text-[hsl(43_65%_51%)]' : 'border-[hsl(4_72%_51%)] text-[hsl(4_72%_51%)]'}`} data-testid="status-mystery-feedback">{feedback.message}</p>}</>}</div><div className="mt-5 flex items-center justify-between font-data text-[9px] uppercase tracking-[.13em] text-[hsl(38_29%_87%)]/40"><span>tentativas nesta folha: {attempts[current.id] ?? 0} / 3</span><span>sem atalhos</span></div></div>
            </div>
            {isComplete && <div className="completion-panel reveal is-visible mt-12"><div><p className="eyebrow text-[hsl(43_65%_51%)]">registro de encerramento provisório</p><h3 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">16 / 16 ocorrências reconhecidas.</h3><p className="mt-5 max-w-2xl text-sm leading-7 text-[hsl(38_29%_87%)]/65">As ocorrências foram confirmadas, mas algumas coisas ainda parecem estar escondidas. A resposta deve estar em algum papel pela pasta.</p></div><BookOpen size={42} strokeWidth={1} className="text-[hsl(43_65%_51%)]" /></div>}
          </div>
        </section>

        <section className="border-b border-[hsl(var(--border))] px-6 py-24 sm:px-12 lg:px-[8vw] lg:py-32">
          <div className="reveal grid gap-10 lg:grid-cols-[1.08fr_.92fr]">
            <div className="paper code-hunt-panel relative overflow-hidden p-7 sm:p-9">
              <div className="stain -right-4 -top-4 h-32 w-32" /><div className="tape -left-4 top-7 rotate-[9deg]" />
              <p className="eyebrow text-[hsl(var(--primary))]">fragmento / margem sem procedência</p>
              <h2 className="mt-7 max-w-lg font-display text-3xl leading-tight sm:text-4xl">Quatro gavetas guardam a mesma coisa, mas nenhuma conhece o nome dela.</h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-[hsl(var(--foreground))]/70">Uma colher apontou para o teto, o teto respondeu com sete passos e a margem perdeu a terceira palavra.</p>
              <div className="decoy-riddle mt-8"><p className="font-data text-base leading-8">Quando a janela fecha por dentro, o que fica do lado de fora da pergunta?</p><p className="mt-4 text-[11px] leading-6 opacity-65">— registro sem assunto / folha não consultada</p></div>
              <p className="mt-6 border-l-2 border-[hsl(var(--primary))] px-3 py-2 font-data text-[10px] leading-5 text-[hsl(var(--foreground))]/65" data-testid="status-code-fragments">{paperFeedback || 'A folha não indica onde procurar. A pasta apenas registra que algo foi tocado.'}</p>
              {codeReady && <div className="code-confirmation mt-8 border border-[hsl(var(--primary))]/60 p-5 sm:p-7">
                <p className="eyebrow text-[hsl(var(--primary))]">prova aceita · sequência reconstituída</p>
                <p className="mt-4 font-data text-3xl tracking-[.28em] text-[hsl(var(--primary))] sm:text-4xl">16092008</p>
                <p className="mt-5 font-display text-2xl leading-tight">você é uma ótima investigadora, gostaria de continuar trabalhando com a gente?</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={enterConfidentialFile} className="flex items-center gap-3 bg-[hsl(var(--primary))] px-5 py-3 font-data text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary-foreground))] transition-colors hover:bg-[hsl(var(--foreground))] hover:text-[hsl(var(--background))]" data-testid="button-continue-confidential">sim · continuar <ArrowUpRight size={14} /></button>
                  <button onClick={resetInvestigation} className="border border-[hsl(var(--foreground))]/35 px-5 py-3 font-data text-[10px] uppercase tracking-[.14em] text-[hsl(var(--foreground))]/70 transition-colors hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]" data-testid="button-reset-investigation">não · apagar o progresso</button>
                </div>
              </div>}
              {showFinalRiddle && codeReady && !finalGate.solved && (
                <div id="charada-final" className="final-riddle-panel mt-8 border border-[hsl(var(--primary))]/50 bg-[hsl(39_30%_78%)] p-5 sm:p-7">
                  <p className="eyebrow text-[hsl(var(--primary))]">última verificação · tempo limitado</p>
                  <h3 className="mt-4 font-display text-2xl leading-tight sm:text-3xl">{FINAL_RIDDLE_TEXT}</h3>
                  <p className="mt-4 text-sm leading-6 text-[hsl(var(--foreground))]/70">Uma palavra. Sem acento. Três tentativas. Sessenta segundos.</p>
                  {finalIsLocked ? (
                    <div className="mt-5 flex items-center gap-3 border-l-2 border-[hsl(4_72%_51%)] px-3 py-2 font-data text-[10px] leading-5 text-[hsl(4_72%_51%)]">
                      <TimerReset size={14} />
                      papel rasgado · nova impressão em {Math.ceil(finalLockRemaining / 1000)}s
                    </div>
                  ) : (
                    <>
                      {finalWindowActive && (
                        <div className="mt-4 flex items-center gap-3 font-data text-[10px] uppercase tracking-[.12em] text-[hsl(var(--primary))]">
                          <Clock3 size={14} />
                          tempo restante: {Math.ceil(finalWindowRemaining / 1000)}s · tentativas: {finalGate.attempts} / {FINAL_ATTEMPT_LIMIT}
                        </div>
                      )}
                      <form onSubmit={submitFinalRiddle} className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <label htmlFor="final-answer" className="sr-only">Resposta da charada final</label>
                        <input
                          id="final-answer"
                          value={finalAnswer}
                          onChange={(e) => setFinalAnswer(e.target.value)}
                          placeholder="uma palavra"
                          className="min-h-12 flex-1 border border-[hsl(var(--foreground))]/25 bg-transparent px-4 font-data text-xs uppercase tracking-[.12em] outline-none focus:border-[hsl(var(--primary))]"
                          data-testid="input-final-answer"
                          autoFocus
                        />
                        <button type="submit" className="flex min-h-12 items-center justify-center gap-3 bg-[hsl(var(--primary))] px-6 font-data text-[10px] uppercase tracking-[.14em] text-[hsl(var(--primary-foreground))]" data-testid="button-submit-final">
                          selar leitura <ArrowUpRight size={14} />
                        </button>
                      </form>
                    </>
                  )}
                  {finalFeedback.message && (
                    <p className={`mt-4 border-l-2 px-3 py-2 font-data text-[10px] leading-5 ${finalFeedback.kind === 'success' ? 'border-[hsl(43_65%_51%)] text-[hsl(25_26%_20%)]' : 'border-[hsl(4_72%_51%)] text-[hsl(4_72%_42%)]'}`}>
                      {finalFeedback.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="paper-dark relative min-h-[320px] overflow-hidden p-7 sm:p-9">
              <div className="absolute right-8 top-8 h-24 w-24 opacity-30"><div className="occult-ring h-full w-full text-[hsl(43_65%_51%)]" /></div>
              <p className="eyebrow text-[hsl(43_65%_51%)]">registro de encerramento</p>
              <p className="mt-8 max-w-md font-display text-3xl leading-tight">A pasta termina quando ninguém mais consegue provar que esteve aqui.</p>
              <p className="mt-7 max-w-md text-sm leading-6 text-[hsl(var(--card))]/55">Os retratos continuam sem rosto. Os frames continuam esperando um ângulo. Se o convite aparecer, a segunda pasta não será uma continuação: será a parte que foi retirada da primeira.</p>
              <button onClick={() => jumpTo('quadro')} className="mt-7 flex items-center gap-3 font-data text-[10px] uppercase tracking-[.15em] text-[hsl(43_65%_51%)] hover:underline" data-testid="button-return-board">voltar ao quadro <ArrowUpRight size={14} /></button>
            </div>
          </div>
        </section>

        {confidentialOpen && codeReady && finalGate.solved && <section id="arquivo-confidencial" className="confidential-archive relative overflow-hidden border-b border-[hsl(4_72%_35%)]/50 px-6 py-24 text-[hsl(38_29%_87%)] sm:px-12 lg:px-[8vw] lg:py-36">
          <div className="confidential-occult-bg" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}occult-bg.svg)` }} aria-hidden="true" />
          <div className="confidential-fog" aria-hidden="true" />
          <div className="confidential-vignette" aria-hidden="true" />
          <img src={`${import.meta.env.BASE_URL}secret/sangue-removebg-preview.png`} alt="" className="blood-img blood-img-1" aria-hidden="true" />
          <img src={`${import.meta.env.BASE_URL}secret/sangue2-removebg-preview.png`} alt="" className="blood-img blood-img-2" aria-hidden="true" />
          <img src={`${import.meta.env.BASE_URL}secret/sangue3-removebg-preview.png`} alt="" className="blood-img blood-img-3" aria-hidden="true" />
          <img src={`${import.meta.env.BASE_URL}secret/sangue3-removebg-preview.png`} alt="" className="blood-img blood-img-4" aria-hidden="true" />
          <div className="confidential-scratch confidential-scratch-one" />
          <div className="confidential-scratch confidential-scratch-two" />
          <div className="confidential-cross confidential-cross-a" aria-hidden="true" />
          <div className="confidential-cross confidential-cross-b" aria-hidden="true" />
          <div className="confidential-warning" aria-hidden="true">contaminação · nível 04 · não reproduzir</div>
          <div className="relative z-10">
            <div className="reveal flex flex-col justify-between gap-8 border-b border-[hsl(4_72%_51%)]/25 pb-10 md:flex-row md:items-end">
              <div><p className="eyebrow text-[hsl(4_72%_51%)]">arquivo confidencial / acesso concedido</p><h2 className="mt-5 max-w-4xl font-display text-5xl leading-[.92] sm:text-7xl">A segunda pasta<br /><span className="text-[hsl(4_72%_51%)]">não quer ser lida.</span></h2><p className="mt-8 max-w-xl text-sm leading-7 text-[hsl(38_29%_87%)]/65">As perguntas abaixo não descrevem o fenômeno. Elas testam se a investigadora percebeu o que a primeira pasta apagou.</p></div>
              <div className="flex flex-col items-end gap-4">
                <div className="confidential-stamp">NÍVEL 04<br /><span>não reproduzir</span></div>
                <div className="gougou-frame border border-[hsl(4_72%_51%)]/40 bg-black/50 p-3 text-center shadow-lg">
                  <img src={`${import.meta.env.BASE_URL}secret/gougou.jpg`} alt="possível assassino" className="mx-auto h-auto w-full max-w-full object-contain" />
                  <p className="mt-2 font-data text-[9px] uppercase tracking-[.14em] text-[hsl(4_72%_51%)]">possível assassino</p>
                  <p className="mt-1 font-display text-lg leading-tight">Gourlate</p>
                  <p className="font-data text-[8px] uppercase tracking-[.12em] text-[hsl(38_29%_87%)]/60">vulgo · gougou</p>
                </div>
              </div>
            </div>
            <div className="mt-10 grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
              <div className="confidential-case-list grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {confidentialMysteries.map((item) => { const done = confidentialSolvedSet.has(item.id); const available = item.id === 1 || confidentialSolvedSet.has(item.id - 1); return <button key={item.id} onClick={() => { if (available) { setConfidentialActiveId(item.id); setConfidentialAnswer(''); setConfidentialFeedback({ kind: '', message: '' }); } }} disabled={!available} className={`confidential-case ${done ? 'confidential-case-done' : ''} ${item.id === confidentialActiveId ? 'confidential-case-active' : ''} ${!available ? 'confidential-case-locked' : ''}`} data-testid={`button-confidential-${item.id}`}><span>{item.code}</span><strong>{item.title}</strong><small>{done ? 'rasgo encerrado' : available ? 'abrir camada' : 'lacre intacto'}</small></button>; })}
              </div>
              <div className="confidential-question border border-[hsl(4_72%_51%)]/30 bg-black/35 p-6 sm:p-10">
                <div className="flex items-center justify-between border-b border-[hsl(38_29%_87%)]/15 pb-5 font-data text-[9px] uppercase tracking-[.16em] text-[hsl(38_29%_87%)]/55"><span>{confidentialCurrent.code} / consulta profunda</span><span>{confidentialSolved.length} / {confidentialMysteries.length}</span></div>
                <h3 className="mt-8 font-display text-4xl leading-tight">{confidentialCurrent.title}</h3>
                <div className="confidential-clue mt-8"><p className="eyebrow text-[hsl(4_72%_51%)]">margem recuperada</p><p className="mt-5 whitespace-pre-line font-data text-base leading-8 text-[hsl(38_29%_87%)]/80 sm:text-lg">{confidentialCurrent.clue}</p></div>
                {confidentialSolvedSet.has(confidentialCurrent.id) ? <div className="mt-8 border-l-2 border-[hsl(4_72%_51%)] px-4 py-3 font-data text-[10px] leading-5 text-[hsl(4_72%_51%)]">camada removida · a próxima pergunta está liberada</div> : <form onSubmit={submitConfidentialAnswer} className="mt-8 flex flex-col gap-3 sm:flex-row"><label htmlFor="confidential-answer" className="sr-only">Resposta do arquivo confidencial</label><input id="confidential-answer" value={confidentialAnswer} onChange={(event) => setConfidentialAnswer(event.target.value)} placeholder="registrar leitura sem acento" className="min-h-12 flex-1 border border-[hsl(38_29%_87%)]/25 bg-transparent px-4 font-data text-xs uppercase tracking-[.12em] outline-none placeholder:text-[hsl(38_29%_87%)]/25 focus:border-[hsl(4_72%_51%)]" data-testid="input-confidential-answer" /><button type="submit" className="flex min-h-12 items-center justify-center gap-3 bg-[hsl(4_72%_51%)] px-6 font-data text-[10px] uppercase tracking-[.14em] text-white transition-colors hover:bg-[hsl(38_29%_87%)] hover:text-[hsl(24_18%_10%)]" data-testid="button-submit-confidential">rasgar lacre <ArrowUpRight size={14} /></button></form>}
                {confidentialFeedback.message && <p className={`mt-5 border-l-2 px-3 py-2 font-data text-[10px] leading-5 ${confidentialFeedback.kind === 'success' ? 'border-[hsl(4_72%_51%)] text-[hsl(4_72%_51%)]' : 'border-[hsl(43_65%_51%)] text-[hsl(43_65%_51%)]'}`} data-testid="status-confidential-feedback">{confidentialFeedback.message}</p>}
                {confidentialComplete && <div className="mt-8 border border-[hsl(4_72%_51%)]/45 bg-[hsl(4_72%_51%)]/10 p-5 font-display text-2xl leading-tight">A segunda pasta foi lida. Agora ela conhece o nome de quem a abriu.</div>}
                <button onClick={resetInvestigation} className="mt-10 font-data text-[9px] uppercase tracking-[.14em] text-[hsl(38_29%_87%)]/45 hover:text-[hsl(4_72%_51%)]" data-testid="button-close-confidential">fechar e apagar todos os rastros</button>
              </div>
            </div>
          </div>
        </section>}
          <section className="border-b border-[hsl(var(--border))] px-6 py-20 sm:px-12 lg:px-[8vw] lg:py-28"><div className="reveal flex flex-col gap-7 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow text-[hsl(var(--primary))]">registro de encerramento</p><h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">Se você encontrou uma coisa, provavelmente deixou outra passar.</h2></div><BookOpen size={42} strokeWidth={1} className="text-[hsl(var(--primary))]" /></div><div className="reveal delay-1 mt-10 flex flex-col justify-between gap-6 border-t border-[hsl(var(--border))] pt-6 font-data text-[9px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))] sm:flex-row"><span>Arquivo Paranormal</span><span>fim do registro <ChevronDown size={14} className="ml-2 inline" /></span></div></section>
      </main>

      {/* botão da investigadora — acompanha o scroll */}
      <button
        type="button"
        className="investigator-fab"
        onClick={() => { setInvestigatorOpen(true); setInvestigatorFeedback(''); }}
        data-testid="button-investigator-gate"
        aria-label="identificação da investigadora"
      >
        {investigatorUnlocked ? '✓' : '?'}
      </button>

      {investigatorOpen && (
        <div className="investigator-panel-overlay" onClick={() => setInvestigatorOpen(false)}>
          <div className="investigator-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <p className="investigator-panel-title">você é a investigadora escolhida?</p>
            <p className="investigator-panel-hint">(digite seu nome do meio junto com o ano de nascimento)</p>
            <form onSubmit={(e) => { e.preventDefault(); submitInvestigator(e); }} className="investigator-form">
              <input
                value={investigatorInput}
                onChange={(e) => setInvestigatorInput(e.target.value)}
                className="investigator-input"
                placeholder="···"
                autoComplete="off"
                data-testid="input-investigator"
              />
              <button type="submit" className="investigator-submit" data-testid="button-investigator-submit">confirmar</button>
            </form>
            {investigatorFeedback && <p className="investigator-feedback">{investigatorFeedback}</p>}
            {investigatorUnlocked && <p className="investigator-feedback ok">acesso parcial liberado · aguarde o fim da pasta confidencial</p>}
          </div>
        </div>
      )}

      {giftUnlocked && (
        <section id="presente" className="birthday-section">
          <div className="birthday-map-bg" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}photos/map-bg.svg)` }} aria-hidden="true" />
          <div className="birthday-inner">
            <p className="eyebrow text-[hsl(43_65%_51%)]">registro extraordinário · só para você</p>
            <h2 className="birthday-title">um presente ficou esperando.</h2>
            {!giftOpened ? (
              <button type="button" className="gift-box" onClick={openGift} data-testid="button-open-gift" aria-label="abrir presente">
                <span className="gift-lid" />
                <span className="gift-body" />
                <span className="gift-bow" />
                <span className="gift-label">tocar para abrir</span>
              </button>
            ) : (
              <div className="gift-opened">
                <h2 className="birthday-celebration-title">FELIZ ANIVERSÁRIO</h2>
                <div className="birthday-feature-frame">
                  <img src={`${import.meta.env.BASE_URL}photos/birthday/angelita.jpeg`} alt="Angelita" className="birthday-feature-photo" />
                </div>
                <div className="birthday-text-slots">
                  <div className="birthday-slot">
                    <span className="slot-label">mensagem · 01</span>
                    <p>OIEEEEEEEEEEEE MEU AMOOOOOOOOOOOOOR, antes de tudo eu queria lhe desejar FELIZ ANIVERSÁAAAAAARIO, espero mt que vc aproveite seu dia especial, sorria bastante, não somente hj, mas sempre, seu sorriso é sempre tão belo, tão lindo, tão único, ele assim como você é inefável, não há palavras que existam para descrever. Eu te conheço a muito muito muito, e sempre vejo uma coisa nova em você que eu amo, pra algumas pessoas você pode ser apenas mais uma, mas para mim, você é tudo, minha melhor amiga do peito com quem sempre posso contar para tudo, e o mesmo para você, sempre que precisar de mim, pode contar comigo tabo? Espero que você nunca mais fique triste e só aproveite a vida, torço para que consiga suas coisinhas logo e se divirta muito. Chega até ser irónico, vc se chama angel e tem a beleza de um anjo, e de mesma forma, você me ajudou e me acolheu como um anjo, mesmo sem saber você me ajuda a ser feliz só de estar aqui comigo, eu te amo de tantas formas que você nem imagina, eu adoraria lhe pagar macadâmia mas eu num tenho dindin, perdon. Eu poderia ficar hrs lhe elogiando, mas hoje é um dia muito muito especial, devo agradecer principalmente a sua mãe e seu pai por ter botado você nesse mundaum, e muito obrigada por ser minha amiga, um dia ainda vamos sair por aí em role aleatórios por aí, fazer o que quer, lhe prometo levar vc pra sair, não sou uma cavalheira, mas lhe trato como a princesa que você é, e merece muito mais. Quando a gente morar juntas, algumas coisas precisam ser minhas ou suas, mas o resto será nosso, vai ser só alegria e felicidades, espero que seu dia seja incrível como você, coma bastante viu, precisa ter medo de ganhar uns quilinhos a mais não, voxeh é magrinha, e também ser feliz no seu dia não machuca ninguém. Novamente FELIIIIIIZ ANIVERSÁAAARIO MEU BEEEEEEEM, muitos anos de vida e felicidades, eu estarei aqui a cada momento, a cada vitória para comemorar com você, no caminho para te ajudar como conseguir e até nos momentos de derrota para lhe consolar, pode contar comigo para qualquer coisa, sempre vou lhe apoiar, te amo muito muito muito muito muito mesmo, com todas as letras. Seja feliz em seu dia hoje tá? Um cheiro da Lys, espero que tenha gostado do presente, rs. PARABÉEEEEEEEEEEEENS PRINCESAAAAAA DO MEU CORAÇÃO🫶🏾</p>
                  </div>
                </div>
                <div className="birthday-gallery mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {['Cellbit.png','clorinde.png','mualani.png','acheron.png','raidenmei.png','solene.png','lauma.png','nefer.png','doja.png','arlecchino.png','mavuika.png','sabrina.png','bina.png','ortega.png'].map((file) => (
                    <div key={file} className="birthday-gallery-frame"><img src={`${import.meta.env.BASE_URL}photos/birthday/${file}`} alt="" className="birthday-gallery-photo" loading="lazy" /></div>
                  ))}
                </div>
                <div className="birthday-video-frame">
                  <video controls playsInline preload="metadata" src={`${import.meta.env.BASE_URL}photos/birthday/videofinau.mp4`} aria-label="Vídeo de Agelica" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="border-t border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar))] px-6 py-10 text-[hsl(var(--sidebar-foreground))] lg:ml-[74px] lg:px-[8vw]"><div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><div className="flex items-center gap-3"><Fingerprint size={17} className="text-[hsl(var(--sidebar-primary))]"/><span className="font-data text-[10px] tracking-[.22em]">ARQUIVO PARANORMAL</span></div><p className="mt-4 max-w-sm text-xs leading-6 text-[hsl(var(--sidebar-foreground))]/45">Um arquivo onde o paranormal é normal, tudo se parece com um quebra-cabeça mas nem tudo é o que parece ser.</p></div><div className="font-data text-[9px] leading-6 tracking-[.12em] text-[hsl(var(--sidebar-foreground))]/45">STATUS: <span className="text-[hsl(43_65%_51%)]">{isComplete ? 'REGISTRO CONCLUÍDO' : 'SINAL PRESENTE'}</span><br />LOCAL: desconhecido / horário: 02:17</div></div></footer>

      {galleryIndex !== null && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="galeria de registros" onClick={() => setGalleryIndex(null)}>
          <button type="button" className="lightbox-close" onClick={() => setGalleryIndex(null)} aria-label="fechar">×</button>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); galleryPrev(); }} aria-label="anterior">‹</button>
          <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <img src={`${import.meta.env.BASE_URL}${PHOTO_GALLERY[galleryIndex].src}`} alt={PHOTO_GALLERY[galleryIndex].label} />
            <div className="lightbox-meta">
              <span>{PHOTO_GALLERY[galleryIndex].label}</span>
              <span>{galleryIndex + 1} / {PHOTO_GALLERY.length}</span>
            </div>
          </div>
          <button type="button" className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); galleryNext(); }} aria-label="próxima">›</button>
        </div>
      )}

    </div>
  );
}

export default App;