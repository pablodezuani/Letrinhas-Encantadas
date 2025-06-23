"use client"

import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { JOURNEY_STEPS } from "../../constants"


interface HeaderProps {
  currentStep: number
  currentStepData: any
  onBack: () => void
  fadeAnim: Animated.Value
}

export function Header({ currentStep, currentStepData, onBack, fadeAnim }: HeaderProps) {
  return (
    <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{currentStepData?.title}</Text>
        <View style={styles.stepIndicatorContainer}>
          {JOURNEY_STEPS.map((step, index) => (
            <View
              key={index}
              style={[
                styles.stepDot,
                index < currentStep && styles.stepDotActive,
                index === currentStep - 1 && styles.stepDotCurrent,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.stepCounter}>
        <Text style={styles.stepText}>
          {currentStep}/{JOURNEY_STEPS.length}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 10 : StatusBar.currentHeight + 10,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 15,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  stepDotActive: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  stepDotCurrent: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepCounter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
})
