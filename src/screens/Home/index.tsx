"use client"

import React, { useState, useRef, useEffect, useContext, useMemo, useCallback } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  Platform,
  Vibration,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { AuthContext } from "../../contexts/AuthContext"


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const mockUser = {
  name: "Amanda",
  email: "amanda@exemplo.com",
}

const getResponsiveSize = () => {
  if (SCREEN_WIDTH < 350) return "small"
  if (SCREEN_WIDTH < 400) return "medium"
  if (SCREEN_WIDTH < 500) return "large"
  return "xlarge"
}

const DEVICE_SIZE = getResponsiveSize()
const IS_SMALL_DEVICE = DEVICE_SIZE === "small"
const IS_TABLET = SCREEN_WIDTH > 500


const RESPONSIVE_SIZES = {
  small: {
    cardPadding: 12,
    avatarSize: 50,
    fontSize: { large: 16, medium: 14, small: 12 },
    spacing: 8,
    headerHeight: 80,
  },
  medium: {
    cardPadding: 14,
    avatarSize: 60,
    fontSize: { large: 18, medium: 15, small: 13 },
    spacing: 12,
    headerHeight: 90,
  },
  large: {
    cardPadding: 16,
    avatarSize: 70,
    fontSize: { large: 20, medium: 16, small: 14 },
    spacing: 16,
    headerHeight: 100,
  },
  xlarge: {
    cardPadding: 20,
    avatarSize: 80,
    fontSize: { large: 22, medium: 18, small: 15 },
    spacing: 20,
    headerHeight: 110,
  },
}

const SIZES = RESPONSIVE_SIZES[DEVICE_SIZE]


