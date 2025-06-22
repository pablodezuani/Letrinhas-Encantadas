import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

const categories = {
  Básicos: {
    icon: "hand-heart",
    emoji: "👋",
    color: ["#FF6B9D", "#FF8E9B"],
    words: [
      { word: "Eu", image: null },
      { word: "Quero", image: null },
      { word: "Sim", image: null },
      { word: "Não", image: null },
    ]
  },
  Ações: {
    icon: "run",
    emoji: "🏃",
    color: ["#4ECDC4", "#44A08D"],
    words: [
      { word: "Comer", image: require("../../../assets/words/comer.png") },
      { word: "Beber", image: require("../../../assets/words/beber.png") },
      { word: "Dormir", image: require("../../../assets/words/dormir.png") },
      { word: "Brincar", image: require("../../../assets/words/brincar.png") },
      { word: "Correr", image: require("../../../assets/words/correr.png") },
      { word: "Pular", image: require("../../../assets/words/pular.png") },
      { word: "Andar", image: require("../../../assets/words/andar.png") },
      { word: "Cantar", image: require("../../../assets/words/cantar.png") },
      { word: "Desenhar", image: require("../../../assets/words/desenhar.png") },
      { word: "Abraçar", image: require("../../../assets/words/abracar.png") },
      { word: "Chorar", image: require("../../../assets/words/chorar.png") },
      { word: "Sorrir", image: require("../../../assets/words/sorrir.png") },
      { word: "Sentar", image: require("../../../assets/words/sentar.png") },
      { word: "Levantar", image: require("../../../assets/words/levantar.png") },
      { word: "Tomar banho", image: require("../../../assets/words/banho.png") },
    ]
  },
  Sentimentos: {
    icon: "emoticon-happy",
    emoji: "😊",
    color: ["#A8E6CF", "#7FCDCD"],
    words: [
      { word: "Feliz", image: require("../../../assets/words/feliz.png") },
      { word: "Triste", image: require("../../../assets/words/triste.png") },
      { word: "Bravo", image: require("../../../assets/words/bravo.png") },
      { word: "Com Medo", image: require("../../../assets/words/medo.png") },
      { word: "Cansado", image: require("../../../assets/words/cansado.png") },
      { word: "Animado", image: require("../../../assets/words/animado.png") },
    ]
  },
  Higiene: {
    icon: "shower",
    emoji: "🧼",
    color: ["#FFD93D", "#6BCF7F"],
    words: [
      { word: "Escova de Dente", image: require("../../../assets/words/escova.png") },
      { word: "Pasta de Dente", image: require("../../../assets/words/pasta.png") },
      { word: "Sabonete", image: require("../../../assets/words/sabonete.png") },
      { word: "Shampoo", image: require("../../../assets/words/shampoo.png") },
      { word: "Toalha", image: require("../../../assets/words/toalha.png") },
      { word: "Pente", image: require("../../../assets/words/escova.png") },
      { word: "Papel Higiênico", image: require("../../../assets/words/higienico.png") },
      { word: "Banho", image: require("../../../assets/words/banho.png") },
      { word: "Vaso Sanitário", image: require("../../../assets/words/vaso.png") },
      { word: "Lenço", image: require("../../../assets/words/lenco.png") },
    ]
  },
  TempoClima: {
    icon: "weather-sunny",
    emoji: "☀️",
    color: ["#74B9FF", "#0984E3"],
    words: [
      { word: "Sol", image: require("../../../assets/words/sol.png") },
      { word: "Chuva", image: require("../../../assets/words/chuva.png") },
      { word: "Frio", image: require("../../../assets/words/frio.png") },
    ]
  },
  Alfabeto: {
    icon: "alphabetical",
    emoji: "🔤",
    color: ["#FD79A8", "#E84393"],
    words: alphabet.map((l) => ({ word: l, image: null }))
  },
  Números: {
    icon: "numeric",
    emoji: "🔢",
    color: ["#FDCB6E", "#E17055"],
    words: numbers.map((n) => ({ word: n, image: null }))
  },
};

