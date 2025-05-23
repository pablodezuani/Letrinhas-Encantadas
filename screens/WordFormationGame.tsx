import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const words = [
  { word: 'ABACAXI', image: require('../assets/words/abacaxi.png') },
  { word: 'ELEFANTE', image: require('../assets/words/elefante.png') },
  { word: 'IGREJA', image: require('../assets/words/igreja.png') },
  { word: 'OVO', image: require('../assets/words/ovo.png') },
  { word: 'UVA', image: require('../assets/words/uva.png') },
  { word: 'BOLA', image: require('../assets/words/bola.png') },
  { word: 'GATO', image: require('../assets/words/gato.png') },
  { word: 'LAPIS', image: require('../assets/words/lapis.png') },
  { word: 'CACHORRO', image: require('../assets/words/cachorro.png') },
  { word: 'FLOR', image: require('../assets/words/flor.png') },
  { word: 'MAO', image: require('../assets/words/mao.png') },
  { word: 'PATO', image: require('../assets/words/pato.png') },
  { word: 'SOL', image: require('../assets/words/sol.png') },
  { word: 'FACA', image: require('../assets/words/faca.png') },
  { word: 'GELO', image: require('../assets/words/gelo.png') },
  { word: 'CHAVE', image: require('../assets/words/chave.png') },
  { word: 'MESA', image: require('../assets/words/mesa.png') },
  { word: 'CASA', image: require('../assets/words/casa.png') },
  { word: 'PEIXE', image: require('../assets/words/peixe.png') },
];

type Props = NativeStackScreenProps<RootStackParamList, 'WordFormationGame'>;

export default function WordFormationGame({ route }: Props) {
  const { gender } = route.params;

  const [currentWord, setCurrentWord] = useState<{ word: string; image: any } | null>(null);
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [letterPositions, setLetterPositions] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = gender === 'menino' ? '#A1C6F1' : '#F7B7C5';

  useEffect(() => {
    generateNewWord();
  }, []);

  useEffect(() => {
    if (currentWord) {
      const shuffled = shuffleArray(currentWord.word.split(''));
      setShuffledLetters(shuffled);
      setAvailableLetters(shuffled);
      setLetterPositions(new Array(shuffled.length).fill(null));
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentWord]);

  const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/correct.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const checkWord = () => {
    if (letterPositions.join('') === currentWord?.word) {
      setShowConfetti(true);
      playSound();
      setTimeout(() => {
        setShowConfetti(false);
        generateNewWord();
      }, 2000);
    } else {
      Alert.alert('Ops!', 'Tente novamente!');
    }
  };

  const generateNewWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
  };

  const handleLetterClick = (index: number, letter: string) => {
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
    }
  };

  if (!currentWord) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor }]}>
      <Text style={styles.title}>Forme a palavra!</Text>
      <Image source={currentWord.image} style={styles.image} />

      <View style={styles.lettersContainer}>
        {availableLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            style={styles.letterBox}
            onPress={() => handleLetterClick(index, letter)}
          >
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.wordContainer}>
        {letterPositions.map((letter, index) => (
          <View key={index} style={styles.letterBox}>
            <Text style={styles.letter}>{letter || '_'}</Text>
          </View>
        ))}
      </View>

      {showConfetti && <ConfettiCannon count={80} origin={{ x: 200, y: 0 }} />}

      <TouchableOpacity onPress={checkWord} style={styles.checkButton}>
        <Text style={styles.checkButtonText}>Verificar</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4A148C',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  letterBox: {
    backgroundColor: '#FFF',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    borderColor: '#4A148C',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  wordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  checkButton: {
    backgroundColor: '#4A148C',
    padding: 10,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
