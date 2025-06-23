"use client"

import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { PREMIUM_GRADIENTS } from "../../constants"

interface ActionButtonProps {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  isLoading: boolean
  onPress: () => void
  fadeAnim: Animated.Value
}

export function ActionButton({ currentStep, totalSteps, canProceed, isLoading, onPress, fadeAnim }: ActionButtonProps) {
  return (
    <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, !canProceed && styles.buttonDisabled]}
        disabled={!canProceed || isLoading}
      >
        <LinearGradient
          colors={!canProceed ? ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"] : PREMIUM_GRADIENTS.success}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Salvando..." : currentStep === totalSteps ? "Finalizar" : "Continuar"}
          </Text>
          {!isLoading && (
            <Ionicons
              name={currentStep === totalSteps ? "checkmark-circle" : "arrow-forward-circle"}
              size={22}
              color="#fff"
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
  },
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
