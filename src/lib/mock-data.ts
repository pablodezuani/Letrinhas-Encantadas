import type { User, Child } from "./types"

export const mockUser: User = {
  name: "Amanda Dezuani",
  email: "amanda@exemplo.com",
  avatar: "/placeholder.svg?height=80&width=80",
  joinDate: "2023-01-15",
  totalChildren: 3,
  completedActivities: 127,
}

export const mockChildren: Child[] = [
  {
    id: "1",
    name: "Maria Eduarda Dezuani",
    nickname: "Mari",
    age: 7,
    image: "/placeholder.svg?height=80&width=80",
    gender: "female",
    difficulties:
      "Apresenta dificuldade de concentração em tarefas que exigem atenção prolongada. Sensibilidade a barulhos altos e ambientes muito estimulantes.",
    hasTEA: true,
    teaLevel: 2,
    likes:
      "Adora pintar e desenhar, especialmente com lápis coloridos. Gosta muito de brincar com bonecas e criar histórias para elas.",
    aboutMe: "Sou uma menina alegre e curiosa. Adoro aprender coisas novas, especialmente sobre animais e natureza.",
    dislikes:
      "Não gosto de barulhos altos como fogos de artifício ou balões estourando. Fico incomodada com etiquetas de roupas.",
    skills:
      "Tenho uma memória visual excepcional e consigo lembrar de detalhes com precisão. Sou muito criativa em atividades artísticas.",
    howToHelp:
      "Me ajuda quando você dá instruções claras e diretas, uma de cada vez. Preciso de pausas frequentes durante atividades longas.",
    whenFrustrated:
      "Quando estou frustrada, costumo chorar e me isolar em um canto. Posso cobrir os ouvidos se estiver sobrecarregada sensorialmente.",
    whenNeedAttention:
      "Quando preciso de atenção, geralmente faço contato visual e chamo pelo nome. Posso pegar na mão e levar até o que quero mostrar.",
    color: "#E91E63",
    lightColor: "#FCE4EC",
    routine: "Preciso de uma rotina estruturada com horários regulares para refeições, estudo e sono.",
    communication:
      "Me comunico principalmente através da fala, mas às vezes tenho dificuldade em expressar emoções complexas.",
    sensoryNeeds: "Sou sensível a sons altos e luzes muito brilhantes. Gosto de abraços firmes e cobertores pesados.",
    interests:
      "Tenho interesse especial por animais, especialmente gatos. Gosto muito de livros com ilustrações detalhadas.",
    medicalInfo: "Tomo medicação para ajudar na concentração pela manhã. Faço terapia ocupacional semanalmente.",
    lastUpdate: new Date().toISOString(),
    priority: "high",
    emoji: "🎨",
    progressToday: 85,
    activitiesCompleted: 12,
    mood: "happy",
    favoriteActivity: "Desenhar",
    nextAppointment: "2024-01-20T10:00:00Z",
    weeklyProgress: [65, 78, 82, 90, 85, 88, 85],
    achievements: [
      { id: 1, title: "Primeira palavra", date: "2024-01-15", icon: "chatbubble", color: "#4CAF50" },
      { id: 2, title: "Desenho completo", date: "2024-01-18", icon: "brush", color: "#9C27B0" },
    ],
    recentActivities: [
      { id: 1, name: "Jogo das Vogais", completed: true, score: 95, time: "10 min" },
      { id: 2, name: "Formação de Palavras", completed: true, score: 88, time: "15 min" },
    ],
    therapies: [{ type: "Fonoaudiologia", frequency: "2x/semana", nextSession: "2024-01-22T09:00:00Z" }],
    emergencyContacts: [{ name: "Mãe - Ana", phone: "(11) 99999-9999", relation: "Mãe" }],
  },
  {
    id: "2",
    name: "Lucas Gabriel Dezuani",
    nickname: "Lu",
    age: 8,
    image: "/placeholder.svg?height=80&width=80",
    gender: "male",
    difficulties: "Apresenta ansiedade em ambientes muito movimentados ou barulhentos.",
    hasTEA: false,
    teaLevel: 0,
    likes: "Adora jogar futebol e qualquer atividade física ao ar livre. É fascinado por videogames.",
    aboutMe: "Sou um menino muito ativo e cheio de energia. Adoro desafios e competições amigáveis.",
    dislikes: "Não gosto de ficar parado por muito tempo fazendo a mesma atividade.",
    skills: "Tenho excelente coordenação motora e habilidades esportivas.",
    howToHelp: "Me ajuda quando você estabelece rotinas claras e me explica o que vai acontecer durante o dia.",
    whenFrustrated: "Quando estou frustrado, posso ficar agitado, falar alto ou até mesmo gritar.",
    whenNeedAttention: "Quando preciso de atenção, geralmente me aproximo e falo diretamente o que quero.",
    color: "#2196F3",
    lightColor: "#E3F2FD",
    routine: "Funciono melhor com uma rotina que inclui bastante atividade física.",
    communication: "Me comunico bem verbalmente e sou bastante expressivo.",
    sensoryNeeds: "Busco constantemente movimento e estimulação sensorial.",
    interests: "Sou apaixonado por esportes, especialmente futebol. Adoro jogos eletrônicos de aventura.",
    medicalInfo: "Tenho asma leve que pode ser desencadeada por exercícios muito intensos em dias frios.",
    lastUpdate: new Date(Date.now() - 86400000).toISOString(),
    priority: "medium",
    emoji: "⚽",
    progressToday: 92,
    activitiesCompleted: 8,
    mood: "excited",
    favoriteActivity: "Futebol",
    nextAppointment: "2024-01-22T14:30:00Z",
    weeklyProgress: [88, 92, 85, 90, 95, 89, 92],
    achievements: [{ id: 1, title: "Gol da vitória", date: "2024-01-16", icon: "football", color: "#4CAF50" }],
    recentActivities: [{ id: 1, name: "Jogo de Matemática", completed: true, score: 92, time: "12 min" }],
    therapies: [{ type: "Psicologia", frequency: "1x/semana", nextSession: "2024-01-23T16:00:00Z" }],
    emergencyContacts: [{ name: "Mãe - Carla", phone: "(11) 77777-7777", relation: "Mãe" }],
  },
  {
    id: "3",
    name: "Ana Clara Dezuani",
    nickname: "Aninha",
    age: 6,
    image: "/placeholder.svg?height=80&width=80",
    gender: "female",
    difficulties: "Apresenta timidez extrema, especialmente em situações sociais novas.",
    hasTEA: true,
    teaLevel: 1,
    likes: "Adora desenhar e colorir em seu caderno especial. Gosta de brincar sozinha com seus brinquedos.",
    aboutMe: "Sou uma menina calma e observadora. Percebo detalhes que muitas pessoas não notam.",
    dislikes: "Não gosto de multidões ou lugares barulhentos como festas grandes.",
    skills: "Tenho grande atenção aos detalhes visuais. Sou muito paciente com tarefas que exigem concentração.",
    howToHelp: "Me ajuda quando você é gentil e paciente, dando-me tempo para responder.",
    whenFrustrated: "Quando estou frustrada, geralmente fico quieta e posso me esconder.",
    whenNeedAttention: "Quando preciso de atenção, geralmente puxo suavemente a roupa da pessoa.",
    color: "#9C27B0",
    lightColor: "#F3E5F5",
    routine: "Preciso de uma rotina previsível e tranquila. Mudanças súbitas podem me deixar ansiosa.",
    communication: "Me comunico melhor em ambientes calmos e com uma pessoa de cada vez.",
    sensoryNeeds: "Sou sensível a barulhos altos e ambientes caóticos. Prefiro luz suave.",
    interests: "Tenho interesse especial por desenho e pintura. Gosto de livros com ilustrações detalhadas.",
    medicalInfo: "Faço terapia fonoaudiológica semanalmente para desenvolver habilidades de comunicação.",
    lastUpdate: new Date(Date.now() - 172800000).toISOString(),
    priority: "low",
    emoji: "📚",
    progressToday: 67,
    activitiesCompleted: 5,
    mood: "calm",
    favoriteActivity: "Leitura",
    nextAppointment: "2024-01-25T09:00:00Z",
    weeklyProgress: [60, 65, 70, 68, 72, 69, 67],
    achievements: [{ id: 1, title: "Primeira apresentação", date: "2024-01-14", icon: "mic", color: "#9C27B0" }],
    recentActivities: [{ id: 1, name: "Pintura Livre", completed: true, score: 78, time: "25 min" }],
    therapies: [{ type: "Fonoaudiologia", frequency: "2x/semana", nextSession: "2024-01-21T10:00:00Z" }],
    emergencyContacts: [{ name: "Mãe - Lucia", phone: "(11) 55555-5555", relation: "Mãe" }],
  },
]
