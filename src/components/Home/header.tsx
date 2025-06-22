"use client"
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { StatsCards } from "./StatsCards"
import { Child, User } from "../../lib/types"

interface HeaderProps {
  user: User
  children: Child[]
  searchQuery: string
  showSearchBar: boolean
  onSearchChange: (query: string) => void
  onToggleSearch: () => void
  onOpenProfile: () => void
}

export function Header({
  user,
  children,
  searchQuery,
  showSearchBar,
  onSearchChange,
  onToggleSearch,
  onOpenProfile,
}: HeaderProps) {
  const stats = {
    total: children.length,
    withTEA: children.filter((child) => child.hasTEA).length,
    averageProgress: Math.round(children.reduce((sum, child) => sum + child.progressToday, 0) / children.length),
    totalActivities: children.reduce((sum, child) => sum + child.activitiesCompleted, 0),
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["rgba(108, 99, 255, 0.95)", "rgba(72, 52, 212, 0.9)"]} style={styles.gradient}>
        {/* Header Principal */}
        <View style={styles.mainHeader}>
          <TouchableOpacity onPress={onOpenProfile} style={styles.profileSection}>
            <LinearGradient colors={["#FF6B9D", "#E91E63"]} style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>{user.name.charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Olá,</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userSubtitle}>
                {user.totalChildren} crianças • {user.completedActivities} atividades
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onToggleSearch} style={styles.actionButton}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="notifications" size={24} color="#fff" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de Busca */}
        {showSearchBar && (
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar criança..."
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearchChange("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Estatísticas */}
        <StatsCards stats={stats} />
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  profileInitial: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  userSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF5252",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  clearButton: {
    padding: 8,
  },
})
