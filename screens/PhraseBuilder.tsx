import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());


const categories = {
  Básicos: [
    { word: 'Eu', image: null },
    { word: 'Quero', image: null },
    { word: 'Comer', image: null },
    { word: 'Beber', image: null },
    { word: 'Água', image: null },
    { word: 'Sim', image: null },
    { word: 'Não', image: null },
  ],
  Sentimentos: [
    { word: 'Feliz', image: require('../assets/words/feliz.png') },
    { word: 'Triste', image: require('../assets/words/triste.png') },
    { word: 'Bravo', image: require('../assets/words/bravo.png') },
  ],
  Frutas: [
    { word: 'Maçã', image: require('../assets/words/abacaxi.png') },
    { word: 'Uva', image: require('../assets/words/uva.png') },
  ],
  Cores: [
    { word: 'Vermelho', image: require('../assets/words/vermelho.png') },
    { word: 'Azul', image: require('../assets/words/azul.png') },
    { word: 'Amarelo', image: require('../assets/words/amarelo.png') },
  ],
  Animais: [
    { word: 'Cachorro', image: require('../assets/words/cachorro.png') },
    { word: 'Gato', image: require('../assets/words/gato.png') },
    { word: 'Pássaro', image: require('../assets/words/pato.png') },
  ],
  Alfabeto: alphabet.map((l) => ({ word: l, image: null })),
  Números: numbers.map((n) => ({ word: n, image: null })),
};

export default function PhraseBuilder({ route, navigation }) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>('Básicos');
  const [phrase, setPhrase] = useState<string[]>([]);
  const { gender } = route.params;
    
  const speakWord = (word: string) => {
    Speech.speak(word, { language: 'pt-BR' });
  };

  const handleWordPress = (word: string) => {
    speakWord(word);
    setPhrase((prev) => [...prev, word]);
  };

  const handleSpeakPhrase = () => {
    if (phrase.length > 0) {
      Speech.speak(phrase.join(' '), { language: 'pt-BR' });
    }
  };


  const handleDeleteLast = () => {
    setPhrase((prev) => prev.slice(0, prev.length - 1));
  };

  const backgroundColor = gender === 'menino' ? '#A1C6F1' : '#F7B7C5';

  return (
    <SafeAreaView style={[styles.container , { backgroundColor}]}>
      <Text style={styles.title}>Monte sua frase 💬</Text>

      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}>
          {Object.keys(categories).map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(cat as keyof typeof categories)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* PALAVRAS */}
      <ScrollView contentContainerStyle={styles.wordsContainer}>
        {categories[selectedCategory].map(({ word, image }) => (
          <TouchableOpacity
            key={word}
            style={styles.wordButton}
            onPress={() => handleWordPress(word)}>
            {image ? (
              <Image source={image} style={styles.wordImage} />
            ) : (
              <View style={styles.emptyImage} />
            )}
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FRASE MONTADA */}
      <View style={styles.phraseContainer}>
        <Text style={styles.phraseLabel}>Frase:</Text>
        <Text style={styles.phraseText}>{phrase.join(' ') || '---'}</Text>
      </View>

      {/* BOTÕES */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.playButton} onPress={handleSpeakPhrase}>
          <Text style={styles.playButtonText}>🔊 Falar</Text>
        </TouchableOpacity>
   
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteLast}
          disabled={phrase.length === 0}
        >
          <Text style={styles.deleteButtonText}>⌫ Apagar Última</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A1C6F1',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#3A3897',
    marginTop: 30,
    marginBottom: 10,
  },
  categoryWrapper: {
    height: 50,
    marginBottom: 10,
  },
  categoryScroll: {
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#ECECFF',
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategory: {
    backgroundColor: '#FFD700',
  },
  categoryText: {
    fontSize: 15,
    color: '#3A3897',
  },
  activeCategoryText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  wordButton: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 6,
    margin: 6,
    borderRadius: 16,
    width: screenWidth / 4.5, // diminuiu um pouco (antes era 3.2)
    elevation: 2,
  },
  wordImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  emptyImage: {
    height: 50,
    marginBottom: 5,
  },
  wordText: {
    fontSize: 14,
    color: '#3A3897',
    textAlign: 'center',
  },
  phraseContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0FF',
    minHeight: 60,
    marginBottom: 20,
  },
  phraseLabel: {
    fontWeight: '600',
    fontSize: 16,
    color: '#3A3897',
    marginBottom: 5,
  },
  phraseText: {
    fontSize: 18,
    color: '#FF6347',
  },
actionContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between', // espaço máximo entre os botões
  marginBottom: 30,
  paddingHorizontal: 20, // um pouco de margem nas laterais
},

playButton: {
  flex: 1, // cada botão ocupa espaço igual
  backgroundColor: '#6A5ACD',
  paddingVertical: 14,
  borderRadius: 20,
  marginRight: 10, // espaçamento entre botões
  alignItems: 'center',
},
playButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
clearButton: {
  flex: 1,
  backgroundColor: '#D9534F',
  paddingVertical: 14,
  borderRadius: 20,
  marginLeft: 10,
  alignItems: 'center',
},
clearButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
deleteButton: {
  flex: 1,
  backgroundColor: '#FFA500',
  paddingVertical: 14,
  borderRadius: 20,
  marginLeft: 10,
  alignItems: 'center',
},
deleteButtonText: {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
},
});