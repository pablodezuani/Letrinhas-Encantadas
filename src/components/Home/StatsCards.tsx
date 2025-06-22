"use client"
import { View, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

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
    { icon: "account-group", value: stats.total, label: "Crianças" },
    { icon: "brain", value: stats.withTEA, label: "Com TEA" },
    { icon: "chart-line", value: `${stats.averageProgress}%`, label: "Progresso" },
    { icon: "trophy", value: stats.totalActivities, label: "Atividades" },
  ]

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <View key={index} style={styles.card}>
          <MaterialCommunityIcons name={card.icon as any} size={24} color="#fff" />
          <Text style={styles.number}>{card.value}</Text>
          <Text style={styles.label}>{card.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  number: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    textAlign: "center",
  },
})
