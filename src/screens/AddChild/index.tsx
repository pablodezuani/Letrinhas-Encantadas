"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const PREMIUM_GRADIENTS = {
  primary: ["#667eea", "#764ba2"],
  secondary: ["#f093fb", "#f5576c"],
  tertiary: ["#4facfe", "#00f2fe"],
  success: ["#11998e", "#38ef7d"],
  warning: ["#fc4a1a", "#f7b733"],
  purple: ["#a8edea", "#fed6e3"],
  ocean: ["#667db6", "#0082c8", "#0082c8", "#667db6"],
  sunset: ["#fa709a", "#fee140"],
  cosmic: ["#667eea", "#764ba2", "#f093fb"],
}

// Definir os passos da jornada
const JOURNEY_STEPS = [
  { id: 1, title: "Informações Básicas", icon: "person", description: "Nome, idade e diagnóstico", category: "basic" },
  { id: 2, title: "Pessoal", icon: "heart", description: "Sobre mim e interesses", category: "personal" },
  { id: 3, title: "Comportamento", icon: "happy", description: "Gostos e habilidades", category: "behavior" },
  { id: 4, title: "Ajuda", icon: "hand-left", description: "Como me ajudar", category: "help" },
  { id: 5, title: "Saúde", icon: "medical", description: "Informações médicas e TEA", category: "health" },
  { id: 8, title: "Finalização", icon: "checkmark-circle", description: "Revisão e confirmação", category: "final" },
]

