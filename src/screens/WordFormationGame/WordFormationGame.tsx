import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
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

const words = [
  { word: 'ABACAXI', image: require('../../../assets/words/abacaxi.png'), emoji: '🍍', difficulty: 'hard' },
  { word: 'ELEFANTE', image: require('../../../assets/words/elefante.png'), emoji: '🐘', difficulty: 'hard' },
  { word: 'IGREJA', image: require('../../../assets/words/igreja.png'), emoji: '⛪', difficulty: 'medium' },
  { word: 'OVO', image: require('../../../assets/words/ovo.png'), emoji: '🥚', difficulty: 'easy' },
  { word: 'UVA', image: require('../../../assets/words/uva.png'), emoji: '🍇', difficulty: 'easy' },
  { word: 'BOLA', image: require('../../../assets/words/bola.png'), emoji: '⚽', difficulty: 'easy' },
  { word: 'GATO', image: require('../../../assets/words/gato.png'), emoji: '🐱', difficulty: 'easy' },
  { word: 'LAPIS', image: require('../../../assets/words/lapis.png'), emoji: '✏️', difficulty: 'medium' },
  { word: 'CACHORRO', image: require('../../../assets/words/cachorro.png'), emoji: '🐶', difficulty: 'hard' },
  { word: 'FLOR', image: require('../../../assets/words/flor.png'), emoji: '🌸', difficulty: 'easy' },
  { word: 'MAO', image: require('../../../assets/words/mao.png'), emoji: '✋', difficulty: 'easy' },
  { word: 'PATO', image: require('../../../assets/words/pato.png'), emoji: '🦆', difficulty: 'easy' },
  { word: 'SOL', image: require('../../../assets/words/sol.png'), emoji: '☀️', difficulty: 'easy' },
  { word: 'FACA', image: require('../../../assets/words/faca.png'), emoji: '🔪', difficulty: 'easy' },
  { word: 'GELO', image: require('../../../assets/words/gelo.png'), emoji: '🧊', difficulty: 'easy' },
  { word: 'CHAVE', image: require('../../../assets/words/chave.png'), emoji: '🔑', difficulty: 'medium' },
  { word: 'MESA', image: require('../../../assets/words/mesa.png'), emoji: '🪑', difficulty: 'easy' },
  { word: 'CASA', image: require('../../../assets/words/casa.png'), emoji: '🏠', difficulty: 'easy' },
  { word: 'PEIXE', image: require('../../../assets/words/peixe.png'), emoji: '🐠', difficulty: 'medium' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'WordFormationGame'>;

export default function WordFormationGame({ route, navigation }: Props) {
  const { gender } = route.params;

  const [currentWord, setCurrentWord] = useState<{ word: string; image: any; emoji: string; difficulty: string } | null>(null);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [letterPositions, setLetterPositions] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'checking'>('playing');
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const imageRotateAnim = useRef(new Animated.Value(0)).current;
  const lettersAnim = useRef(new Animated.Value(0)).current;
  const wordAnim = useRef(new Animated.Value(0)).current;

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
      letterBg: ['#E3F2FD', '#BBDEFB'],
      selectedBg: ['#2196F3', '#1976D2'],
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
      letterBg: ['#FCE4EC', '#F8BBD9'],
      selectedBg: ['#E91E63', '#C2185B'],
    }
  };

  const currentTheme = theme[gender] || theme.menino;

  useEffect(() => {
    generateNewWord();
    startInitialAnimations();
  }, []);

  useEffect(() => {
    if (currentWord) {
      const shuffled = shuffleArray(currentWord.word.split(''));
      setShuffledLetters(shuffled);
      setAvailableLetters(shuffled);
      setLetterPositions(new Array(currentWord.word.length).fill(null));
      setGameState('playing');
      setSelectedLetterIndex(null);
      resetAnimations();
    }
  }, [currentWord]);

  useEffect(() => {
    // Animação contínua de rotação da imagem
    const rotateAnimation = Animated.loop(
      Animated.timing(imageRotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [currentWord]);

  const startInitialAnimations = () => {
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
    lettersAnim.setValue(0);
    wordAnim.setValue(0);
    
    Animated.sequence([
      Animated.timing(lettersAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(wordAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const playSound = async () => {
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

  const checkWord = () => {
    if (letterPositions.some(pos => pos === null)) {
      Alert.alert('🤔 Ops!', 'Complete todas as letras primeiro!');
      return;
    }

    setGameState('checking');
    setAttempts(attempts + 1);

    // Animação de verificação
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      if (letterPositions.join('') === currentWord?.word) {
        setGameState('correct');
        setScore(score + 1);
        setShowConfetti(true);
        playSound();
        
        // Animação de sucesso
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          setShowConfetti(false);
          bounceAnim.setValue(0);
          generateNewWord();
        }, 3000);
      } else {
        setGameState('playing');
        Alert.alert('😅 Quase lá!', 'Tente novamente! Você consegue!');
      }
    }, 500);
  };

  const generateNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const handleLetterClick = (index: number, letter: string) => {
    if (gameState !== 'playing') return;

    setSelectedLetterIndex(index);
    
    const newPositions = [...letterPositions];
    const firstEmptyIndex = newPositions.indexOf(null);

    if (firstEmptyIndex !== -1) {
      newPositions[firstEmptyIndex] = letter;
      setLetterPositions(newPositions);
      setAvailableLetters(prev => {
        const newLetters = [...prev];
        newLetters.splice(index, 1);
        return newLetters;
      });

      // Animação de letra selecionada
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    setTimeout(() => setSelectedLetterIndex(null), 300);
  };

  const handleWordLetterClick = (index: number) => {
    if (gameState !== 'playing') return;
    
    const letter = letterPositions[index];
    if (letter) {
      const newPositions = [...letterPositions];
      newPositions[index] = null;
      setLetterPositions(newPositions);
      setAvailableLetters(prev => [...prev, letter]);
    }
  };

  const resetWord = () => {
    if (currentWord) {
      const shuffled = shuffleArray(currentWord.word.split(''));
      setShuffledLetters(shuffled);
      setAvailableLetters(shuffled);
      setLetterPositions(new Array(currentWord.word.length).fill(null));
      setGameState('playing');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return ['#4CAF50', '#66BB6A'];
      case 'medium': return ['#FF9800', '#FFB74D'];
      case 'hard': return ['#F44336', '#EF5350'];
      default: return currentTheme.accent;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'star';
      case 'medium': return 'star-half';
      case 'hard': return 'star-outline';
      default: return 'star';
    }
  };

  if (!currentWord) {
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
            🔤 Forme a Palavra
          </Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: currentTheme.cardBg, shadowColor: currentTheme.shadowColor }]}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={[styles.statText, { color: currentTheme.textColor }]}>
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
        {/* Word Card */}
        <Animated.View 
          style={[
            styles.wordCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={[currentTheme.cardBg, 'rgba(255,255,255,0.8)']}
            style={[styles.wordCardGradient, { shadowColor: currentTheme.shadowColor }]}
          >
            <View style={styles.wordCardHeader}>
              <View style={styles.difficultyBadge}>
                <LinearGradient
                  colors={getDifficultyColor(currentWord.difficulty)}
                  style={styles.difficultyGradient}
                >
                  <MaterialCommunityIcons 
                    name={getDifficultyIcon(currentWord.difficulty)} 
                    size={16} 
                    color="#fff" 
                  />
                  <Text style={styles.difficultyText}>
                    {currentWord.difficulty === 'easy' ? 'Fácil' : 
                     currentWord.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </Text>
                </LinearGradient>
              </View>
              
              <TouchableOpacity onPress={resetWord} style={styles.resetButton}>
                <MaterialCommunityIcons name="refresh" size={20} color={currentTheme.accent} />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Animated.View
                style={[
                  styles.imageWrapper,
                  {
                    transform: [
                      {
                        rotate: imageRotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Image source={currentWord.image} style={styles.wordImage} />
              </Animated.View>
              
              <View style={styles.emojiContainer}>
                <Text style={styles.wordEmoji}>{currentWord.emoji}</Text>
              </View>
            </View>

            <Text style={[styles.instructionText, { color: currentTheme.textColor }]}>
              Toque nas letras para formar a palavra!
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Available Letters */}
        <Animated.View 
          style={[
            styles.lettersSection,
            {
              opacity: lettersAnim,
              transform: [
                {
                  translateY: lettersAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            📝 Letras Disponíveis
          </Text>
          
          <View style={styles.lettersContainer}>
            {availableLetters.map((letter, index) => (
              <TouchableOpacity
                key={`${letter}-${index}`}
                style={[
                  styles.letterButton,
                  selectedLetterIndex === index && styles.letterButtonSelected,
                ]}
                onPress={() => handleLetterClick(index, letter)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedLetterIndex === index ? currentTheme.selectedBg : currentTheme.letterBg}
                  style={styles.letterGradient}
                >
                  <Text style={[
                    styles.letterText,
                    { color: selectedLetterIndex === index ? '#fff' : currentTheme.textColor }
                  ]}>
                    {letter}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Word Formation */}
        <Animated.View 
          style={[
            styles.wordSection,
            {
              opacity: wordAnim,
              transform: [
                {
                  translateY: wordAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: currentTheme.textColor }]}>
            ✨ Sua Palavra
          </Text>
          
          <View style={styles.wordContainer}>
            {letterPositions.map((letter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.wordSlot,
                  letter && styles.wordSlotFilled,
                ]}
                onPress={() => handleWordLetterClick(index)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={letter ? currentTheme.selectedBg : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
                  style={styles.wordSlotGradient}
                >
                  <Text style={[
                    styles.wordSlotText,
                    { color: letter ? '#fff' : currentTheme.textColor }
                  ]}>
                    {letter || '_'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Action Button */}
      <Animated.View 
        style={[
          styles.actionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          onPress={checkWord}
          style={[
            styles.checkButton,
            gameState === 'checking' && styles.checkButtonDisabled,
          ]}
          disabled={gameState === 'checking'}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gameState === 'checking' ? ['#CCCCCC', '#999999'] : currentTheme.correctColor}
            style={styles.checkButtonGradient}
          >
            <MaterialCommunityIcons 
              name={gameState === 'checking' ? 'loading' : 'check-circle'} 
              size={24} 
              color="#fff" 
            />
            <Text style={styles.checkButtonText}>
              {gameState === 'checking' ? 'Verificando...' : 'Verificar Palavra'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Success Overlay */}
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
            <Text style={styles.successSubtext}>Palavra formada corretamente!</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Confetti */}
      {showConfetti && (
        <ConfettiCannon 
          count={120} 
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
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCard: {
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
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Word Card
  wordCard: {
    marginBottom: 25,
  },
  wordCardGradient: {
    borderRadius: 25,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  wordCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  difficultyBadge: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  difficultyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resetButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wordImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  emojiContainer: {
    position: 'absolute',
    top: -10,
    right: screenWidth / 2 - 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  wordEmoji: {
    fontSize: 24,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    opacity: 0.8,
  },

  // Sections
  lettersSection: {
    marginBottom: 25,
  },
  wordSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  // Letters
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  letterButton: {
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  letterButtonSelected: {
    elevation: 8,
    shadowOpacity: 0.2,
    transform: [{ scale: 1.1 }],
  },
  letterGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Word Formation
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  wordSlot: {
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  wordSlotFilled: {
    elevation: 6,
    shadowOpacity: 0.15,
  },
  wordSlotGradient: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordSlotText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Action Button
  actionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  checkButton: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  checkButtonDisabled: {
    elevation: 4,
    shadowOpacity: 0.1,
  },
  checkButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    gap: 10,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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