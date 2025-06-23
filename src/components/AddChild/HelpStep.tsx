"use client"

import { View, Text, StyleSheet } from "react-native"
import { ElegantTextArea } from "./ElegantTextArea"
import { ChildData } from "../../../types"


interface HelpStepProps {
  childData: ChildData
  setChildData: (data: ChildData) => void
}

export function HelpStep({ childData, setChildData }: HelpStepProps) {
  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>🤝 Como Ajudar</Text>

      <View style={styles.fieldsContainer}>
        <ElegantTextArea
          placeholder="Como posso ajudar no dia a dia?"
          value={childData.howToHelp}
          onChangeText={(text) => setChildData({ ...childData, howToHelp: text })}
          label="Como ajudar"
        />

        <ElegantTextArea
          placeholder="O que fazer quando frustrada?"
          value={childData.whenFrustrated}
          onChangeText={(text) => setChildData({ ...childData, whenFrustrated: text })}
          label="Quando frustrada"
        />

        <ElegantTextArea
          placeholder="Como demonstra que precisa de atenção?"
          value={childData.whenNeedsAttention}
          onChangeText={(text) => setChildData({ ...childData, whenNeedsAttention: text })}
          label="Precisa de atenção"
        />

        <ElegantTextArea
          placeholder="Principais dificuldades..."
          value={childData.difficulties.join(", ")}
          onChangeText={(text) =>
            setChildData({ ...childData, difficulties: text.split(", ").filter((i) => i.trim()) })
          }
          label="Dificuldades"
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