export default function PremiumAddChildScreen() {
  const navigation = useNavigation()
  const [currentStep, setCurrentStep] = useState(1)
  const [childData, setChildData] = useState({
    // Informações Básicas
    name: "",
    nickname: "",
    age: "",
    gender: "",
    photo: null,
    hasAutism: "", // "yes" ou "no"
    autismLevel: "", // "1", "2", "3"
    
    // Categoria Pessoal
    aboutMe: "",
    specialInterests: [],
    routine: "",
    communication: "",
    
    // Categoria Comportamento
    likes: [],
    dislikes: [],
    skills: [],
    sensoryNeeds: "",
    
    // Categoria Ajuda
    howToHelp: "",
    whenFrustrated: "",
    whenNeedsAttention: "",
    difficulties: [],
    
    // Categoria Saúde
    medicalInfo: "",
    autismInfo: "",
    medications: [],
    allergies: [],
  })

  const [isLoading, setIsLoading] = useState(false)

  // Animações
  const masterFadeAnim = useRef(new Animated.Value(0)).current
  const cardScaleAnim = useRef(new Animated.Value(0.95)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animações iniciais
    Animated.parallel([
      Animated.timing(masterFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardScaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Animar progresso quando o passo muda
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [currentStep])

  const handleNext = async () => {
    // Validar campos obrigatórios do passo atual
    if (currentStep === 1) {
      if (!childData.name.trim()) {
        Alert.alert("Atenção", "Por favor, preencha o nome da criança.")
        return
      }
      if (!childData.hasAutism) {
        Alert.alert("Atenção", "Por favor, informe se a criança possui diagnóstico de TEA.")
        return
      }
      if (childData.hasAutism === "yes" && !childData.autismLevel) {
        Alert.alert("Atenção", "Por favor, selecione o nível de suporte TEA.")
        return
      }
    }

    setIsLoading(true)

    // Simular processamento
    setTimeout(() => {
      setIsLoading(false)
      
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1)
        scrollViewRef.current?.scrollTo({ y: 0, animated: true })
        
        // Feedback visual
        Animated.sequence([
          Animated.timing(cardScaleAnim, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(cardScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start()
      } else {
        Alert.alert(
          "Parabéns! 🎉", 
          "Perfil da criança criado com sucesso!", 
          [
            { 
              text: "Finalizar", 
              style: "default",
              onPress: () => navigation.goBack()
            }
          ]
        )
      }
    }, 800)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigation.goBack()
    }
  }

  const selectPhoto = () => {
    Alert.alert(
      "Selecionar Foto",
      "Escolha uma opção:",
      [
        { text: "Câmera", onPress: () => console.log("Abrir câmera") },
        { text: "Galeria", onPress: () => console.log("Abrir galeria") },
        { text: "Cancelar", style: "cancel" }
      ]
    )
  }

  const scrollViewRef = useRef(null)
  const currentStepData = JOURNEY_STEPS.find(step => step.id === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        const hasName = childData.name.trim().length > 0
        const hasAutismChoice = childData.hasAutism !== ""
        const hasLevelIfNeeded = childData.hasAutism === "no" || (childData.hasAutism === "yes" && childData.autismLevel !== "")
        return hasName && hasAutismChoice && hasLevelIfNeeded
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep()
      case 2:
        return renderPersonalStep()
      case 3:
        return renderBehaviorStep()
      case 4:
        return renderHelpStep()
      case 5:
        return renderHealthStep()
      default:
        return renderPlaceholderStep()
    }
  }

  // Passo 1: Informações Básicas MELHORADO
  const renderBasicInfoStep = () => (
    <>
      {/* Seção da Foto - Elegante e simples */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={selectPhoto} style={styles.photoButton} activeOpacity={0.8}>
          {childData.photo ? (
            <Image source={{ uri: childData.photo }} style={styles.photo} />
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

      {/* Campos Básicos - Elegantes */}
      <View style={styles.fieldsContainer}>
        <ElegantInput
          placeholder="Nome da criança"
          value={childData.name}
          onChangeText={(text) => setChildData({ ...childData, name: text })}
          icon="person"
          required
        />

        <ElegantInput
          placeholder="Apelido (opcional)"
          value={childData.nickname}
          onChangeText={(text) => setChildData({ ...childData, nickname: text })}
          icon="heart-outline"
        />

        <View style={styles.rowInputs}>
          <View style={styles.halfInput}>
            <ElegantInput
              placeholder="Idade"
              value={childData.age}
              onChangeText={(text) => setChildData({ ...childData, age: text })}
              icon="calendar-outline"
              keyboardType="numeric"
            />
          </View>
          
          {/* Nova seleção de gênero elegante */}
          <View style={styles.halfInput}>
            <Text style={styles.labelText}>Gênero</Text>
            <View style={styles.genderSelector}>
              <TouchableOpacity 
                style={[
                  styles.genderOption, 
                  childData.gender === "male" && styles.genderOptionSelected,
                  { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
                ]}
                onPress={() => setChildData({ ...childData, gender: "male" })}
              >
                <Ionicons 
                  name="male" 
                  size={16} 
                  color={childData.gender === "male" ? "#fff" : "rgba(255,255,255,0.6)"} 
                />
                <Text style={[
                  styles.genderText,
                  childData.gender === "male" && styles.genderTextSelected
                ]}>
                  Menino
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.genderOption, 
                  childData.gender === "female" && styles.genderOptionSelected
                ]}
                onPress={() => setChildData({ ...childData, gender: "female" })}
              >
                <Ionicons 
                  name="female" 
                  size={16} 
                  color={childData.gender === "female" ? "#fff" : "rgba(255,255,255,0.6)"} 
                />
                <Text style={[
                  styles.genderText,
                  childData.gender === "female" && styles.genderTextSelected
                ]}>
                  Menina
                </Text>
              </TouchableOpacity>
              
      
            </View>
          </View>
        </View>
      </View>

      {/* Seção TEA - Elegante */}
      <View style={styles.teaSection}>
        <Text style={styles.sectionTitle}>Diagnóstico TEA</Text>
        
        <View style={styles.teaOptions}>
          <TouchableOpacity
            style={[styles.teaOption, childData.hasAutism === "yes" && styles.teaOptionActive]}
            onPress={() => setChildData({ ...childData, hasAutism: "yes" })}
          >
            <LinearGradient 
              colors={childData.hasAutism === "yes" ? PREMIUM_GRADIENTS.success : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
              style={styles.teaOptionGradient}
            >
              <View style={styles.teaOptionContent}>
                <View style={styles.teaIconContainer}>
                  <Ionicons name="checkmark-circle" size={22} color={childData.hasAutism === "yes" ? "#fff" : "rgba(255,255,255,0.6)"} />
                </View>
                <Text style={[styles.teaOptionText, childData.hasAutism === "yes" && styles.teaOptionTextActive]}>
                  Sim, possui TEA
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.teaOption, childData.hasAutism === "no" && styles.teaOptionActive]}
            onPress={() => setChildData({ ...childData, hasAutism: "no", autismLevel: "" })}
          >
            <LinearGradient 
              colors={childData.hasAutism === "no" ? PREMIUM_GRADIENTS.warning : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
              style={styles.teaOptionGradient}
            >
              <View style={styles.teaOptionContent}>
                <View style={styles.teaIconContainer}>
                  <Ionicons name="close-circle" size={22} color={childData.hasAutism === "no" ? "#fff" : "rgba(255,255,255,0.6)"} />
                </View>
                <Text style={[styles.teaOptionText, childData.hasAutism === "no" && styles.teaOptionTextActive]}>
                  Não possui TEA
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Nível do TEA - só aparece se necessário */}
        {childData.hasAutism === "yes" && (
          <View style={styles.levelSection}>
            <Text style={styles.levelTitle}>Nível de Suporte</Text>
            
            <View style={styles.levelOptions}>
              {[
                { key: "1", label: "Nível 1", desc: "Apoio", color: "#11998e", gradient: PREMIUM_GRADIENTS.success },
                { key: "2", label: "Nível 2", desc: "Apoio substancial", color: "#f7b733", gradient: PREMIUM_GRADIENTS.warning },
                { key: "3", label: "Nível 3", desc: "Apoio muito substancial", color: "#f5576c", gradient: PREMIUM_GRADIENTS.secondary },
              ].map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[styles.levelOption]}
                  onPress={() => setChildData({ ...childData, autismLevel: level.key })}
                >
                  <LinearGradient 
                    colors={childData.autismLevel === level.key ? level.gradient : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                    style={styles.levelOptionGradient}
                  >
                    <View style={[
                      styles.levelIndicator, 
                      { backgroundColor: childData.autismLevel === level.key ? level.color : "rgba(255,255,255,0.3)" }
                    ]} />
                    <Text style={[
                      styles.levelText,
                      childData.autismLevel === level.key && styles.levelTextActive
                    ]}>
                      {level.label}
                    </Text>
                    <Text style={[
                      styles.levelDesc,
                      childData.autismLevel === level.key && styles.levelDescActive
                    ]}>
                      {level.desc}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </>
  )

  // Outros passos simplificados também...
  const renderPersonalStep = () => (
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
          value={childData.specialInterests.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, specialInterests: text.split(', ').filter(i => i.trim()) })}
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

  const renderBehaviorStep = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>😊 Comportamento</Text>
      
      <View style={styles.fieldsContainer}>
        <ElegantTextArea
          placeholder="O que a criança mais gosta?"
          value={childData.likes.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, likes: text.split(', ').filter(i => i.trim()) })}
          label="O que gosta"
        />

        <ElegantTextArea
          placeholder="O que a criança não gosta?"
          value={childData.dislikes.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, dislikes: text.split(', ').filter(i => i.trim()) })}
          label="O que não gosta"
        />

        <ElegantTextArea
          placeholder="Principais habilidades..."
          value={childData.skills.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, skills: text.split(', ').filter(i => i.trim()) })}
          label="Habilidades"
        />

        <ElegantTextArea
          placeholder="Necessidades sensoriais..."
          value={childData.sensoryNeeds}
          onChangeText={(text) => setChildData({ ...childData, sensoryNeeds: text })}
          label="Necessidades sensoriais"
        />
      </View>
    </View>
  )

  const renderHelpStep = () => (
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
          value={childData.difficulties.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, difficulties: text.split(', ').filter(i => i.trim()) })}
          label="Dificuldades"
        />
      </View>
    </View>
  )

  const renderHealthStep = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>🏥 Saúde</Text>
      
      <View style={styles.fieldsContainer}>
        <ElegantTextArea
          placeholder="Informações médicas relevantes..."
          value={childData.medicalInfo}
          onChangeText={(text) => setChildData({ ...childData, medicalInfo: text })}
          label="Informações médicas"
        />

        <ElegantTextArea
          placeholder="Detalhes sobre o TEA..."
          value={childData.autismInfo}
          onChangeText={(text) => setChildData({ ...childData, autismInfo: text })}
          label="Informações TEA"
        />

        <ElegantTextArea
          placeholder="Medicamentos em uso..."
          value={childData.medications.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, medications: text.split(', ').filter(i => i.trim()) })}
          label="Medicamentos"
        />

        <ElegantTextArea
          placeholder="Alergias ou restrições..."
          value={childData.allergies.join(', ')}
          onChangeText={(text) => setChildData({ ...childData, allergies: text.split(', ').filter(i => i.trim()) })}
          label="Alergias"
        />
      </View>
    </View>
  )

  const renderPlaceholderStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{currentStepData?.title}</Text>
      <Text style={styles.stepDescription}>{currentStepData?.description}</Text>
      
      <View style={styles.comingSoonContainer}>
        <MaterialCommunityIcons name="construction" size={64} color="rgba(255,255,255,0.6)" />
        <Text style={styles.comingSoonText}>Em desenvolvimento...</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Background Elegante */}
      <View style={styles.backgroundContainer}>
        <LinearGradient colors={PREMIUM_GRADIENTS.cosmic} style={styles.backgroundGradient} />
      </View>

      {/* Header Elegante */}
      <Animated.View style={[styles.header, { opacity: masterFadeAnim }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
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
                  index === currentStep - 1 && styles.stepDotCurrent
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.stepCounter}>
          <Text style={styles.stepText}>{currentStep}/{JOURNEY_STEPS.length}</Text>
        </View>
      </Animated.View>

      {/* Progress Bar Elegante */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 8],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp'
                })
              }
            ]}
          />
        </View>
      </View>

      {/* Conteúdo Principal */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.card, { opacity: masterFadeAnim, transform: [{ scale: cardScaleAnim }] }]}>
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      {/* Botão Elegante */}
      <Animated.View style={[styles.buttonContainer, { opacity: masterFadeAnim }]}>
        <TouchableOpacity
          onPress={handleNext}
          style={[styles.button, !canProceed() && styles.buttonDisabled]}
          disabled={!canProceed() || isLoading}
        >
          <LinearGradient
            colors={!canProceed() ? ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"] : PREMIUM_GRADIENTS.success}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Salvando..." : currentStep === 8 ? "Finalizar" : "Continuar"}
            </Text>
            {!isLoading && (
              <Ionicons 
                name={currentStep === 8 ? "checkmark-circle" : "arrow-forward-circle"} 
                size={22} 
                color="#fff" 
              />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  )
}

