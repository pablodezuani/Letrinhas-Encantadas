"use client"

import { useState } from "react"
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Child } from "../../lib/types"
import { InfoCard } from "./info-card"


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

interface ChildModalProps {
  child: Child
  visible: boolean
  onClose: () => void
}

export function ChildModal({ child, visible, onClose }: ChildModalProps) {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { id: "overview", title: "Visão Geral", icon: "home", color: "#4CAF50" },
    { id: "personal", title: "Pessoal", icon: "person", color: "#2196F3" },
    { id: "behavior", title: "Comportamento", icon: "happy", color: "#FF9800" },
    { id: "help", title: "Ajuda", icon: "hand-left", color: "#9C27B0" },
    { id: "medical", title: "Saúde", icon: "medkit", color: "#F44336" },
  ]

  const getModalSections = (child: Child) => ({
    overview: [
      {
        id: "summary",
        title: "Resumo Geral",
        content: `${child.name} (${child.nickname}) tem ${child.age} anos e ${child.hasTEA ? `possui diagnóstico de TEA nível ${child.teaLevel}` : "não possui diagnóstico de TEA"}. Hoje completou ${child.activitiesCompleted} atividades com ${child.progressToday}% de progresso.`,
        icon: "information-circle",
        color: "#4CAF50",
      },
      {
        id: "progress",
        title: "Progresso de Hoje",
        content: `Completou ${child.activitiesCompleted} atividades hoje com uma taxa de sucesso de ${child.progressToday}%. O desempenho está ${child.progressToday >= 80 ? "excelente" : child.progressToday >= 60 ? "bom" : "em desenvolvimento"}.`,
        icon: "checkmark-circle",
        color: "#2196F3",
      },
    ],
    personal: [
      { id: "about", title: "Sobre mim", content: child.aboutMe, icon: "happy", color: "#4CAF50" },
      { id: "interests", title: "Interesses especiais", content: child.interests, icon: "star", color: "#9C27B0" },
      { id: "routine", title: "Minha rotina", content: child.routine, icon: "time", color: "#FF9800" },
    ],
    behavior: [
      { id: "likes", title: "O que eu gosto", content: child.likes, icon: "heart", color: "#E91E63" },
      { id: "dislikes", title: "O que não gosto", content: child.dislikes, icon: "close-circle", color: "#F44336" },
      { id: "skills", title: "Minhas habilidades", content: child.skills, icon: "ribbon", color: "#673AB7" },
    ],
    help: [
      { id: "howToHelp", title: "Como me ajudar", content: child.howToHelp, icon: "hand-left", color: "#2196F3" },
      {
        id: "frustrated",
        title: "Quando frustrado(a)",
        content: child.whenFrustrated,
        icon: "sad",
        color: "#795548",
      },
      {
        id: "attention",
        title: "Quando preciso de atenção",
        content: child.whenNeedAttention,
        icon: "notifications",
        color: "#607D8B",
      },
    ],
    medical: [
      {
        id: "medicalInfo",
        title: "Informações médicas",
        content: child.medicalInfo,
        icon: "medkit",
        color: "#F44336",
      },
      {
        id: "teaInfo",
        title: "Informações sobre TEA",
        content: child.hasTEA
          ? `Diagnóstico de TEA nível ${child.teaLevel}. Necessita de suporte ${child.teaLevel === 1 ? "leve" : child.teaLevel === 2 ? "moderado" : "substancial"}.`
          : "Sem diagnóstico de TEA.",
        icon: "brain",
        color: "#9C27B0",
      },
    ],
  })

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <BlurView intensity={60} style={styles.blurContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <LinearGradient colors={[child.color, `${child.color}CC`]} style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <View style={styles.closeButtonCircle}>
                  <Ionicons name="close" size={24} color="#fff" />
                </View>
              </TouchableOpacity>

              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: child.image }} style={styles.avatar} />
                  {child.hasTEA && (
                    <View style={styles.teaBadge}>
                      <MaterialCommunityIcons name="brain" size={16} color="#fff" />
                      <Text style={styles.teaBadgeText}>TEA {child.teaLevel}</Text>
                    </View>
                  )}
                  <View style={styles.onlineIndicator} />
                </View>

                <View style={styles.titleSection}>
                  <Text style={styles.title}>{child.name}</Text>
                  <Text style={styles.subtitle}>
                    "{child.nickname}" • {child.age} anos
                  </Text>
                </View>
              </View>

              {/* Progresso */}
              <View style={styles.progressSection}>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{child.progressToday}%</Text>
                    <Text style={styles.statLabel}>Progresso hoje</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{child.activitiesCompleted}</Text>
                    <Text style={styles.statLabel}>Atividades</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${child.progressToday}%` }]} />
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
                {tabs.map((tab, index) => (
                  <TouchableOpacity
                    key={tab.id}
                    style={[styles.tab, activeTab === index && [styles.activeTab, { backgroundColor: tab.color }]]}
                    onPress={() => setActiveTab(index)}
                  >
                    <Ionicons name={tab.icon as any} size={20} color={activeTab === index ? "#fff" : "#666"} />
                    <Text style={[styles.tabText, { color: activeTab === index ? "#fff" : "#666" }]}>{tab.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Conteúdo */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {getModalSections(child)[
                Object.keys(getModalSections(child))[activeTab] as keyof ReturnType<typeof getModalSections>
              ]?.map((section) => (
                <InfoCard
                  key={section.id}
                  title={section.title}
                  content={section.content}
                  icon={section.icon}
                  color={section.color}
                />
              ))}
            </ScrollView>
          </View>
        </BlurView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT * 0.95,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    elevation: 24,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -10 },
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginRight: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  teaBadge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  teaBadgeText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  onlineIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
    fontWeight: "500",
  },
  progressSection: {
    marginTop: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 12,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 6,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tabsContainer: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 24,
    minWidth: 130,
  },
  activeTab: {
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
})
