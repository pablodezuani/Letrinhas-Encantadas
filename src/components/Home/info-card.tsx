"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface InfoCardProps {
  title: string
  content: string
  icon: string
  color: string
}

export function InfoCard({ title, content, icon, color }: InfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => setIsExpanded(!isExpanded)} style={styles.touchable}>
        <LinearGradient colors={[`${color}18`, `${color}08`, "#FFFFFF"]} style={styles.gradient}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LinearGradient colors={[color, `${color}CC`]} style={styles.iconContainer}>
                <Ionicons name={icon as any} size={22} color="#fff" />
              </LinearGradient>
              <View style={styles.titleContainer}>
                <Text style={[styles.title, { color }]}>{title}</Text>
                <Text style={styles.subtitle}>Toque para expandir</Text>
              </View>
            </View>

            <View style={styles.chevronContainer}>
              <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={22} color={color} />
            </View>
          </View>

          {isExpanded && (
            <View style={styles.content}>
              <View style={[styles.divider, { backgroundColor: color }]} />
              <View style={styles.contentWrapper}>
                <Text style={styles.contentText}>{content}</Text>
              </View>
              <View style={styles.footer}>
                <View style={styles.footerLeft}>
                  <View style={[styles.footerIconContainer, { backgroundColor: `${color}15` }]}>
                    <Ionicons name="checkmark-circle" size={18} color={color} />
                  </View>
                  <View style={styles.footerTextContainer}>
                    <Text style={[styles.footerText, { color }]}>Informação verificada</Text>
                    <Text style={styles.footerSubtext}>Atualizado hoje</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  touchable: {
    borderRadius: 24,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: 24,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  chevronContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  divider: {
    height: 4,
    width: 80,
    borderRadius: 2,
    marginBottom: 20,
  },
  contentWrapper: {
    backgroundColor: "rgba(248,249,250,0.8)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  contentText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
    fontWeight: "400",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  footerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  footerTextContainer: {
    flex: 1,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
})
