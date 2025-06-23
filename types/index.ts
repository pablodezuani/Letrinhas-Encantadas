export interface User {
  name: string
  email: string
  avatar: string
  joinDate: string
  totalChildren: number
  completedActivities: number
}

export interface ChildData {
  // Informações Básicas
  name: string
  nickname: string
  age: string
  gender: string
  photo: string | null
  hasAutism: string
  autismLevel: string

  // Categoria Pessoal
  aboutMe: string
  specialInterests: string[]
  routine: string
  communication: string

  // Categoria Comportamento
  likes: string[]
  dislikes: string[]
  skills: string[]
  sensoryNeeds: string

  // Categoria Ajuda
  howToHelp: string
  whenFrustrated: string
  whenNeedsAttention: string
  difficulties: string[]

  // Categoria Saúde
  medicalInfo: string
  autismInfo: string
  medications: string[]
  allergies: string[]
}

export interface Child {
  id: string
  name: string
  nickname: string
  age: number
  image: string
  gender: "male" | "female"
  difficulties: string[]
  hasTEA: boolean
  teaLevel: number
  likes: string[]
  aboutMe: string
  dislikes: string[]
  skills: string[]
  howToHelp: string
  whenFrustrated: string
  whenNeedAttention: string
  color: string
  lightColor: string
  routine: string
  communication: string
  sensoryNeeds: string
  interests: string[]
  medicalInfo: string
  autismInfo: string
  medications: string[]
  allergies: string[]
  lastUpdate: string
  priority: "high" | "medium" | "low"
  emoji: string
  progressToday: number
  activitiesCompleted: number
  mood: string
  favoriteActivity: string
  nextAppointment: string
  weeklyProgress: number[]
  achievements: Array<{
    id: number
    title: string
    date: string
    icon: string
    color: string
  }>
  recentActivities: Array<{
    id: number
    name: string
    completed: boolean
    score: number
    time: string
  }>
  therapies: Array<{
    type: string
    frequency: string
    nextSession: string
  }>
  emergencyContacts: Array<{
    name: string
    phone: string
    relation: string
  }>
}
