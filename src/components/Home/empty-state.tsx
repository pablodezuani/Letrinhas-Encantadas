"use client"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface EmptyStateProps {
  searchQuery: string
  onAddChild: () => void
}

export function EmptyState({ searchQuery, onAddChild }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#E3F2FD", "#BBDEFB"]} style={styles.iconContainer}>
        <Ionicons name="people" size={64} color="#2196F3" />
      </LinearGradient>

      <Text style={styles.title}>{searchQuery ? "Nenhuma criança encontrada" : "Nenhuma criança cadastrada"}</Text>

      <Text style={styles.subtitle}>
        {searchQuery
          ? "Tente buscar por outro nome ou apelido"
          : "Adicione sua primeira criança para começar a acompanhar o desenvolvimento"}
      </Text>

      {!searchQuery && (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onAddChild}>
          <LinearGradient colors={["#6C63FF", "#4834D4"]} style={styles.buttonGradient}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.buttonText}>Adicionar criança</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})
