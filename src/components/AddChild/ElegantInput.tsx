"use client"

import { useState } from "react"
import { View, TextInput, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ElegantInputProps {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  icon: string
  keyboardType?: "default" | "numeric"
  required?: boolean
}

export function ElegantInput({
  placeholder,
  value,
  onChangeText,
  icon,
  keyboardType = "default",
  required = false,
}: ElegantInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.elegantInputContainer}>
      <View style={[styles.elegantInput, isFocused && styles.elegantInputFocused]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={isFocused ? "#fff" : "rgba(255,255,255,0.6)"}
          style={styles.inputIcon}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={styles.inputText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {required && !value && <Text style={styles.requiredStar}>*</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  elegantInputContainer: {
    marginBottom: 4,
  },
  elegantInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  elegantInputFocused: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  requiredStar: {
    color: "#f5576c",
    fontSize: 16,
    fontWeight: "bold",
  },
})
