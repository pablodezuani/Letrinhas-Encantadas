import { Users, Brain, TrendingUp, Trophy } from "lucide-react"

interface StatsCardsProps {
  stats: {
    total: number
    withTEA: number
    averageProgress: number
    totalActivities: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      icon: Users,
      value: stats.total,
      label: "Crianças",
    },
    {
      icon: Brain,
      value: stats.withTEA,
      label: "Com TEA",
    },
    {
      icon: TrendingUp,
      value: `${stats.averageProgress}%`,
      label: "Progresso",
    },
    {
      icon: Trophy,
      value: stats.totalActivities,
      label: "Atividades",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-center">
          <card.icon className="h-6 w-6 mx-auto mb-2" />
          <p className="text-xl font-bold">{card.value}</p>
          <p className="text-sm opacity-80">{card.label}</p>
        </div>
      ))}
    </div>
  )
}
