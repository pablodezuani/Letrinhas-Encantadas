
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  useWindowDimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { avatars } from "../../../data/avatars";
import { RootStackParamList } from "../../../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const gameButtons = [
  {
    id: 'ReadingGame',
    title: 'Jogo de Leitura',
    subtitle: 'Aprenda a ler',
    icon: 'book',
    emoji: '📚',
    colors: {
      menino: ['#4D9DE0', '#2196F3'],
      menina: ['#E07A9E', '#E91E63']
    }
  },
  {
    id: 'PhraseBuilder',
    title: 'Formação de Frases',
    subtitle: 'Monte frases',
    icon: 'chatbubbles',
    emoji: '💬',
    colors: {
      menino: ['#6A5ACD', '#9C27B0'],
      menina: ['#FF7AA2', '#F06292']
    }
  },
  {
    id: 'VowelsGame',
    title: 'Jogo das Vogais',
    subtitle: 'A, E, I, O, U',
    icon: 'musical-notes',
    emoji: '🎵',
    colors: {
      menino: ['#20B2AA', '#00BCD4'],
      menina: ['#F78DA7', '#FF4081']
    }
  },
  {
    id: 'WordFormationGame',
    title: 'Formação de Palavras',
    subtitle: 'Crie palavras',
    icon: 'extension-puzzle',
    emoji: '🧩',
    colors: {
      menino: ['#FFA07A', '#FF9800'],
      menina: ['#F06292', '#E91E63']
    }
  }
];

const ChildScreen: React.FC<Props> = ({ navigation, route }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const avatarBounce = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const gender = route.params?.gender || "menino";
  const avatarId = route.params?.avatarId ?? 0;

  const avatarGroup = avatars[gender] || avatars["menino"];
  const avatar = avatarGroup[avatarId] || avatarGroup[0];

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isBoy = gender === "menino";

  // Temas dinâmicos
  const theme = {
    menino: {
      primary: '#4D9DE0',
      secondary: '#A1C6F1',
      background: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
      accent: '#2196F3',
      textPrimary: '#1565C0',
      textSecondary: '#1976D2',
      cardBg: 'rgba(255,255,255,0.9)',
      speechBg: '#FFFFFF',
    },
    menina: {
      primary: '#E07A9E',
      secondary: '#FAD6FF',
      background: ['#FCE4EC', '#F8BBD9', '#F48FB1'],
      accent: '#E91E63',
      textPrimary: '#AD1457',
      textSecondary: '#C2185B',
      cardBg: 'rgba(255,255,255,0.9)',
      speechBg: '#FFFFFF',
    }
  };

  const currentTheme = theme[gender];

  useEffect(() => {
    // Sequência de animações
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação contínua do avatar
    const avatarAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(avatarBounce, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(avatarBounce, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    avatarAnimation.start();

    return () => avatarAnimation.stop();
  }, []);

  const handleGamePress = (gameId: string) => {
    setSelectedButton(gameId);
    
    // Animação de feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(gameId as any, { gender });
      setSelectedButton(null);
    });
  };

  const renderGameButton = (game: typeof gameButtons[0], index: number) => (
    <Animated.View
      key={game.id}
      style={[
        styles.gameButtonWrapper,
        {
          opacity: buttonsAnim,
          transform: [
            {
              translateY: buttonsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.gameButton}
        onPress={() => handleGamePress(game.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={game.colors[gender]}
          style={styles.gameButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.gameButtonContent}>
            <View style={styles.gameIconContainer}>
              <Text style={styles.gameEmoji}>{game.emoji}</Text>
              <MaterialCommunityIcons 
                name={game.icon as any} 
                size={24} 
                color="rgba(255,255,255,0.8)" 
              />
            </View>
            
            <View style={styles.gameTextContainer}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
            </View>
            
            <View style={styles.gameArrow}>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={currentTheme.background}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.welcomeText, { color: currentTheme.textPrimary }]}>
              Olá, {avatar.name}! 👋
            </Text>
            <Text style={[styles.subtitle, { color: currentTheme.textSecondary }]}>
              Pronto para aprender hoje?
            </Text>
          </View>
        </Animated.View>

        {/* Avatar Section */}
        <Animated.View 
          style={[
            styles.avatarSection,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                {
                  translateY: avatarBounce.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }
          ]}
        >
          <View style={styles.avatarCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
              style={styles.avatarCardGradient}
            >
              <View style={styles.avatarImageContainer}>
                <Image source={avatar.image} style={styles.avatarImage} />
                <View style={[styles.avatarBorder, { borderColor: currentTheme.primary }]} />
              </View>
              
              {/* Speech Bubble */}
              <View style={styles.speechBubbleContainer}>
                <View style={[styles.speechBubble, { backgroundColor: currentTheme.speechBg }]}>
                  <Text style={[styles.speechText, { color: currentTheme.textPrimary }]}>
                    Vamos aprender brincando! 🎉
                  </Text>
                </View>
                <View style={[styles.speechTail, { borderTopColor: currentTheme.speechBg }]} />
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Games Section */}
        <View style={styles.gamesSection}>
          <Animated.Text 
            style={[
              styles.sectionTitle, 
              { 
                color: currentTheme.textPrimary,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            🎮 Escolha um jogo
          </Animated.Text>
          
          <View style={styles.gamesGrid}>
            {gameButtons.map((game, index) => renderGameButton(game, index))}
          </View>
        </View>

        {/* Fun Stats */}
        <Animated.View 
          style={[
            styles.statsSection,
            {
              opacity: buttonsAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
            style={styles.statsCard}
          >
            <Text style={[styles.statsTitle, { color: currentTheme.textPrimary }]}>
              🏆 Seu Progresso
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>
                  Jogos
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>⭐⭐⭐</Text>
                <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>
                  Estrelas
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>
                  Dias
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },

  // Avatar Section
  avatarSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarCard: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarCardGradient: {
    borderRadius: 25,
    padding: 20,
    alignItems: 'center',
  },
  avatarImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 60,
  },
  avatarBorder: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 65,
    borderWidth: 4,
  },
  speechBubbleContainer: {
    alignItems: 'center',
    width: '100%',
  },
  speechBubble: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: '90%',
  },
  speechText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  speechTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  // Games Section
  gamesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  gamesGrid: {
    gap: 15,
  },
  gameButtonWrapper: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  gameButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gameButtonGradient: {
    borderRadius: 20,
    padding: 20,
  },
  gameButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    position: 'relative',
  },
  gameEmoji: {
    fontSize: 24,
    position: 'absolute',
    top: -5,
    right: -5,
  },
  gameTextContainer: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  gameArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
});

export default ChildScreen;