"use client"

import { View, StyleSheet, Animated } from "react-native"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  progressAnim: Animated.Value
}

export function ProgressBar({ currentStep, totalSteps, progressAnim }: ProgressBarProps) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, totalSteps],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 1.5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 1.5,
  },
})