const mockChildren = [
  {
    id: "1",
    name: "Maria Eduarda",
    nickname: "Mari",
    age: 7,
    image: "/placeholder.svg?height=80&width=80",
    gender: "female",
    difficulties: "Apresenta dificuldade de concentração em tarefas que exigem atenção prolongada. Sensibilidade a barulhos altos e ambientes muito estimulantes. Tem dificuldade em entender expressões faciais e linguagem corporal.",
    hasTEA: true,
    teaLevel: 2,
    likes: "Adora pintar e desenhar, especialmente com lápis coloridos. Gosta muito de brincar com bonecas e criar histórias para elas. Tem fascínio por música clássica e fica calma ao ouvi-la.",
    aboutMe: "Sou uma menina alegre e curiosa. Adoro aprender coisas novas, especialmente sobre animais e natureza. Tenho uma memória visual muito boa e consigo lembrar de detalhes que muitas pessoas não percebem.",
    dislikes: "Não gosto de barulhos altos como fogos de artifício ou balões estourando. Fico incomodada com etiquetas de roupas e costuras ásperas. Não gosto quando as pessoas mudam os planos sem me avisar.",
    skills: "Tenho uma memória visual excepcional e consigo lembrar de detalhes com precisão. Sou muito criativa em atividades artísticas e tenho habilidade para combinar cores.",
    howToHelp: "Me ajuda quando você dá instruções claras e diretas, uma de cada vez. Preciso de pausas frequentes durante atividades longas. Um ambiente tranquilo e previsível me ajuda a me concentrar melhor.",
    whenFrustrated: "Quando estou frustrada, costumo chorar e me isolar em um canto. Posso cobrir os ouvidos se estiver sobrecarregada sensorialmente. Às vezes, balanço meu corpo para frente e para trás para me acalmar.",
    whenNeedAttention: "Quando preciso de atenção, geralmente faço contato visual e chamo pelo nome. Posso pegar na mão e levar até o que quero mostrar. Se estiver ansiosa, posso ficar mais grudada e buscar contato físico.",
    color: "#E91E63",
    lightColor: "#FCE4EC",
    routine: "Preciso de uma rotina estruturada com horários regulares para refeições, estudo e sono. Gosto de usar um calendário visual para entender minha programação diária.",
    communication: "Me comunico principalmente através da fala, mas às vezes tenho dificuldade em expressar emoções complexas. Uso desenhos para complementar minha comunicação quando as palavras são difíceis.",
    sensoryNeeds: "Sou sensível a sons altos e luzes muito brilhantes. Gosto de abraços firmes e cobertores pesados que me dão sensação de segurança. Prefiro roupas macias sem etiquetas.",
    interests: "Tenho interesse especial por animais, especialmente gatos. Gosto muito de livros com ilustrações detalhadas. Tenho fascínio por padrões e cores.",
    medicalInfo: "Tomo medicação para ajudar na concentração pela manhã. Faço terapia ocupacional semanalmente para questões sensoriais. Tenho alergia leve a amendoim.",
    lastUpdate: new Date().toISOString(),
    priority: "high",
  },
  {
    id: "2",
    name: "Lucas Gabriel",
    nickname: "Lu",
    age: 8,
    image: "/placeholder.svg?height=80&width=80",
    gender: "male",
    difficulties: "Apresenta ansiedade em ambientes muito movimentados ou barulhentos. Tem dificuldade para focar em tarefas que não são do seu interesse imediato. Pode ficar facilmente frustrado quando as coisas não saem como planejado.",
    hasTEA: false,
    teaLevel: 0,
    likes: "Adora jogar futebol e qualquer atividade física ao ar livre. É fascinado por videogames, especialmente jogos de aventura e construção. Gosta muito de histórias em quadrinhos de super-heróis.",
    aboutMe: "Sou um menino muito ativo e cheio de energia. Adoro desafios e competições amigáveis. Sou muito sociável e gosto de fazer amigos, embora às vezes fale demais e interrompa os outros.",
    dislikes: "Não gosto de ficar parado por muito tempo fazendo a mesma atividade. Fico entediado em ambientes muito silenciosos ou com pouca estimulação. Não gosto de perder em jogos e posso ficar chateado.",
    skills: "Tenho excelente coordenação motora e habilidades esportivas. Aprendo regras de jogos rapidamente. Tenho bom raciocínio lógico para resolver problemas práticos.",
    howToHelp: "Me ajuda quando você estabelece rotinas claras e me explica o que vai acontecer durante o dia. Preciso de limites firmes, mas explicados com paciência. Atividades físicas regulares me ajudam a canalizar minha energia.",
    whenFrustrated: "Quando estou frustrado, posso ficar agitado, falar alto ou até mesmo gritar. Às vezes saio correndo ou bato os pés. Preciso de um momento para me acalmar antes de conversar sobre o problema.",
    whenNeedAttention: "Quando preciso de atenção, geralmente me aproximo e falo diretamente o que quero. Posso tocar repetidamente no braço ou ombro da pessoa. Se estou ansioso, posso fazer muitas perguntas seguidas.",
    color: "#2196F3",
    lightColor: "#E3F2FD",
    routine: "Funciono melhor com uma rotina que inclui bastante atividade física. Preciso de momentos para gastar energia entre tarefas que exigem concentração.",
    communication: "Me comunico bem verbalmente e sou bastante expressivo. Às vezes falo muito rápido quando estou empolgado. Posso interromper os outros quando tenho uma ideia.",
    sensoryNeeds: "Busco constantemente movimento e estimulação sensorial. Gosto de atividades que envolvem correr, pular e escalar. Prefiro ambientes com algum nível de ruído de fundo.",
    interests: "Sou apaixonado por esportes, especialmente futebol. Adoro jogos eletrônicos de aventura e construção. Tenho interesse em super-heróis e histórias de ação.",
    medicalInfo: "Tenho asma leve que pode ser desencadeada por exercícios muito intensos em dias frios. Uso óculos para leitura e atividades que exigem foco visual de perto.",
    lastUpdate: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    priority: "medium",
  },
  {
    id: "3",
    name: "Ana Clara",
    nickname: "Aninha",
    age: 6,
    image: "/placeholder.svg?height=80&width=80",
    gender: "female",
    difficulties: "Apresenta timidez extrema, especialmente em situações sociais novas. Tem dificuldade para se expressar verbalmente quando está ansiosa. Pode ficar paralisada em ambientes muito estimulantes.",
    hasTEA: true,
    teaLevel: 1,
    likes: "Adora desenhar e colorir em seu caderno especial. Gosta de brincar sozinha com seus brinquedos em um ambiente tranquilo. Adora ouvir histórias infantis, especialmente contos de fadas.",
    aboutMe: "Sou uma menina calma e observadora. Percebo detalhes que muitas pessoas não notam. Prefiro ambientes tranquilos e previsíveis. Levo tempo para me sentir confortável com pessoas novas.",
    dislikes: "Não gosto de multidões ou lugares barulhentos como festas grandes. Fico desconfortável quando preciso falar na frente de muitas pessoas. Não gosto quando me pressionam para interagir.",
    skills: "Tenho grande atenção aos detalhes visuais. Sou muito paciente com tarefas que exigem concentração. Tenho habilidade para desenho e artes manuais.",
    howToHelp: "Me ajuda quando você é gentil e paciente, dando-me tempo para responder. Prefiro quando me avisam sobre mudanças com antecedência. Não me force a interagir socialmente quando estou desconfortável.",
    whenFrustrated: "Quando estou frustrada, geralmente fico quieta e posso me esconder. Às vezes choro silenciosamente. Posso me recusar a falar ou responder.",
    whenNeedAttention: "Quando preciso de atenção, geralmente puxo suavemente a roupa da pessoa ou aponto para o que quero. Posso ficar próxima sem dizer nada.",
    color: "#9C27B0",
    lightColor: "#F3E5F5",
    routine: "Preciso de uma rotina previsível e tranquila. Mudanças súbitas podem me deixar ansiosa. Gosto de ter um lugar quieto para me retirar quando me sinto sobrecarregada.",
    communication: "Me comunico melhor em ambientes calmos e com uma pessoa de cada vez. Posso usar desenhos para expressar o que sinto quando as palavras são difíceis.",
    sensoryNeeds: "Sou sensível a barulhos altos e ambientes caóticos. Prefiro luz suave a iluminação forte. Gosto de abraços suaves e previsíveis.",
    interests: "Tenho interesse especial por desenho e pintura. Gosto de livros com ilustrações detalhadas. Tenho fascínio por pequenos animais e insetos.",
    medicalInfo: "Faço terapia fonoaudiológica semanalmente para desenvolver habilidades de comunicação. Tenho sensibilidade auditiva leve.",
    lastUpdate: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
    priority: "low",
  },
]

