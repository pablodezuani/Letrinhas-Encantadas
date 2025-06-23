"use client"

import { View, Text, StyleSheet } from "react-native"
import { ElegantTextArea } from "./ElegantTextArea"
import { ChildData } from "../../../types"


interface HealthStepProps {
  childData: ChildData
  setChildData: (data: ChildData) => void
}

export function HealthStep({ childData, setChildData }: HealthStepProps) {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>🏥 Saúde</Text>

      <View style={styles.fieldsContainer}>
        <ElegantTextArea
          placeholder="Informações médicas relevantes..."
          value={childData.medicalInfo}
          onChangeText={(text) => setChildData({ ...childData, medicalInfo: text })}
          label="Informações médicas"
        />

        <ElegantTextArea
          placeholder="Detalhes sobre o TEA..."
          value={childData.autismInfo}
          onChangeText={(text) => setChildData({ ...childData, autismInfo: text })}
          label="Informações TEA"
        />

        <ElegantTextArea
          placeholder="Medicamentos em uso..."
          value={childData.medications.join(", ")}
          onChangeText={(text) => setChildData({ ...childData, medications: text.split(", ").filter((i) => i.trim()) })}
          label="Medicamentos"
        />

        <ElegantTextArea
          placeholder="Alergias ou restrições..."
          value={childData.allergies.join(", ")}
          onChangeText={(text) => setChildData({ ...childData, allergies: text.split(", ").filter((i) => i.trim()) })}
          label="Alergias"
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
