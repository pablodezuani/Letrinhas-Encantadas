"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface GenderSelectorProps {
  value: string
  onSelect: (gender: string) => void
}

export function GenderSelector({ value, onSelect }: GenderSelectorProps) {
  return (
    <>
      <Text style={styles.labelText}>Gênero</Text>
      <View style={styles.genderSelector}>
        <TouchableOpacity
          style={[
            styles.genderOption,
            value === "male" && styles.genderOptionSelected,
            { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
          ]}
          onPress={() => onSelect("male")}
        >
          <Ionicons name="male" size={16} color={value === "male" ? "#fff" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.genderText, value === "male" && styles.genderTextSelected]}>Menino</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderOption,
            value === "female" && styles.genderOptionSelected,
            { borderTopRightRadius: 10, borderBottomRightRadius: 10 },
          ]}
          onPress={() => onSelect("female")}
        >
          <Ionicons name="female" size={16} color={value === "female" ? "#fff" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.genderText, value === "female" && styles.genderTextSelected]}>Menina</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
    marginLeft: 2,
  },
  genderSelector: {
    flexDirection: "row",
    height: 44,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    gap: 5,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.12)",
  },
  genderOptionSelected: {
    backgroundColor: "rgba(102,126,234,0.6)",
  },
  genderText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "500",
  },
  genderTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
})