export default function HomeScreen() {
  const navigation = useNavigation()
  const { user, signOut } = useContext(AuthContext)

  // Estados otimizados
  const [selectedChild, setSelectedChild] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [expandedCards, setExpandedCards] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Animações otimizadas com useRef
  const slideAnim = useRef(new Animated.Value(0)).current
  const profileSlideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const headerAnim = useRef(new Animated.Value(0)).current
  const cardsAnim = useRef(mockChildren.map(() => new Animated.Value(0))).current
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current
  const modalOpacity = useRef(new Animated.Value(0)).current

  // Estados para interações otimizados
  const [cardPressStates, setCardPressStates] = useState({})

  // Memoização das abas do modal
  const modalTabs = useMemo(() => [
    { id: "personal", title: "Pessoal", icon: "person" },
    { id: "behavior", title: "Comportamento", icon: "happy" },
    { id: "help", title: "Ajuda", icon: "hand-left" },
    { id: "medical", title: "Saúde", icon: "medkit" },
  ], [])

  // Função memoizada para filtrar crianças
  const filteredChildren = useMemo(() => {
    if (!searchQuery) return mockChildren
    return mockChildren.filter(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.nickname.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  // Estatísticas memoizadas
  const stats = useMemo(() => ({
    total: mockChildren.length,
    withTEA: mockChildren.filter(child => child.hasTEA).length,
    highPriority: mockChildren.filter(child => child.priority === 'high').length,
  }), [])

  // Função de refresh otimizada
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Aqui você faria a chamada real para a API
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  // Função otimizada para logout
  const handleSignOut = useCallback(() => {
    Alert.alert(
      'Sair', 
      'Deseja mesmo sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: () => {
            setLoading(true)
            setTimeout(() => {
              signOut()
              setLoading(false)
            }, 500)
          }
        },
      ]
    )
  }, [signOut])

  // Organização otimizada das seções por abas
  const getModalSections = useCallback((child) => ({
    personal: [
      { id: "about", title: "Sobre mim", content: child?.aboutMe, icon: "happy", color: "#4CAF50" },
      { id: "interests", title: "Interesses especiais", content: child?.interests, icon: "star", color: "#9C27B0" },
      { id: "routine", title: "Minha rotina", content: child?.routine, icon: "time", color: "#FF9800" },
      { id: "communication", title: "Comunicação", content: child?.communication, icon: "chatbubbles", color: "#2196F3" },
    ],
    behavior: [
      { id: "likes", title: "O que eu gosto", content: child?.likes, icon: "heart", color: "#E91E63" },
      { id: "dislikes", title: "O que não gosto", content: child?.dislikes, icon: "close-circle", color: "#F44336" },
      { id: "skills", title: "Minhas habilidades", content: child?.skills, icon: "ribbon", color: "#673AB7" },
      { id: "sensory", title: "Necessidades sensoriais", content: child?.sensoryNeeds, icon: "eye", color: "#009688" },
    ],
    help: [
      { id: "howToHelp", title: "Como me ajudar", content: child?.howToHelp, icon: "hand-left", color: "#2196F3" },
      { id: "frustrated", title: "Quando frustrado(a)", content: child?.whenFrustrated, icon: "sad", color: "#795548" },
      { id: "attention", title: "Quando preciso de atenção", content: child?.whenNeedAttention, icon: "notifications", color: "#607D8B" },
      { id: "difficulties", title: "Minhas dificuldades", content: child?.difficulties, icon: "alert-circle", color: "#FF5722" },
    ],
    medical: [
      { id: "medicalInfo", title: "Informações médicas", content: child?.medicalInfo, icon: "medkit", color: "#F44336" },
      { 
        id: "teaInfo", 
        title: "Informações sobre TEA", 
        content: child?.hasTEA
          ? `Diagnóstico de TEA nível ${child.teaLevel}. ${child.gender === "male" ? "Ele" : "Ela"} necessita de suporte ${child.teaLevel === 1 ? "leve" : child.teaLevel === 2 ? "moderado" : "substancial"} em situações sociais e de comunicação.`
          : "Sem diagnóstico de TEA.",
        icon: "brain", 
        color: "#9C27B0" 
      },
    ],
  }), [])

  // Efeitos otimizados
  useEffect(() => {
    const animations = [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      ...cardsAnim.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        })
      ),
    ]

    Animated.stagger(100, animations).start()

    // Animação pulsante otimizada
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    )
    pulseAnimation.start()

    return () => pulseAnimation.stop()
  }, [])

  useEffect(() => {
    Animated.spring(tabIndicatorAnim, {
      toValue: activeTab,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }, [activeTab])

  // Funções de modal otimizadas
  const openModal = useCallback((child) => {
    setSelectedChild(child)
    setModalVisible(true)
    setActiveTab(0)
    setExpandedCards({})

    slideAnim.setValue(1)
    modalOpacity.setValue(0)

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false)
      setSelectedChild(null)
      setActiveTab(0)
      setExpandedCards({})
    })
  }, [])

  const openProfileModal = useCallback(() => {
    setProfileModalVisible(true)
    Animated.spring(profileSlideAnim, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start()
  }, [])

  const closeProfileModal = useCallback(() => {
    Animated.timing(profileSlideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setProfileModalVisible(false)
    })
  }, [])

  // Função otimizada para navegação
  const navigateToChildDetails = useCallback((child) => {
    navigation.navigate('ChoiceScreen', { child })
  }, [navigation])

  // Funções de interação otimizadas
  const handleCardPressIn = useCallback((id) => {
    setCardPressStates(prev => ({ ...prev, [id]: true }))
  }, [])

  const handleCardPressOut = useCallback((id) => {
    setCardPressStates(prev => ({ ...prev, [id]: false }))
  }, [])

  const toggleCard = useCallback((cardId) => {
    Vibration.vibrate(30)
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }, [])

  const switchTab = useCallback((tabIndex) => {
    setActiveTab(tabIndex)
    Vibration.vibrate(20)
  }, [])

  // Componente de card otimizado com React.memo
  const ChildCard = React.memo(({ item, index }) => {
    const cardScale = cardsAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    })

    const cardOpacity = cardsAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    })

    const cardTranslateY = cardsAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    })

    const isPressed = cardPressStates[item.id]

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { scale: cardScale }, 
              { translateY: cardTranslateY }, 
              { scale: isPressed ? 0.98 : 1 }
            ],
            opacity: cardOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[item.lightColor, "#FFFFFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => handleCardPressIn(item.id)}
            onPressOut={() => handleCardPressOut(item.id)}
            onPress={() => openModal(item)}
            style={styles.cardMainArea}
          >
            <View style={styles.cardContent}>
              {/* Avatar com indicadores melhorados */}
              <View style={[styles.avatarContainer, { borderColor: item.color }]}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                {item.hasTEA && (
                  <View style={[styles.teaBadge, { backgroundColor: item.color }]}>
                    <Text style={styles.teaBadgeText}>TEA</Text>
                  </View>
                )}
                {item.priority === 'high' && (
                  <View style={styles.priorityIndicator}>
                    <Ionicons name="alert-circle" size={12} color="#FF5722" />
                  </View>
                )}
                <View style={[styles.avatarGlow, { backgroundColor: item.color }]} />
              </View>

              {/* Informações da criança melhoradas */}
              <View style={styles.childInfo}>
                <Text style={[styles.childName, { color: item.color }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.childAge}>{item.age} anos</Text>
                <View style={styles.nicknameContainer}>
                  <Ionicons name="heart" size={SIZES.fontSize.small} color={item.color} />
                  <Text style={[styles.childNickname, { color: item.color }]}>"{item.nickname}"</Text>
                </View>

                {/* Indicadores visuais melhorados */}
                <View style={styles.indicators}>
                  <View style={[styles.genderIndicator, { backgroundColor: item.color }]}>
                    <Ionicons
                      name={item.gender === "male" ? "male" : "female"}
                      size={SIZES.fontSize.small}
                      color="#fff"
                    />
                  </View>
                  {item.hasTEA && (
                    <View style={styles.teaIndicator}>
                      <MaterialCommunityIcons name="brain" size={SIZES.fontSize.small} color={item.color} />
                    </View>
                  )}
                  <View style={styles.lastUpdateIndicator}>
                    <Text style={styles.lastUpdateText}>
                      Atualizado: {new Date(item.lastUpdate).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Botão de navegação melhorado */}
          <TouchableOpacity
            onPress={() => navigateToChildDetails(item)}
            style={[styles.navigationButton, { backgroundColor: item.color }]}
            activeOpacity={0.8}
          >
            <Animated.View style={styles.navigationButtonContent}>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    )
  })

  // Header melhorado com busca
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerAnim,
          transform: [
            {
              translateY: headerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <BlurView intensity={20} style={styles.headerBlur}>
        <LinearGradient colors={["rgba(108, 99, 255, 0.1)", "rgba(72, 52, 212, 0.05)"]} style={styles.headerGradient}>
          <TouchableOpacity onPress={openProfileModal} style={styles.profileSection}>
            <LinearGradient colors={["#6C63FF", "#4834D4"]} style={styles.profileAvatar}>
              <Text style={styles.profileInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Olá,</Text>
              <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
            </View>
          </TouchableOpacity>

          {/* Estatísticas melhoradas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Crianças</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.withTEA}</Text>
              <Text style={styles.statLabel}>Com TEA</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.highPriority}</Text>
              <Text style={styles.statLabel}>Prioridade</Text>
            </View>
          </View>

          {/* Barra de busca */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar criança..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </BlurView>
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={["#F8F9FA", "#E9ECEF", "#DEE2E6"]} style={styles.backgroundGradient}>
        <View style={styles.container}>
          {renderHeader()}

          {/* Lista melhorada com RefreshControl */}
          <FlatList
            data={filteredChildren}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => <ChildCard item={item} index={index} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            numColumns={IS_TABLET ? 2 : 1}
            key={IS_TABLET ? "tablet" : "phone"}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#6C63FF"]}
                tintColor="#6C63FF"
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchQuery ? "Nenhuma criança encontrada" : "Nenhuma criança cadastrada"}
                </Text>
                {!searchQuery && (
                  <TouchableOpacity 
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate('AddChildScreen')}
                  >
                    <Text style={styles.emptyButtonText}>Adicionar primeira criança</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          {/* FAB melhorado */}
          <Animated.View style={[styles.fabContainer, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddChildScreen')} 
              style={styles.fab} 
              activeOpacity={0.8}
              disabled={loading}
            >
              <LinearGradient colors={["#6C63FF", "#4834D4"]} style={styles.fabGradient}>
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="add" size={28} color="#fff" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Modal principal melhorado */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="none"
            onRequestClose={closeModal}
            statusBarTranslucent
          >
            <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
              <BlurView intensity={50} style={styles.modalBlurContainer}>
                <Animated.View
                  style={[
                    styles.modalContent,
                    {
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, SCREEN_HEIGHT], 
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {selectedChild && (
                    <>
                      {/* Header do modal */}
                      <LinearGradient colors={[selectedChild.lightColor, "#FFFFFF"]} style={styles.modalHeader}>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                          <View style={styles.closeButtonCircle}>
                            <Ionicons name="close" size={20} color="#666" />
                          </View>
                        </TouchableOpacity>

                        <View style={styles.modalAvatarSection}>
                          <View style={[styles.modalAvatarContainer, { borderColor: selectedChild.color }]}>
                            <Image source={{ uri: selectedChild.image }} style={styles.modalAvatar} />
                            {selectedChild.hasTEA && (
                              <View style={[styles.modalTeaBadge, { backgroundColor: selectedChild.color }]}>
                                <MaterialCommunityIcons name="brain" size={12} color="#fff" />
                                <Text style={styles.modalTeaBadgeText}>TEA {selectedChild.teaLevel}</Text>
                              </View>
                            )}
                          </View>

                          <View style={styles.modalTitleSection}>
                            <Text style={[styles.modalTitle, { color: selectedChild.color }]}>
                              {selectedChild.name}
                            </Text>
                            <Text style={styles.modalSubtitle}>
                              "{selectedChild.nickname}" • {selectedChild.age} anos
                            </Text>
                            <View style={[styles.genderChip, { backgroundColor: selectedChild.lightColor }]}>
                              <Ionicons
                                name={selectedChild.gender === "male" ? "male" : "female"}
                                size={14}
                                color={selectedChild.color}
                              />
                              <Text style={[styles.genderText, { color: selectedChild.color }]}>
                                {selectedChild.gender === "male" ? "Menino" : "Menina"}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>

                      {/* Navegação por abas */}
                      <View style={styles.tabsContainer}>
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.tabsScrollContent}
                        >
                          {modalTabs.map((tab, index) => (
                            <TouchableOpacity
                              key={tab.id}
                              style={[styles.tab, activeTab === index && styles.activeTab]}
                              onPress={() => switchTab(index)}
                            >
                              <Ionicons
                                name={tab.icon}
                                size={18}
                                color={activeTab === index ? selectedChild.color : "#999"}
                              />
                              <Text
                                style={[styles.tabText, { color: activeTab === index ? selectedChild.color : "#999" }]}
                              >
                                {tab.title}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>

                        {/* Indicador da aba ativa */}
                        <Animated.View
                          style={[
                            styles.tabIndicator,
                            { backgroundColor: selectedChild.color },
                            {
                              transform: [
                                {
                                  translateX: tabIndicatorAnim.interpolate({
                                    inputRange: [0, 1, 2, 3],
                                    outputRange: [
                                      25,
                                      SCREEN_WIDTH * 0.25 + 25,
                                      SCREEN_WIDTH * 0.5 + 25,
                                      SCREEN_WIDTH * 0.75 + 25,
                                    ],
                                  }),
                                },
                              ],
                            },
                          ]}
                        />
                      </View>

                      {/* Conteúdo das abas */}
                      <ScrollView
                        style={styles.modalScrollView}
                        contentContainerStyle={styles.modalScrollContent}
                        showsVerticalScrollIndicator={false}
                      >
                        {getModalSections(selectedChild)[Object.keys(getModalSections(selectedChild))[activeTab]].map(
                          (section) => (
                            <EnhancedInfoCard
                              key={section.id}
                              section={section}
                              isExpanded={expandedCards[section.id]}
                              onToggle={() => toggleCard(section.id)}
                              childColor={selectedChild.color}
                            />
                          ),
                        )}
                      </ScrollView>
                    </>
                  )}
                </Animated.View>
              </BlurView>
            </Animated.View>
          </Modal>

          {/* Modal de perfil inovador */}
          <Modal visible={profileModalVisible} transparent animationType="none" onRequestClose={closeProfileModal}>
            <BlurView intensity={30} style={styles.profileModalOverlay}>
              <TouchableOpacity activeOpacity={1} style={styles.profileModalTouchable} onPress={closeProfileModal}>
                <Animated.View style={[styles.profileModalContent, { transform: [{ translateX: profileSlideAnim }] }]}>
                  <LinearGradient colors={["#6C63FF", "#4834D4"]} style={styles.profileModalHeader}>
                    <View style={styles.profileModalAvatar}>
                      <Text style={styles.profileModalInitial}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </Text>
                    </View>
                    <Text style={styles.profileModalName}>{user?.name || "Usuário"}</Text>
                    <Text style={styles.profileModalEmail}>{user?.email || "usuario@exemplo.com"}</Text>
                  </LinearGradient>

                  <View style={styles.profileModalActions}>
                    {[
                      { icon: "settings-outline", title: "Configurações", action: () => {} },
                      { icon: "help-circle-outline", title: "Ajuda", action: () => {} },
                      { icon: "information-circle-outline", title: "Sobre", action: () => {} },
                    ].map((item, index) => (
                      <TouchableOpacity key={index} style={styles.profileModalAction} onPress={item.action}>
                        <Ionicons name={item.icon} size={24} color="#666" />
                        <Text style={styles.profileModalActionText}>{item.title}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                      closeProfileModal()
                      Alert.alert("Sair", "Deseja mesmo sair?", [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Sair", style: "destructive", onPress: handleSignOut },
                      ])
                    }}
                  >
                    <LinearGradient colors={["#FF5252", "#F44336"]} style={styles.logoutGradient}>
                      <Ionicons name="log-out-outline" size={24} color="#fff" />
                      <Text style={styles.logoutText}>Sair</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </TouchableOpacity>
            </BlurView>
          </Modal>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

// Componente EnhancedInfoCard otimizado
function EnhancedInfoCard({ section, isExpanded, onToggle, childColor }) {
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(expandAnim, {
        toValue: isExpanded ? 1 : 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }, [isExpanded])

  const maxHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  })

  const rotateIcon = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const contentOpacity = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  return (
    <View style={styles.enhancedInfoCard}>
      <TouchableOpacity activeOpacity={0.7} onPress={onToggle} style={styles.cardTouchable}>
        <LinearGradient colors={[`${section.color}15`, `${section.color}05`]} style={styles.enhancedCardGradient}>
          <View style={styles.enhancedCardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.enhancedIconContainer, { backgroundColor: section.color }]}>
                <Ionicons name={section.icon} size={18} color="#fff" />
              </View>
              <Text style={[styles.enhancedCardTitle, { color: section.color }]}>{section.title}</Text>
            </View>

            <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
              <Ionicons name="chevron-down" size={20} color={section.color} />
            </Animated.View>
          </View>

          {/* Conteúdo expansível */}
          <Animated.View
            style={[
              styles.enhancedCardContent,
              {
                maxHeight,
                opacity: contentOpacity,
              },
            ]}
          >
            <View style={[styles.contentDivider, { backgroundColor: section.color }]} />
            <Text style={styles.enhancedContentText}>{section.content}</Text>

            {/* Rodapé do card */}
            <View style={styles.enhancedCardFooter}>
              <View style={[styles.footerDot, { backgroundColor: section.color }]} />
              <Text style={[styles.footerText, { color: section.color }]}>Informação importante</Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

// Estilos completos e otimizados
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  backgroundGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.spacing,
  },

  // Header responsivo
  header: {
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    marginBottom: SIZES.spacing,
  },
  headerBlur: {
    borderRadius: 20,
    overflow: "hidden",
  },
  headerGradient: {
    padding: SIZES.cardPadding,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing,
  },
  profileAvatar: {
    width: SIZES.avatarSize * 0.7,
    height: SIZES.avatarSize * 0.7,
    borderRadius: SIZES.avatarSize * 0.35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.spacing,
  },
  profileInitial: {
    color: "#fff",
    fontSize: SIZES.fontSize.large,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: SIZES.fontSize.medium,
    color: "#666",
  },
  userName: {
    fontSize: SIZES.fontSize.large,
    fontWeight: "bold",
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: SIZES.spacing,
  },
  statNumber: {
    fontSize: SIZES.fontSize.large,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  statLabel: {
    fontSize: SIZES.fontSize.small,
    color: "#666",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#ddd",
  },

  // Barra de busca
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    marginTop: SIZES.spacing,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSize.medium,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },

  // Cards responsivos
  listContent: {
    paddingBottom: 120,
  },
  separator: {
    height: SIZES.spacing,
  },
  cardContainer: {
    marginBottom: SIZES.spacing,
    flex: IS_TABLET ? 0.48 : 1,
    marginHorizontal: IS_TABLET ? "1%" : 0,
  },
  cardGradient: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardMainArea: {
    flex: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.cardPadding,
  },
  avatarContainer: {
    position: "relative",
    width: SIZES.avatarSize,
    height: SIZES.avatarSize,
    borderRadius: SIZES.avatarSize / 2,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: SIZES.spacing,
  },
  avatar: {
    width: SIZES.avatarSize - 10,
    height: SIZES.avatarSize - 10,
    borderRadius: (SIZES.avatarSize - 10) / 2,
  },
  avatarGlow: {
    position: "absolute",
    width: SIZES.avatarSize + 10,
    height: SIZES.avatarSize + 10,
    borderRadius: (SIZES.avatarSize + 10) / 2,
    opacity: 0.1,
    zIndex: -1,
  },
  teaBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  teaBadgeText: {
    color: "#fff",
    fontSize: SIZES.fontSize.small - 2,
    fontWeight: "bold",
  },
  priorityIndicator: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: SIZES.fontSize.large,
    fontWeight: "bold",
    marginBottom: 2,
  },
  childAge: {
    fontSize: SIZES.fontSize.medium,
    color: "#666",
    marginBottom: 4,
  },
  nicknameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.spacing / 2,
  },
  childNickname: {
    fontSize: SIZES.fontSize.medium,
    fontWeight: "600",
    marginLeft: 4,
  },
  indicators: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: 'wrap',
  },
  genderIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  teaIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  lastUpdateIndicator: {
    marginTop: 4,
    width: '100%',
  },
  lastUpdateText: {
    fontSize: 10,
    color: '#999',
  },
  navigationButton: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  navigationButtonContent: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Estado vazio
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: SIZES.fontSize.medium,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: SIZES.fontSize.medium,
    fontWeight: '600',
  },

  // FAB responsivo
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: SIZES.spacing,
  },
  fab: {
    elevation: 12,
    shadowColor: "#6C63FF",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // Modal principal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBlurContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
  },
  modalHeader: {
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalAvatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalAvatarContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 16,
  },
  modalAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  modalTeaBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalTeaBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  modalTitleSection: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  genderChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genderText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // Tabs do modal
  tabsContainer: {
    backgroundColor: "#f8f9fa",
    position: "relative",
    paddingBottom: 3,
  },
  tabsScrollContent: {
    paddingHorizontal: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  activeTab: {
    // Estilos adicionais para a aba ativa
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: 50,
    borderRadius: 1.5,
  },

  modalScrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Enhanced Info Cards
  enhancedInfoCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: "hidden",
  },
  enhancedCardGradient: {
    borderRadius: 16,
    overflow: "hidden",
  },
  enhancedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  enhancedIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  enhancedCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  enhancedCardContent: {
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  contentDivider: {
    height: 2,
    width: 40,
    borderRadius: 1,
    marginBottom: 12,
  },
  enhancedContentText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 16,
  },
  enhancedCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Profile modal
  profileModalOverlay: {
    flex: 1,
  },
  profileModalTouchable: {
    flex: 1,
  },
  profileModalContent: {
    width: SCREEN_WIDTH * (IS_SMALL_DEVICE ? 0.85 : 0.75),
    height: "100%",
    backgroundColor: "#fff",
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 5, height: 0 },
  },
  profileModalHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  profileModalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileModalInitial: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  profileModalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileModalEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  profileModalActions: {
    flex: 1,
    paddingTop: 20,
  },
  profileModalAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileModalActionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
  logoutButton: {
    margin: 24,
    borderRadius: 12,
    overflow: "hidden",
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})