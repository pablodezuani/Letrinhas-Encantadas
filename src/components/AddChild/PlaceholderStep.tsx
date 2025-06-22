"use client"

import { View, Text, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

interface PlaceholderStepProps {
  stepData: any
}

export function PlaceholderStep({ stepData }: PlaceholderStepProps) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{stepData?.title}</Text>
      <Text style={styles.stepDescription}>{stepData?.description}</Text>

      <View style={styles.comingSoonContainer}>
        <MaterialCommunityIcons name="construction" size={64} color="rgba(255,255,255,0.6)" />
        <Text style={styles.comingSoonText}>Em desenvolvimento...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stepContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 30,
  },
  comingSoonContainer: {
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    marginTop: 15,
  },
})