// Componentes Elegantes
function ElegantInput({ placeholder, value, onChangeText, icon, keyboardType = "default", required = false }) {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <View style={styles.elegantInputContainer}>
      <View style={[
        styles.elegantInput,
        isFocused && styles.elegantInputFocused
      ]}>
        <Ionicons 
          name={icon} 
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
        {required && !value && (
          <Text style={styles.requiredStar}>*</Text>
        )}
      </View>
    </View>
  )
}

function ElegantTextArea({ placeholder, value, onChangeText, label }) {
  const [isFocused, setIsFocused] = useState(false)
  
  return (
    <View style={styles.elegantTextAreaContainer}>
      <Text style={styles.elegantLabel}>{label}</Text>
      <View style={[
        styles.elegantTextArea,
        isFocused && styles.elegantTextAreaFocused
      ]}>
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
  safeArea: {
    flex: 1,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    flex: 1,
  },

  // Header Elegante
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

  // Progress Elegante
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

  // Conteúdo
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 5,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  // Foto Elegante
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

  // Campos Elegantes
  fieldsContainer: {
    gap: 16,
    marginBottom: 25,
  },
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

  // Inputs em linha
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  labelText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
    marginLeft: 2,
  },

  // Seleção de gênero elegante
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

  // TEA Section Elegante
  teaSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  teaOptions: {
    gap: 10,
    marginBottom: 16,
  },
  teaOption: {
    borderRadius: 12,
    overflow: "hidden",
  },
  teaOptionGradient: {
    borderRadius: 12,
    padding: 1,
  },
  teaOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 11,
    padding: 12,
  },
  teaIconContainer: {
    marginRight: 12,
  },
  teaOptionText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontWeight: "500",
  },
  teaOptionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  // Nível TEA Elegante
  levelSection: {
    marginTop: 5,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  levelOptions: {
    flexDirection: "row",
    gap: 8,
  },
  levelOption: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  levelOptionGradient: {
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  levelIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  levelText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  levelTextActive: {
    color: "#fff",
  },
  levelDesc: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    textAlign: "center",
  },
  levelDescActive: {
    color: "rgba(255,255,255,0.8)",
  },

  // TextArea Elegante
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

  // Categorias
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

  // Placeholder steps
  stepContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 30,
  },
  comingSoonContainer: {
    alignItems: "center",
  },
  comingSoonText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.5)",
    marginTop: 15,
  },

  // Botão Elegante
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