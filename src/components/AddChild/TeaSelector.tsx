"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { PREMIUM_GRADIENTS } from "../../constants"


interface TeaSelectorProps {
  hasAutism: string
  autismLevel: string
  onSelectAutism: (hasAutism: string) => void
  onSelectLevel: (level: string) => void
}

export function TeaSelector({ hasAutism, autismLevel, onSelectAutism, onSelectLevel }: TeaSelectorProps) {
  const levels = [
    { key: "1", label: "Nível 1", desc: "Apoio", color: "#11998e", gradient: PREMIUM_GRADIENTS.success },
    { key: "2", label: "Nível 2", desc: "Apoio substancial", color: "#f7b733", gradient: PREMIUM_GRADIENTS.warning },
    {
      key: "3",
      label: "Nível 3",
      desc: "Apoio muito substancial",
      color: "#f5576c",
      gradient: PREMIUM_GRADIENTS.secondary,
    },
  ]

  return (
    <View style={styles.teaSection}>
      <Text style={styles.sectionTitle}>Diagnóstico TEA</Text>

      <View style={styles.teaOptions}>
        <TouchableOpacity
          style={[styles.teaOption, hasAutism === "yes" && styles.teaOptionActive]}
          onPress={() => onSelectAutism("yes")}
        >
          <LinearGradient
            colors={
              hasAutism === "yes" ? PREMIUM_GRADIENTS.success : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
            }
            style={styles.teaOptionGradient}
          >
            <View style={styles.teaOptionContent}>
              <View style={styles.teaIconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={hasAutism === "yes" ? "#fff" : "rgba(255,255,255,0.6)"}
                />
              </View>
              <Text style={[styles.teaOptionText, hasAutism === "yes" && styles.teaOptionTextActive]}>
                Sim, possui TEA
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.teaOption, hasAutism === "no" && styles.teaOptionActive]}
          onPress={() => {
            onSelectAutism("no")
            onSelectLevel("")
          }}
        >
          <LinearGradient
            colors={
              hasAutism === "no" ? PREMIUM_GRADIENTS.warning : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
            }
            style={styles.teaOptionGradient}
          >
            <View style={styles.teaOptionContent}>
              <View style={styles.teaIconContainer}>
                <Ionicons name="close-circle" size={22} color={hasAutism === "no" ? "#fff" : "rgba(255,255,255,0.6)"} />
              </View>
              <Text style={[styles.teaOptionText, hasAutism === "no" && styles.teaOptionTextActive]}>
                Não possui TEA
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {hasAutism === "yes" && (
        <View style={styles.levelSection}>
          <Text style={styles.levelTitle}>Nível de Suporte</Text>

          <View style={styles.levelOptions}>
            {levels.map((level) => (
              <TouchableOpacity key={level.key} style={[styles.levelOption]} onPress={() => onSelectLevel(level.key)}>
                <LinearGradient
                  colors={
                    autismLevel === level.key ? level.gradient : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
                  }
                  style={styles.levelOptionGradient}
                >
                  <View
                    style={[
                      styles.levelIndicator,
                      { backgroundColor: autismLevel === level.key ? level.color : "rgba(255,255,255,0.3)" },
                    ]}
                  />
                  <Text style={[styles.levelText, autismLevel === level.key && styles.levelTextActive]}>
                    {level.label}
                  </Text>
                  <Text style={[styles.levelDesc, autismLevel === level.key && styles.levelDescActive]}>
                    {level.desc}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  teaSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  teaOptions: {
    gap: 10,
    marginBottom: 16,
  },
  teaOption: {
    borderRadius: 12,
    overflow: "hidden",
  },
  teaOptionGradient: {
    borderRadius: 12,
    padding: 1,
  },
  teaOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 11,
    padding: 12,
  },
  teaIconContainer: {
    marginRight: 12,
  },
  teaOptionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontWeight: "500",
  },
  teaOptionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  levelSection: {
    marginTop: 5,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  levelOptions: {
    flexDirection: "row",
    gap: 8,
  },
  levelOption: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  levelOptionGradient: {
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  levelIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  levelText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  levelTextActive: {
    color: "#fff",
  },
  levelDesc: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    textAlign: "center",
  },
  levelDescActive: {
    color: "rgba(255,255,255,0.8)",
  },
})
