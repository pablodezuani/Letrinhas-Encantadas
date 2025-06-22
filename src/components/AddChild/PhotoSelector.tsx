"use client"

import { View, TouchableOpacity, Image, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { PREMIUM_GRADIENTS } from "../../constants"


interface PhotoSelectorProps {
  photo: string | null
  onSelectPhoto: () => void
}

export function PhotoSelector({ photo, onSelectPhoto }: PhotoSelectorProps) {
  return (
    <View style={styles.photoSection}>
      <TouchableOpacity onPress={onSelectPhoto} style={styles.photoButton} activeOpacity={0.8}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <LinearGradient colors={PREMIUM_GRADIENTS.purple} style={styles.photoPlaceholder}>
            <MaterialCommunityIcons name="camera-plus" size={28} color="#fff" />
          </LinearGradient>
        )}
        <View style={styles.photoOverlay}>
          <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  photoSection: {
    alignItems: "center",
    marginBottom: 25,
  },
  photoButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
})
