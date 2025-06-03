import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';

const vowels = [
  {
    letter: 'A',
    correct: { label: 'Abacaxi', image: require('../../../assets/vowels/abacaxi.png') },
    wrong: [
      { label: 'Bola', image: require('../../../assets/vowels/bola.png') },
      { label: 'Gato', image: require('../../../assets/vowels/gato.png') },
      { label: 'Lápis', image: require('../../../assets/vowels/lapis.png') },
    ],
  },
  {
    letter: 'E',
    correct: { label: 'Elefante', image: require('../../../assets/vowels/elefante.png') },
    wrong: [
      { label: 'Cachorro', image: require('../../../assets/vowels/cachorro.png') },
      { label: 'Flor', image: require('../../../assets/vowels/flor.png') },
      { label: 'Mão', image: require('../../../assets/vowels/mao.png') },
    ],
  },
  {
    letter: 'I',
    correct: { label: 'Igreja', image: require('../../../assets/vowels/igreja.png') },
    wrong: [
      { label: 'Pato', image: require('../../../assets/vowels/pato.png') },
      { label: 'Sol', image: require('../../../assets/vowels/sol.png') },
      { label: 'Faca', image: require('../../../assets/vowels/faca.png') },
    ],
  },
  {
    letter: 'O',
    correct: { label: 'Ovo', image: require('../../../assets/vowels/ovo.png') },
    wrong: [
      { label: 'Gelo', image: require('../../../assets/vowels/gelo.png') },
      { label: 'Chave', image: require('../../../assets/vowels/chave.png') },
      { label: 'Mesa', image: require('../../../assets/vowels/mesa.png') },
    ],
  },
  {
    letter: 'U',
    correct: { label: 'Uva', image: require('../../../assets/vowels/uva.png') },
    wrong: [
      { label: 'Casa', image: require('../../../assets/vowels/casa.png') },
      { label: 'Peixe', image: require('../../../assets/vowels/peixe.png') },
      { label: 'Telefone', image: require('../../../assets/vowels/telefone.png') },
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = gender === 'menino' ? '#A1C6F1' : '#F7B7C5';

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (current) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [current]);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const playCorrectSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/sounds/correct.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const generateQuestion = () => {
    const vowel = vowels[Math.floor(Math.random() * vowels.length)];
    const allOptions = [vowel.correct, ...vowel.wrong];
    const shuffled = allOptions.sort(() => 0.5 - Math.random());

    setCurrent(vowel);
    setOptions(shuffled);
    fadeAnim.setValue(0);
  };

  const handlePress = async (option: any) => {
    if (option.label === current.correct.label) {
      await playCorrectSound();
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        generateQuestion();
      }, 2000);
    } else {
      Alert.alert('😕 Ops!', 'Tente novamente!');
    }
  };

  if (!current) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor }]}>
      <Text style={styles.title}>Qual imagem começa com a vogal:</Text>
      <Text style={styles.letter}>{current.letter}</Text>

      <View style={styles.options}>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(opt)}
            style={styles.option}
          >
            <Image source={opt.image} style={styles.image} />
            <Text style={styles.label}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showConfetti && <ConfettiCannon count={80} origin={{ x: 200, y: 0 }} fadeOut />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Pacifico',
    fontSize: 26,
    color: '#4A148C',
    textAlign: 'center',
    marginBottom: 10,
  },
  letter: {
    fontFamily: 'Poppins',
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FF5722',
    marginVertical: 20,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20, // se der problema no Android, pode usar margin
  },
  option: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A148C',
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Poppins',
    color: '#333',
  },
});
