export interface User {
  name: string
  email: string
  avatar: string
  joinDate: string
  totalChildren: number
  completedActivities: number
}

export interface Child {
  id: string
  name: string
  nickname: string
  age: number
  image: string
  gender: "male" | "female"
  difficulties: string
  hasTEA: boolean
  teaLevel: number
  likes: string
  aboutMe: string
  dislikes: string
  skills: string
  howToHelp: string
  whenFrustrated: string
  whenNeedAttention: string
  color: string
  lightColor: string
  routine: string
  communication: string
  sensoryNeeds: string
  interests: string
  medicalInfo: string
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

export interface UserProfile {
  name: string
  email: string
  joinDate: string
}
