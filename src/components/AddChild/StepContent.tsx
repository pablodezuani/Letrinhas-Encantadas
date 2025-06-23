"use client"

import { StyleSheet, Animated } from "react-native"
import { BasicInfoStep } from "./BasicInfoStep"
import { PersonalStep } from "./PersonalStep"
import { BehaviorStep } from "./BehaviorStep"
import { HelpStep } from "./HelpStep"
import { HealthStep } from "./HealthStep"
import { PlaceholderStep } from "./PlaceholderStep"

import { ChildData } from "../../../types"
import { JOURNEY_STEPS } from "../../constants"

interface StepContentProps {
  currentStep: number
  childData: ChildData
  setChildData: (data: ChildData) => void
  fadeAnim: Animated.Value
  scaleAnim: Animated.Value
}

export function StepContent({ currentStep, childData, setChildData, fadeAnim, scaleAnim }: StepContentProps) {
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep childData={childData} setChildData={setChildData} />
      case 2:
        return <PersonalStep childData={childData} setChildData={setChildData} />
      case 3:
        return <BehaviorStep childData={childData} setChildData={setChildData} />
      case 4:
        return <HelpStep childData={childData} setChildData={setChildData} />
      case 5:
        return <HealthStep childData={childData} setChildData={setChildData} />
      default:
        const currentStepData = JOURNEY_STEPS.find((step) => step.id === currentStep)
        return <PlaceholderStep stepData={currentStepData} />
    }
  }

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      {renderStepContent()}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
})
