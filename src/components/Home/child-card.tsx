"use client"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useNavigation } from "@react-navigation/native"
import type { Child } from "../types"

interface ChildCardProps {
  child: Child
  onSelect: () => void
}

export function ChildCard({ child, onSelect }: ChildCardProps) {
  const navigation = useNavigation()

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: "😊",
      excited: "🤩",
      calm: "😌",
      sad: "😢",
      angry: "😠",
      anxious: "😰",
      tired: "😴",
    }
    return moodEmojis[mood] || "😊"
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "#F44336",
      medium: "#FF9800",
      low: "#4CAF50",
    }
    return colors[priority] || "#4CAF50"
  }

  const navigateToChoice = () => {
    navigation.navigate("ChoiceScreen", { child })
  }

  const handleCardPress = () => {
    // Navega para ChoiceScreen em vez de abrir modal
    navigateToChoice()
  }

  const handleInfoPress = (e: any) => {
    // Para o evento de propagação para não navegar quando clicar no ícone de info
    e.stopPropagation()
    onSelect() // Abre o modal de informações
  }

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleCardPress} style={styles.container}>
      <LinearGradient
        colors={[child.lightColor, "#FFFFFF", "rgba(255,255,255,0.9)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.emoji}>{child.emoji}</Text>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(child.priority) }]} />
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.moodEmoji}>{getMoodEmoji(child.mood)}</Text>
            {child.hasTEA && (
              <View style={[styles.teaChip, { backgroundColor: child.color }]}>
                <MaterialCommunityIcons name="brain" size={12} color="#fff" />
                <Text style={styles.teaChipText}>TEA</Text>
              </View>
            )}
            {/* Botão de informações */}
            <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton} activeOpacity={0.7}>
              <Ionicons name="information-circle-outline" size={20} color={child.color} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar e Info */}
        <View style={styles.mainContent}>
          <View style={[styles.avatarContainer, { borderColor: child.color }]}>
            <Image source={{ uri: child.image }} style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.childInfo}>
            <Text style={[styles.childName, { color: child.color }]} numberOfLines={1}>
              {child.name}
            </Text>
            <View style={styles.nicknameRow}>
              <Ionicons name="heart" size={14} color={child.color} />
              <Text style={[styles.childNickname, { color: child.color }]}>"{child.nickname}"</Text>
            </View>
            <Text style={styles.childAge}>{child.age} anos</Text>
          </View>
        </View>

        {/* Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progresso hoje</Text>
            <Text style={[styles.progressValue, { color: child.color }]}>{child.progressToday}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBg, { backgroundColor: child.lightColor }]} />
            <View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: child.color,
                  width: `${child.progressToday}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.statText}>{child.activitiesCompleted}</Text>
            <Text style={styles.statLabel}>atividades</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="heart" size={16} color="#E91E63" />
            <Text style={styles.statText} numberOfLines={1}>
              {child.favoriteActivity}
            </Text>
            <Text style={styles.statLabel}>favorita</Text>
          </View>
        </View>

        {/* Botão de Ação */}
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: child.color }]} activeOpacity={0.8}>
          <Text style={styles.actionText}>Ver atividades</Text>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  gradient: {
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  teaChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  teaChipText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  avatarContainer: {
    position: "relative",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  childNickname: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 4,
  },
  childAge: {
    fontSize: 15,
    color: "#666",
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },
  progressValue: {
    fontSize: 15,
    fontWeight: "bold",
  },
  progressBarContainer: {
    position: "relative",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
    marginRight: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#ddd",
    marginHorizontal: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
  },
})