export default function PhraseBuilder({ route, navigation }) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>("Básicos");
  const [phrase, setPhrase] = useState<string[]>([]);
  const [animatingWord, setAnimatingWord] = useState<string | null>(null);
  const { gender } = route.params;

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const phraseAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação inicial
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
    ]).start();

    // Animação contínua de bounce
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();

    return () => bounceAnimation.stop();
  }, []);

  useEffect(() => {
    // Animar quando a frase muda
    if (phrase.length > 0) {
      Animated.spring(phraseAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      phraseAnim.setValue(0);
    }
  }, [phrase]);

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
    },
    menina: {
      primary: '#E07A9E',
      secondary: '#F9C8D9',
      background: ['#FCE4EC', '#F8BBD9', '#F48FB1'],
      accent: '#E91E63',
      textColor: '#AD1457',
      cardBg: 'rgba(255,255,255,0.95)',
      shadowColor: '#E91E63',
    }
  };

  const currentTheme = theme[gender] || theme.menino;

  const speakWord = (word: string) => {
    Speech.speak(word, { 
      language: "pt-BR",
      rate: 1.0,
      pitch: 1.1,
    });
  };

  const handleWordPress = (word: string) => {
    setAnimatingWord(word);
    speakWord(word);
    setPhrase((prev) => [...prev, word]);
    
    // Reset animação após um tempo
    setTimeout(() => setAnimatingWord(null), 500);
  };

  const handleSpeakPhrase = () => {
    if (phrase.length > 0) {
      Speech.speak(phrase.join(" "), { 
        language: "pt-BR",
        rate: 0.9,
        pitch: 1.0,
      });
    }
  };

  const handleDeleteLast = () => {
    setPhrase((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClearAll = () => {
    setPhrase([]);
  };

  const renderWordCard = ({ word, image }) => (
    <Animated.View
      key={word}
      style={[
        styles.wordCardWrapper,
        {
          transform: [
            {
              scale: animatingWord === word ? 1.1 : 1,
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.wordCard,
          { 
            backgroundColor: currentTheme.cardBg,
            shadowColor: currentTheme.shadowColor,
          }
        ]}
        onPress={() => handleWordPress(word)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.wordCardGradient}
        >
          <View style={styles.wordImageContainer}>
            {image ? (
              <Image source={image} style={styles.wordImage} />
            ) : (
              <View style={[styles.emptyImage, { backgroundColor: currentTheme.secondary }]}>
                <Text style={[styles.emptyImageText, { color: currentTheme.textColor }]}>
                  {word}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.wordText, { color: currentTheme.textColor }]}>
            {word}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCategoryButton = (categoryKey: string) => {
    const category = categories[categoryKey];
    const isActive = selectedCategory === categoryKey;
    
    return (
      <TouchableOpacity
        key={categoryKey}
        style={styles.categoryButtonWrapper}
        onPress={() => setSelectedCategory(categoryKey as keyof typeof categories)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isActive ? category.color : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
          style={[
            styles.categoryButton,
            isActive && styles.activeCategoryButton,
          ]}
        >
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          <MaterialCommunityIcons 
            name={category.icon as any} 
            size={16} 
            color={isActive ? '#fff' : currentTheme.textColor} 
          />
          <Text
            style={[
              styles.categoryText,
              { color: isActive ? '#fff' : currentTheme.textColor },
              isActive && styles.activeCategoryText,
            ]}
          >
            {categoryKey}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

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
          <Animated.Text 
            style={[
              styles.title, 
              { 
                color: currentTheme.textColor,
                transform: [
                  {
                    translateY: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -5],
                    }),
                  },
                ],
              }
            ]}
          >
            💬 Monte sua frase
          </Animated.Text>
          <Text style={[styles.subtitle, { color: currentTheme.textColor }]}>
            Toque nas palavras para criar frases incríveis!
          </Text>
        </View>
      </Animated.View>

      {/* Categories */}
      <Animated.View 
        style={[
          styles.categoriesContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {Object.keys(categories).map(renderCategoryButton)}
        </ScrollView>
      </Animated.View>

      {/* Words Grid */}
      <Animated.View 
        style={[
          styles.wordsSection,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.wordsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wordsGrid}>
            {categories[selectedCategory].words.map(renderWordCard)}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Phrase Display */}
      <Animated.View 
        style={[
          styles.phraseSection,
          {
            opacity: fadeAnim,
            transform: [
              { 
                scale: phraseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                })
              }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={[currentTheme.cardBg, 'rgba(255,255,255,0.8)']}
          style={[styles.phraseContainer, { shadowColor: currentTheme.shadowColor }]}
        >
          <View style={styles.phraseHeader}>
            <MaterialCommunityIcons 
              name="message-text" 
              size={20} 
              color={currentTheme.textColor} 
            />
            <Text style={[styles.phraseLabel, { color: currentTheme.textColor }]}>
              Sua frase:
            </Text>
            {phrase.length > 0 && (
              <View style={[styles.wordCount, { backgroundColor: currentTheme.accent }]}>
                <Text style={styles.wordCountText}>{phrase.length}</Text>
              </View>
            )}
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.phraseScroll}
          >
            <View style={styles.phraseWordsContainer}>
              {phrase.length > 0 ? (
                phrase.map((word, index) => (
                  <View key={`${word}-${index}`} style={[styles.phraseWord, { backgroundColor: currentTheme.secondary }]}>
                    <Text style={[styles.phraseWordText, { color: currentTheme.textColor }]}>
                      {word}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={[styles.emptyPhraseText, { color: currentTheme.textColor }]}>
                  Toque nas palavras para começar... ✨
                </Text>
              )}
            </View>
          </ScrollView>
        </LinearGradient>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.actionsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.speakButton,
            phrase.length === 0 && styles.disabledButton,
          ]}
          onPress={handleSpeakPhrase}
          disabled={phrase.length === 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={phrase.length > 0 ? ['#4ECDC4', '#44A08D'] : ['#CCCCCC', '#999999']}
            style={styles.actionButtonGradient}
          >
            <MaterialCommunityIcons name="volume-high" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Falar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
            phrase.length === 0 && styles.disabledButton,
          ]}
          onPress={handleDeleteLast}
          disabled={phrase.length === 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={phrase.length > 0 ? ['#FFB74D', '#FF9800'] : ['#CCCCCC', '#999999']}
            style={styles.actionButtonGradient}
          >
            <MaterialCommunityIcons name="backspace" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Apagar</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.clearButton,
            phrase.length === 0 && styles.disabledButton,
          ]}
          onPress={handleClearAll}
          disabled={phrase.length === 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={phrase.length > 0 ? ['#FF6B9D', '#E91E63'] : ['#CCCCCC', '#999999']}
            style={styles.actionButtonGradient}
          >
            <MaterialCommunityIcons name="delete-sweep" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Limpar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },

  // Categories
  categoriesContainer: {
    paddingBottom: 15,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButtonWrapper: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  activeCategoryButton: {
    elevation: 6,
    shadowOpacity: 0.2,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    fontWeight: 'bold',
  },

  // Words
  wordsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wordsContainer: {
    paddingBottom: 20,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordCardWrapper: {
    width: screenWidth / 4 - 20,
    marginBottom: 15,
  },
  wordCard: {
    borderRadius: 16,
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  wordCardGradient: {
    padding: 12,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  wordImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  emptyImage: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },

  // Phrase
  phraseSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  phraseContainer: {
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    minHeight: 80,
  },
  phraseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  phraseLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  wordCount: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  phraseScroll: {
    maxHeight: 60,
  },
  phraseWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  phraseWord: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  phraseWordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyPhraseText: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.7,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  disabledButton: {
    elevation: 3,
    shadowOpacity: 0.1,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});