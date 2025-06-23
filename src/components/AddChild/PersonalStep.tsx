"use client"

import { View, Text, StyleSheet } from "react-native"
import { ElegantTextArea } from "./ElegantTextArea"
import { ChildData } from "../../../types"

interface PersonalStepProps {
  childData: ChildData
  setChildData: (data: ChildData) => void
}

export function PersonalStep({ childData, setChildData }: PersonalStepProps) {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>👤 Informações Pessoais</Text>

      <View style={styles.fieldsContainer}>
        <ElegantTextArea
          placeholder="Conte sobre a personalidade da criança..."
          value={childData.aboutMe}
          onChangeText={(text) => setChildData({ ...childData, aboutMe: text })}
          label="Sobre mim"
        />

        <ElegantTextArea
          placeholder="Quais são os interesses especiais?"
          value={childData.specialInterests.join(", ")}
          onChangeText={(text) =>
            setChildData({ ...childData, specialInterests: text.split(", ").filter((i) => i.trim()) })
          }
          label="Interesses especiais"
        />

        <ElegantTextArea
          placeholder="Descreva a rotina diária..."
          value={childData.routine}
          onChangeText={(text) => setChildData({ ...childData, routine: text })}
          label="Rotina"
        />

        <ElegantTextArea
          placeholder="Como a criança se comunica?"
          value={childData.communication}
          onChangeText={(text) => setChildData({ ...childData, communication: text })}
          label="Comunicação"
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
