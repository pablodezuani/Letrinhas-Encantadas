import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'ReadingGame'>;

const animals = [
  { label: 'Gato', image: require('../../../assets/animals/gato.png'), emoji: '🐱', sound: 'miau' },
  { label: 'Cachorro', image: require('../../../assets/animals/cachorro.png'), emoji: '🐶', sound: 'au au' },
  { label: 'Leão', image: require('../../../assets/animals/leao.png'), emoji: '🦁', sound: 'roar' },
  { label: 'Elefante', image: require('../../../assets/animals/elefante.png'), emoji: '🐘', sound: 'trumpet' },
  { label: 'Girafa', image: require('../../../assets/animals/girafa.png'), emoji: '🦒', sound: 'hmm' },
  { label: 'Zebra', image: require('../../../assets/animals/zebra.png'), emoji: '🦓', sound: 'neigh' },
  { label: 'Macaco', image: require('../../../assets/animals/macaco.png'), emoji: '🐵', sound: 'ooh ooh' },
  { label: 'Pato', image: require('../../../assets/animals/pato.png'), emoji: '🦆', sound: 'quack' },
  { label: 'Urso', image: require('../../../assets/animals/urso.png'), emoji: '🐻', sound: 'growl' },
  { label: 'Porco', image: require('../../../assets/animals/porco.png'), emoji: '🐷', sound: 'oink' },
  { label: 'Coelho', image: require('../../../assets/animals/coelho.png'), emoji: '🐰', sound: 'hop' },
  { label: 'Raposa', image: require('../../../assets/animals/raposa.png'), emoji: '🦊', sound: 'yip' },
  { label: 'Coruja', image: require('../../../assets/animals/coruja.png'), emoji: '🦉', sound: 'hoot' },
  { label: 'Tigre', image: require('../../../assets/animals/tigre.png'), emoji: '🐅', sound: 'roar' },
  { label: 'Tartaruga', image: require('../../../assets/animals/tartaruga.png'), emoji: '🐢', sound: 'slow' },
  { label: 'Papagaio', image: require('../../../assets/animals/papagaio.png'), emoji: '🦜', sound: 'squawk' },
  { label: 'Pinguim', image: require('../../../assets/animals/pinguim.png'), emoji: '🐧', sound: 'waddle' },
  { label: 'Peixe', image: require('../../../assets/animals/peixe.png'), emoji: '🐠', sound: 'bubble' },
];

export default function ReadingGame({ route, navigation }: Props) {
  const { gender } = route.params;
  const isBoy = gender === 'menino';

  const [question, setQuestion] = useState<any>(null);
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
  const wordPulseAnim = useRef(new Animated.Value(1)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;

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
    if (question) {
      resetAnimations();
    }
  }, [question]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    // Animação contínua de pulse na palavra
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(wordPulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(wordPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [question]);

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
      Animated.stagger(100, 
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

  const speakLabel = (label: string) => {
    Speech.speak(label, {
      language: 'pt-BR',
      rate: 1.0,
      pitch: 1.1,
    });
  };

  const speakWord = () => {
    if (question) {
      speakLabel(question.correct.label);
    }
  };

  const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

  const generateQuestion = () => {
    const correct = animals[Math.floor(Math.random() * animals.length)];
    const incorrect = animals
      .filter((a) => a.label !== correct.label)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = shuffleArray([correct, ...incorrect]);
    setQuestion({ correct, options });
    setSelectedOption(null);
    setGameState('playing');
  };

  const handleOptionPress = async (option: any) => {
    if (gameState !== 'playing') return;

    setSelectedOption(option.label);
    setAttempts(attempts + 1);
    speakLabel(option.label);

    if (option.label === question.correct.label) {
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
    
    if (option.label === question.correct.label) {
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
    
    if (option.label === question.correct.label) {
      return currentTheme.correctColor;
    }
    
    if (selectedOption === option.label && gameState === 'wrong') {
      return currentTheme.wrongColor;
    }
    
    return [currentTheme.cardBg, currentTheme.cardBg];
  };

  if (!question) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={currentTheme.background}
        style={styles.backgroundGradient}
      />

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
            🎯 Jogo de Leitura
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
              Toque no animal:
            </Text>
            <TouchableOpacity onPress={speakWord} style={styles.speakButton}>
              <MaterialCommunityIcons name="volume-high" size={20} color={currentTheme.accent} />
            </TouchableOpacity>
          </View>
          
          <Animated.View 
            style={[
              styles.wordContainer,
              {
                transform: [{ scale: wordPulseAnim }]
              }
            ]}
          >
            <Text style={styles.animalEmoji}>{question.correct.emoji}</Text>
            <Text style={[styles.word, { color: currentTheme.accent }]}>
              {question.correct.label}
            </Text>
            <Text style={[styles.wordSound, { color: currentTheme.textColor }]}>
              "{question.correct.sound}"
            </Text>
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
        <View style={styles.optionsGrid}>
          {question.options.map((option: any, index: number) => (
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
                onPress={() => handleOptionPress(option)}
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
                    {option.label === question.correct.label && gameState === 'correct' && (
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
                        color: gameState === 'correct' && option.label === question.correct.label ? '#fff' :
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
            <Text style={styles.successSubtext}>Você acertou!</Text>
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

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
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

  // Question Section
  questionSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    marginBottom: 15,
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
  wordContainer: {
    alignItems: 'center',
  },
  animalEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  wordSound: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },

  // Options
  optionsSection: {
    flex: 1,
    paddingHorizontal: 20,
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
    minHeight: 140,
    justifyContent: 'space-between',
  },
  optionImageContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
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
  },
});