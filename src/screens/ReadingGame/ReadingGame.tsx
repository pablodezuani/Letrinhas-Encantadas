import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Alert,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'ReadingGame'>;

const animals = [
  { label: 'Gato', image: require('../../../assets/animals/gato.png') },
  { label: 'Cachorro', image: require('../../../assets/animals/cachorro.png') },
  { label: 'Leão', image: require('../../../assets/animals/leao.png') },
  { label: 'Elefante', image: require('../../../assets/animals/elefante.png') },
  { label: 'Girafa', image: require('../../../assets/animals/girafa.png') },
  { label: 'Zebra', image: require('../../../assets/animals/zebra.png') },
  { label: 'Macaco', image: require('../../../assets/animals/macaco.png') },
  { label: 'Pato', image: require('../../../assets/animals/pato.png') },
  { label: 'Urso', image: require('../../../assets/animals/urso.png') },
  { label: 'Porco', image: require('../../../assets/animals/porco.png') },
  { label: 'Coelho', image: require('../../../assets/animals/coelho.png') },
  { label: 'Raposa', image: require('../../../assets/animals/raposa.png') },
  { label: 'Coruja', image: require('../../../assets/animals/coruja.png') },
  { label: 'Tigre', image: require('../../../assets/animals/tigre.png') },
  { label: 'Tartaruga', image: require('../../../assets/animals/tartaruga.png') },
  { label: 'Papagaio', image: require('../../../assets/animals/papagaio.png') },
  { label: 'Pinguim', image: require('../../../assets/animals/pinguim.png') },
  { label: 'Peixe', image: require('../../../assets/animals/peixe.png') },
];

export default function ReadingGame({ route }: Props) {
  const { gender } = route.params;
  const isBoy = gender === 'menino';

  const [question, setQuestion] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (question) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [question]);

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

  const speakLabel = (label: string) => {
    Speech.speak(label, {
      language: 'pt-BR',
      rate: 1.0,
      pitch: 1.0,
    });
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
    fadeAnim.setValue(0);
  };

  const handleOptionPress = async (option: any) => {
    speakLabel(option.label);

    if (option.label === question.correct.label) {
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

  if (!question) return null;

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: isBoy ? '#A1C6F1' : '#FAD6FF', opacity: fadeAnim }]}
    >
      <Text style={[styles.title, { color: isBoy ? '#3A3897' : '#9C27B0' }]}>
        Toque no animal:
      </Text>
      <Text style={[styles.word, { color: isBoy ? '#FF6347' : '#D81B60' }]}>
        {question.correct.label}
      </Text>

      <View style={styles.options}>
        {question.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleOptionPress(opt)}
            style={[
              styles.option,
              { backgroundColor: isBoy ? 'rgba(255, 255, 255, 0.7)' : 'rgba(245, 222, 255, 0.7)' },
            ]}
          >
            <Image
              source={opt.image}
              style={[
                styles.image,
                { borderColor: isBoy ? '#3A3897' : '#9C27B0' },
              ]}
            />
            <Text style={[styles.label, { color: isBoy ? '#3A3897' : '#9C27B0' }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showConfetti && (
        <ConfettiCannon count={80} origin={{ x: 200, y: 0 }} fadeOut />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Pacifico',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  word: {
    fontFamily: 'Poppins',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  option: {
    alignItems: 'center',
    borderRadius: 20,
    padding: 15,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 16,
    borderWidth: 2,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: 'Poppins',
  },
});
