import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

const vowels = [
  {
    letter: 'A',
    emoji: '🍍',
    color: ['#FF6B9D', '#FF8E9B'],
    sound: 'ah',
    correct: { label: 'Abacaxi', image: require('../../../assets/vowels/abacaxi.png'), emoji: '🍍' },
    wrong: [
      { label: 'Bola', image: require('../../../assets/vowels/bola.png'), emoji: '⚽' },
      { label: 'Gato', image: require('../../../assets/vowels/gato.png'), emoji: '🐱' },
      { label: 'Lápis', image: require('../../../assets/vowels/lapis.png'), emoji: '✏️' },
    ],
  },
  {
    letter: 'E',
    emoji: '🐘',
    color: ['#4ECDC4', '#44A08D'],
    sound: 'eh',
    correct: { label: 'Elefante', image: require('../../../assets/vowels/elefante.png'), emoji: '🐘' },
    wrong: [
      { label: 'Cachorro', image: require('../../../assets/vowels/cachorro.png'), emoji: '🐶' },
      { label: 'Flor', image: require('../../../assets/vowels/flor.png'), emoji: '🌸' },
      { label: 'Mão', image: require('../../../assets/vowels/mao.png'), emoji: '✋' },
    ],
  },
  {
    letter: 'I',
    emoji: '⛪',
    color: ['#A8E6CF', '#7FCDCD'],
    sound: 'ih',
    correct: { label: 'Igreja', image: require('../../../assets/vowels/igreja.png'), emoji: '⛪' },
    wrong: [
      { label: 'Pato', image: require('../../../assets/vowels/pato.png'), emoji: '🦆' },
      { label: 'Sol', image: require('../../../assets/vowels/sol.png'), emoji: '☀️' },
      { label: 'Faca', image: require('../../../assets/vowels/faca.png'), emoji: '🔪' },
    ],
  },
  {
    letter: 'O',
    emoji: '🥚',
    color: ['#FFD93D', '#6BCF7F'],
    sound: 'oh',
    correct: { label: 'Ovo', image: require('../../../assets/vowels/ovo.png'), emoji: '🥚' },
    wrong: [
      { label: 'Gelo', image: require('../../../assets/vowels/gelo.png'), emoji: '🧊' },
      { label: 'Chave', image: require('../../../assets/vowels/chave.png'), emoji: '🔑' },
      { label: 'Mesa', image: require('../../../assets/vowels/mesa.png'), emoji: '🪑' },
    ],
  },
  {
    letter: 'U',
    emoji: '🍇',
    color: ['#FD79A8', '#E84393'],
    sound: 'uh',
    correct: { label: 'Uva', image: require('../../../assets/vowels/uva.png'), emoji: '🍇' },
    wrong: [
      { label: 'Casa', image: require('../../../assets/vowels/casa.png'), emoji: '🏠' },
      { label: 'Peixe', image: require('../../../assets/vowels/peixe.png'), emoji: '🐠' },
      { label: 'Telefone', image: require('../../../assets/vowels/telefone.png'), emoji: '📞' },
    ],
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'VowelsGame'>;

export default function VowelsGame({ route, navigation }: Props) {
  const { gender } = route.params;

  const [current, setCurrent] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'wrong'>('playing');

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const letterPulseAnim = useRef(new Animated.Value(1)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Temas aprimorados
  const theme = {
    menino: {
      primary: '#4D9DE0',
      secondary: '#A5D8FF',
      background: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
      accent: '#2196F3',
      textColor: '#1565C0',
      cardBg: 'rgba(255,255,255,0.95)',
      shadowColor: '#2196F3',
      correctColor: ['#4CAF50', '#66BB6A'],
      wrongColor: ['#F44336', '#EF5350'],
    },
    menina: {
      primary: '#E07A9E',
      secondary: '#F9C8D9',
      background: ['#FCE4EC', '#F8BBD9', '#F48FB1'],
      accent: '#E91E63',
      textColor: '#AD1457',
      cardBg: 'rgba(255,255,255,0.95)',
      shadowColor: '#E91E63',
      correctColor: ['#4CAF50', '#66BB6A'],
      wrongColor: ['#F44336', '#EF5350'],
    }
  };

  const currentTheme = theme[gender] || theme.menino;

  useEffect(() => {
    generateQuestion();
    startAnimations();
  }, []);

  useEffect(() => {
    if (current) {
      resetAnimations();
    }
  }, [current]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    // Animação contínua de pulse na letra
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(letterPulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(letterPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [current]);

  useEffect(() => {
    // Animação contínua de rotação
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, []);

  const startAnimations = () => {
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
    ]).start();
  };

  const resetAnimations = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    optionsAnim.setValue(0);
    
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(150, 
        Array(4).fill(0).map(() =>
          Animated.spring(optionsAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  };

  const playCorrectSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/sounds/correct.mp3')
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const speakVowel = () => {
    if (current) {
      Speech.speak(`Vogal ${current.letter}`, {
        language: 'pt-BR',
        rate: 0.8,
        pitch: 1.2,
      });
    }
  };

  const speakWord = (word: string) => {
    Speech.speak(word, {
      language: 'pt-BR',
      rate: 1.0,
      pitch: 1.1,
    });
  };

  const generateQuestion = () => {
    const vowel = vowels[Math.floor(Math.random() * vowels.length)];
    const allOptions = [vowel.correct, ...vowel.wrong];
    const shuffled = allOptions.sort(() => 0.5 - Math.random());

    setCurrent(vowel);
    setOptions(shuffled);
    setSelectedOption(null);
    setGameState('playing');
  };

  const handlePress = async (option: any) => {
    if (gameState !== 'playing') return;

    setSelectedOption(option.label);
    setAttempts(attempts + 1);
    speakWord(option.label);

    if (option.label === current.correct.label) {
      setGameState('correct');
      setScore(score + 1);
      await playCorrectSound();
      setShowConfetti(true);
      
      // Animação de sucesso
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setShowConfetti(false);
        generateQuestion();
      }, 2500);
    } else {
      setGameState('wrong');
      
      // Animação de erro
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
      ]).start();

      setTimeout(() => {
        setGameState('playing');
        setSelectedOption(null);
      }, 1500);
    }
  };

  const getOptionStyle = (option: any) => {
    if (gameState === 'playing') {
      return selectedOption === option.label ? styles.optionSelected : styles.option;
    }
    
    if (option.label === current.correct.label) {
      return styles.optionCorrect;
    }
    
    if (selectedOption === option.label && gameState === 'wrong') {
      return styles.optionWrong;
    }
    
    return styles.option;
  };

  const getOptionColors = (option: any) => {
    if (gameState === 'playing') {
      return selectedOption === option.label ? currentTheme.accent : currentTheme.cardBg;
    }
    
    if (option.label === current.correct.label) {
      return currentTheme.correctColor;
    }
    
    if (selectedOption === option.label && gameState === 'wrong') {
      return currentTheme.wrongColor;
    }
    
    return [currentTheme.cardBg, currentTheme.cardBg];
  };

  if (!current) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={currentTheme.background} style={styles.backgroundGradient} />
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={48} color={currentTheme.textColor} />
          <Text style={[styles.loadingText, { color: currentTheme.textColor }]}>
            Carregando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={currentTheme.background}
        style={styles.backgroundGradient}
      />

      {/* Floating Elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          styles.floatingElement1,
          {
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.floatingEmoji}>🎯</Text>
      </Animated.View>

      <Animated.View 
        style={[
          styles.floatingElement,
          styles.floatingElement2,
          {
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.floatingEmoji}>📚</Text>
      </Animated.View>

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
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { shadowColor: currentTheme.shadowColor }]}
        >
          <Ionicons name="arrow-back" size={24} color={currentTheme.textColor} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: currentTheme.textColor }]}>
            🔤 Jogo das Vogais
          </Text>
          <View style={styles.scoreContainer}>
            <View style={[styles.scoreCard, { backgroundColor: currentTheme.cardBg, shadowColor: currentTheme.shadowColor }]}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={[styles.scoreText, { color: currentTheme.textColor }]}>
                {score}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Section */}
        <Animated.View 
          style={[
            styles.questionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[currentTheme.cardBg, 'rgba(255,255,255,0.8)']}
            style={[styles.questionCard, { shadowColor: currentTheme.shadowColor }]}
          >
            <View style={styles.questionHeader}>
              <MaterialCommunityIcons 
                name="eye" 
                size={24} 
                color={currentTheme.textColor} 
              />
              <Text style={[styles.questionTitle, { color: currentTheme.textColor }]}>
                Qual imagem começa com a vogal:
              </Text>
              <TouchableOpacity onPress={speakVowel} style={styles.speakButton}>
                <MaterialCommunityIcons name="volume-high" size={20} color={currentTheme.accent} />
              </TouchableOpacity>
            </View>
            
            <Animated.View 
              style={[
                styles.letterContainer,
                {
                  transform: [{ scale: letterPulseAnim }]
                }
              ]}
            >
              <LinearGradient
                colors={current.color}
                style={styles.letterBackground}
              >
                <Text style={styles.letterEmoji}>{current.emoji}</Text>
                <Text style={styles.letter}>{current.letter}</Text>
                <Text style={styles.letterSound}>"{current.sound}"</Text>
              </LinearGradient>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Options Grid */}
        <Animated.View 
          style={[
            styles.optionsSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            🖼️ Escolha a imagem correta:
          </Text>
          
          <View style={styles.optionsGrid}>
            {options.map((option, index) => (
              <Animated.View
                key={`${option.label}-${index}`}
                style={[
                  styles.optionWrapper,
                  {
                    opacity: optionsAnim,
                    transform: [
                      {
                        translateY: optionsAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handlePress(option)}
                  style={getOptionStyle(option)}
                  activeOpacity={0.8}
                  disabled={gameState !== 'playing' && gameState !== 'wrong'}
                >
                  <LinearGradient
                    colors={Array.isArray(getOptionColors(option)) ? getOptionColors(option) : [getOptionColors(option), getOptionColors(option)]}
                    style={styles.optionGradient}
                  >
                    <View style={styles.optionImageContainer}>
                      <Image source={option.image} style={styles.optionImage} />
                      {option.label === current.correct.label && gameState === 'correct' && (
                        <View style={styles.correctBadge}>
                          <Ionicons name="checkmark" size={20} color="#fff" />
                        </View>
                      )}
                      {selectedOption === option.label && gameState === 'wrong' && (
                        <View style={styles.wrongBadge}>
                          <Ionicons name="close" size={20} color="#fff" />
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      <Text style={[
                        styles.optionLabel, 
                        { 
                          color: gameState === 'correct' && option.label === current.correct.label ? '#fff' :
                                 gameState === 'wrong' && selectedOption === option.label ? '#fff' :
                                 currentTheme.textColor
                        }
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Success Animation */}
      {gameState === 'correct' && (
        <Animated.View 
          style={[
            styles.successOverlay,
            {
              opacity: bounceAnim,
              transform: [
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            }
          ]}
        >
          <LinearGradient
            colors={currentTheme.correctColor}
            style={styles.successCard}
          >
            <MaterialCommunityIcons name="check-circle" size={48} color="#fff" />
            <Text style={styles.successText}>Parabéns! 🎉</Text>
            <Text style={styles.successSubtext}>Você acertou a vogal {current.letter}!</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon 
          count={100} 
          origin={{ x: screenWidth / 2, y: 0 }} 
          fadeOut 
          autoStart
          colors={['#FFD700', '#FF6B9D', '#4ECDC4', '#A8E6CF', '#FFB74D']}
        />
      )}
    </SafeAreaView>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
  },

  // Floating Elements
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  floatingElement1: {
    top: '15%',
    right: '10%',
  },
  floatingElement2: {
    top: '25%',
    left: '8%',
  },
  floatingEmoji: {
    fontSize: 32,
    opacity: 0.3,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 6,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Question Section
  questionSection: {
    marginBottom: 25,
  },
  questionCard: {
    borderRadius: 25,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterContainer: {
    alignItems: 'center',
  },
  letterBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  letterEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  letter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  letterSound: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    marginTop: 5,
  },

  // Options
  optionsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  optionWrapper: {
    width: (screenWidth - 55) / 2,
  },
  option: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  optionSelected: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
    transform: [{ scale: 1.02 }],
  },
  optionCorrect: {
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    overflow: 'hidden',
    transform: [{ scale: 1.05 }],
  },
  optionWrong: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 15,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'space-between',
  },
  optionImageContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  correctBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  wrongBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  optionInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  optionEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Success Overlay
  successOverlay: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -50 }],
    width: 200,
    zIndex: 1000,
  },
  successCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  successSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
    textAlign: 'center',
  },
});