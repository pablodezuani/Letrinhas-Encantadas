"use client"

import { useState } from "react"
import { View, TextInput, Text, StyleSheet } from "react-native"

interface ElegantTextAreaProps {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  label: string
}

export function ElegantTextArea({ placeholder, value, onChangeText, label }: ElegantTextAreaProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.elegantTextAreaContainer}>
      <Text style={styles.elegantLabel}>{label}</Text>
      <View style={[styles.elegantTextArea, isFocused && styles.elegantTextAreaFocused]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={value}
          onChangeText={onChangeText}
          style={styles.textAreaText}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  elegantTextAreaContainer: {
    marginBottom: 4,
  },
  elegantLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
    marginLeft: 2,
  },
  elegantTextArea: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 12,
  },
  elegantTextAreaFocused: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.25)",
  },
  textAreaText: {
    color: "#fff",
    fontSize: 15,
    minHeight: 70,
    textAlignVertical: "top",
  },
})
