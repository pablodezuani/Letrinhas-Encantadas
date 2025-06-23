"use client"

import { View, Text, StyleSheet } from "react-native"
import { ChildData } from "../../../types"
import { ElegantTextArea } from "./ElegantTextArea"

interface BehaviorStepProps {
  childData: ChildData
  setChildData: (data: ChildData) => void
}

export function BehaviorStep({ childData, setChildData }: BehaviorStepProps) {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>😊 Comportamento</Text>

      <View style={styles.fieldsContainer}>
        <ElegantTextArea
          placeholder="O que a criança mais gosta?"
          value={childData.likes.join(", ")}
          onChangeText={(text) => setChildData({ ...childData, likes: text.split(", ").filter((i) => i.trim()) })}
          label="O que gosta"
        />

        <ElegantTextArea
          placeholder="O que a criança não gosta?"
          value={childData.dislikes.join(", ")}
          onChangeText={(text) => setChildData({ ...childData, dislikes: text.split(", ").filter((i) => i.trim()) })}
          label="O que não gosta"
        />

        <ElegantTextArea
          placeholder="Principais habilidades..."
          value={childData.skills.join(", ")}
          onChangeText={(text) => setChildData({ ...childData, skills: text.split(", ").filter((i) => i.trim()) })}
          label="Habilidades"
        />

        <ElegantTextArea
          placeholder="Necessidades sensoriais..."
          value={childData.sensoryNeeds}
          onChangeText={(text) => setChildData({ ...childData, sensoryNeeds: text })}
          label="Necessidades sensoriais"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldsContainer: {
    width: "100%",
    gap: 16,
  },
})
