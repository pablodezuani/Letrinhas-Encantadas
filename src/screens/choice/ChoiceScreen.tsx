import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const avatarsMenino = [
  { 
    name: 'Dudu Dino', 
    image: require('../../../assets/login/dino.png'), 
    emoji: '🦕',
    personality: 'Aventureiro',
    description: 'Adora explorar!'
  },
  { 
    name: 'Lolo Panda', 
    image: require('../../../assets/login/panda.png'), 
    emoji: '🐼',
    personality: 'Tranquilo',
    description: 'Muito sábio'
  },
  { 
    name: 'BipBop', 
    image: require('../../../assets/login/robot.png'), 
    emoji: '🤖',
    personality: 'Inteligente',
    description: 'Ama tecnologia'
  },
  { 
    name: 'Felix', 
    image: require('../../../assets/login/feliz.png'), 
    emoji: '😊',
    personality: 'Alegre',
    description: 'Sempre sorrindo'
  },
];

const avatarsMenina = [
  { 
    name: 'Lili', 
    image: require('../../../assets/login/girl1.png'), 
    emoji: '🌸',
    personality: 'Delicada',
    description: 'Ama flores'
  },
  { 
    name: 'Mimi', 
    image: require('../../../assets/login/girl2.png'), 
    emoji: '🦄',
    personality: 'Mágica',
    description: 'Cheia de sonhos'
  },
  { 
    name: 'Cacau', 
    image: require('../../../assets/login/girl3.png'), 
    emoji: '🍫',
    personality: 'Doce',
    description: 'Muito carinhosa'
  },
  { 
    name: 'Estrelinha', 
    image: require('../../../assets/login/girl4.png'), 
    emoji: '⭐',
    personality: 'Brilhante',
    description: 'Ilumina tudo'
  },
];

const ChoiceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<'menino' | 'menina' | null>(null);
  const [showAvatarDetails, setShowAvatarDetails] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const avatarBounceAnim = useRef(new Animated.Value(0)).current;
  const detailsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação inicial mais elaborada
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação contínua de flutuação
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(avatarBounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(avatarBounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation.start();

    return () => floatingAnimation.stop();
  }, []);

  useEffect(() => {
    if (selectedGender) {
      Animated.parallel([
        Animated.spring(titleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(detailsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      titleAnim.setValue(0);
      detailsAnim.setValue(0);
    }
  }, [selectedGender]);

  const handleGenderSelect = (gender: 'menino' | 'menina') => {
    setSelectedGender(gender);
    setSelectedAvatar(null);
    setShowAvatarDetails(false);
    
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
    ]).start();
  };

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    setShowAvatarDetails(true);
    
    const avatarName = selectedGender === 'menina' ? avatarsMenina[index].name : avatarsMenino[index].name;
    
    Speech.speak(`Olá! Eu sou ${avatarName}`, {
      language: 'pt-BR',
      rate: 1.0,
      pitch: 1.2,
    });

    // Animação de seleção
    Animated.spring(detailsAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = () => {
    if (selectedAvatar !== null && selectedGender) {
      // Animação de saída
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.navigate('ChildScreen', {
          avatarId: selectedAvatar,
          gender: selectedGender,
        });
      });
    }
  };

  const handleBack = () => {
    if (showAvatarDetails) {
      setShowAvatarDetails(false);
      setSelectedAvatar(null);
    } else {
      setSelectedGender(null);
      setSelectedAvatar(null);
      setShowAvatarDetails(false);
    }
  };

  const currentAvatars = selectedGender === 'menina' ? avatarsMenina : avatarsMenino;
  const selectedAvatarData = selectedAvatar !== null ? currentAvatars[selectedAvatar] : null;

  // Temas aprimorados
  const theme = {
    menino: {
      primary: '#4D9DE0',
      secondary: '#A5D8FF',
      background: ['#E3F2FD', '#BBDEFB', '#90CAF9'],
      cardGradient: ['#A5D8FF', '#81C7F5'],
      selectedGradient: ['#4D9DE0', '#2196F3'],
      accentGradient: ['#42A5F5', '#1E88E5'],
      textColor: '#1565C0',
      lightText: '#42A5F5',
      shadowColor: '#2196F3',
    },
    menina: {
      primary: '#E07A9E',
      secondary: '#F9C8D9',
      background: ['#FCE4EC', '#F8BBD9', '#F48FB1'],
      cardGradient: ['#F9C8D9', '#F48FB1'],
      selectedGradient: ['#E07A9E', '#E91E63'],
      accentGradient: ['#F06292', '#E91E63'],
      textColor: '#AD1457',
      lightText: '#E91E63',
      shadowColor: '#E91E63',
    },
    neutral: {
      primary: '#FF8C42',
      secondary: '#FFF0D9',
      background: ['#FFF8E1', '#FFECB3', '#FFE082'],
      cardGradient: ['#FFE0B2', '#FFCC80'],
      selectedGradient: ['#FF8C42', '#FF9800'],
      accentGradient: ['#FFB74D', '#FF9800'],
      textColor: '#E65100',
      lightText: '#FF9800',
      shadowColor: '#FF9800',
    }
  };

  const currentTheme = selectedGender ? theme[selectedGender] : theme.neutral;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Background Gradient Aprimorado */}
      <LinearGradient
        colors={currentTheme.background}
        style={styles.backgroundGradient}
      />

      {/* Partículas Flutuantes */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${15 + index * 15}%`,
                top: `${10 + (index % 3) * 25}%`,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [
                  {
                    translateY: avatarBounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -20 - index * 5],
                    }),
                  },
                  {
                    rotate: avatarBounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={currentTheme.cardGradient}
              style={styles.particleGradient}
            />
          </Animated.View>
        ))}
      </View>

      {/* Header Aprimorado */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {(selectedGender || showAvatarDetails) && (
          <TouchableOpacity onPress={handleBack} style={[styles.backButtonHeader, { shadowColor: currentTheme.shadowColor }]}>
            <Ionicons name="arrow-back" size={24} color={currentTheme.textColor} />
          </TouchableOpacity>
        )}
        
        <Animated.View style={styles.titleContainer}>
          <Animated.Text 
            style={[
              styles.mainTitle, 
              { 
                color: currentTheme.textColor,
                opacity: selectedGender ? titleAnim : 1,
                transform: [{
                  scale: selectedGender ? titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  }) : 1
                }]
              }
            ]}
          >
            {showAvatarDetails && selectedAvatarData
              ? `✨ Olá, ${selectedAvatarData.name}!`
              : selectedGender 
                ? (selectedGender === 'menina' ? '🌟 Escolha sua amiga' : '🚀 Escolha seu amigo')
                : '👋 Olá! Quem é você?'
            }
          </Animated.Text>
          
          {!selectedGender && (
            <Animated.Text 
              style={[
                styles.welcomeSubtitle, 
                { 
                  color: currentTheme.lightText,
                  opacity: fadeAnim,
                }
              ]}
            >
              Vamos começar nossa aventura juntos! 🎉
            </Animated.Text>
          )}
        </Animated.View>
      </Animated.View>

      {/* Conteúdo Principal */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {!selectedGender ? (
            // Seleção de Gênero Aprimorada
            <View style={styles.genderContainer}>
              <Text style={[styles.subtitle, { color: currentTheme.lightText }]}>
                Escolha uma opção para começar sua jornada
              </Text>
              
              <View style={styles.genderButtonsContainer}>
                <TouchableOpacity
                  style={styles.genderButtonWrapper}
                  onPress={() => handleGenderSelect('menino')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={theme.menino.cardGradient}
                    style={styles.genderButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.genderButtonContent}>
                      <View style={styles.genderEmojiContainer}>
                        <Text style={styles.genderEmoji}>👦</Text>
                        <View style={styles.genderSparkles}>
                          <Text style={styles.sparkle}>✨</Text>
                        </View>
                      </View>
                      <Text style={[styles.genderText, { color: theme.menino.textColor }]}>
                        Sou Menino
                      </Text>
                      <Text style={[styles.genderDescription, { color: theme.menino.textColor }]}>
                        Aventuras incríveis te esperam!
                      </Text>
                      <View style={[styles.genderIndicator, { backgroundColor: theme.menino.primary }]} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.genderButtonWrapper}
                  onPress={() => handleGenderSelect('menina')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={theme.menina.cardGradient}
                    style={styles.genderButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.genderButtonContent}>
                      <View style={styles.genderEmojiContainer}>
                        <Text style={styles.genderEmoji}>👧</Text>
                        <View style={styles.genderSparkles}>
                          <Text style={styles.sparkle}>💫</Text>
                        </View>
                      </View>
                      <Text style={[styles.genderText, { color: theme.menina.textColor }]}>
                        Sou Menina
                      </Text>
                      <Text style={[styles.genderDescription, { color: theme.menina.textColor }]}>
                        Momentos mágicos te aguardam!
                      </Text>
                      <View style={[styles.genderIndicator, { backgroundColor: theme.menina.primary }]} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : showAvatarDetails && selectedAvatarData ? (
            // Detalhes do Avatar Selecionado
            <Animated.View 
              style={[
                styles.avatarDetailsContainer,
                {
                  opacity: detailsAnim,
                  transform: [
                    {
                      scale: detailsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                }
              ]}
            >
              <LinearGradient
                colors={currentTheme.selectedGradient}
                style={styles.avatarDetailsCard}
              >
                <View style={styles.avatarDetailsContent}>
                  <Animated.View 
                    style={[
                      styles.avatarDetailsImageContainer,
                      {
                        transform: [
                          {
                            translateY: avatarBounceAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0, -10],
                            }),
                          },
                        ],
                      }
                    ]}
                  >
                    <Image source={selectedAvatarData.image} style={styles.avatarDetailsImage} />
                    <View style={styles.avatarDetailsGlow} />
                  </Animated.View>
                  
                  <View style={styles.avatarDetailsInfo}>
                    <Text style={styles.avatarDetailsEmoji}>{selectedAvatarData.emoji}</Text>
                    <Text style={styles.avatarDetailsName}>{selectedAvatarData.name}</Text>
                    <Text style={styles.avatarDetailsPersonality}>{selectedAvatarData.personality}</Text>
                    <Text style={styles.avatarDetailsDescription}>{selectedAvatarData.description}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ) : (
            // Seleção de Avatar Aprimorada
            <View style={styles.avatarSection}>
              <Animated.Text 
                style={[
                  styles.avatarSectionTitle,
                  { 
                    color: currentTheme.textColor,
                    opacity: detailsAnim,
                  }
                ]}
              >
                Toque em um amigo para conhecê-lo melhor! 😊
              </Animated.Text>
              
              <FlatList
                data={currentAvatars}
                numColumns={2}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.avatarList}
                columnWrapperStyle={styles.avatarRow}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <Animated.View
                    style={[
                      styles.avatarWrapper,
                      {
                        opacity: detailsAnim,
                        transform: [
                          {
                            translateY: detailsAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleAvatarSelect(index)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={selectedAvatar === index ? currentTheme.selectedGradient : currentTheme.cardGradient}
                        style={[
                          styles.avatarContainer,
                          selectedAvatar === index && styles.avatarSelected,
                          { shadowColor: currentTheme.shadowColor }
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {selectedAvatar === index && (
                          <View style={styles.selectedBadge}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </View>
                        )}
                        
                        <Animated.View 
                          style={[
                            styles.avatarImageContainer,
                            {
                              transform: [
                                {
                                  translateY: avatarBounceAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -5],
                                  }),
                                },
                              ],
                            }
                          ]}
                        >
                          <Image source={item.image} style={styles.avatar} />
                          {selectedAvatar === index && (
                            <View style={styles.avatarGlow} />
                          )}
                        </Animated.View>
                        
                        <View style={styles.avatarInfo}>
                          <Text style={styles.avatarEmoji}>{item.emoji}</Text>
                          <Text style={[
                            styles.avatarName, 
                            { 
                              color: selectedAvatar === index ? '#fff' : currentTheme.textColor,
                              fontWeight: selectedAvatar === index ? 'bold' : '600'
                            }
                          ]}>
                            {item.name}
                          </Text>
                          <Text style={[
                            styles.avatarPersonality,
                            { 
                              color: selectedAvatar === index ? 'rgba(255,255,255,0.9)' : currentTheme.lightText,
                            }
                          ]}>
                            {item.personality}
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Botões de Ação Aprimorados */}
      {selectedGender && (
        <Animated.View 
          style={[
            styles.actionButtons,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {showAvatarDetails ? (
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButtonWrapper}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={currentTheme.accentGradient}
                style={styles.loginButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons 
                  name="rocket-launch" 
                  size={24} 
                  color="#fff" 
                  style={styles.loginIcon} 
                />
                <Text style={styles.loginText}>Vamos começar!</Text>
                <View style={styles.buttonSparkle}>
                  <Text style={styles.sparkleText}>✨</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setShowAvatarDetails(false)}
              style={[
                styles.loginButtonWrapper,
                selectedAvatar === null && styles.disabledButtonWrapper
              ]}
              disabled={selectedAvatar === null}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedAvatar !== null ? currentTheme.selectedGradient : ['#CCCCCC', '#999999']}
                style={styles.loginButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons 
                  name="heart" 
                  size={24} 
                  color="#fff" 
                  style={styles.loginIcon} 
                />
                <Text style={styles.loginText}>
                  {selectedAvatar !== null ? 'Conhecer melhor!' : 'Escolha um amigo'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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
  
  // Partículas Flutuantes
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },

  // Header Aprimorado
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonHeader: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },

  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
    fontWeight: '500',
  },

  // Seleção de Gênero Aprimorada
  genderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: windowHeight * 0.6,
  },
  genderButtonsContainer: {
    width: '100%',
    gap: 25,
  },
  genderButtonWrapper: {
    borderRadius: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  genderButton: {
    borderRadius: 25,
    padding: 25,
  },
  genderButtonContent: {
    alignItems: 'center',
    position: 'relative',
  },
  genderEmojiContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  genderEmoji: {
    fontSize: 56,
  },
  genderSparkles: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  sparkle: {
    fontSize: 20,
  },
  genderText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  genderDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
    fontWeight: '500',
  },
  genderIndicator: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },

  // Seleção de Avatar Aprimorada
  avatarSection: {
    flex: 1,
    paddingTop: 20,
  },
  avatarSectionTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
    opacity: 0.9,
  },
  avatarList: {
    paddingBottom: 20,
  },
  avatarRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  avatarWrapper: {
    width: windowWidth * 0.43,
    marginBottom: 20,
  },
  avatarContainer: {
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    position: 'relative',
    minHeight: 180,
    justifyContent: 'space-between',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarSelected: {
    elevation: 12,
    shadowOpacity: 0.25,
    transform: [{ scale: 1.03 }],
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: windowWidth * 0.24,
    height: windowWidth * 0.24,
    resizeMode: 'contain',
  },
  avatarGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: windowWidth * 0.14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: -1,
  },
  avatarInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  avatarPersonality: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Detalhes do Avatar
  avatarDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  avatarDetailsCard: {
    borderRadius: 30,
    padding: 30,
    width: '100%',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  avatarDetailsContent: {
    alignItems: 'center',
  },
  avatarDetailsImageContainer: {
    position: 'relative',
    marginBottom: 25,
  },
  avatarDetailsImage: {
    width: windowWidth * 0.35,
    height: windowWidth * 0.35,
    resizeMode: 'contain',
  },
  avatarDetailsGlow: {
    position: 'absolute',
    top: -15,
    left: -15,
    right: -15,
    bottom: -15,
    borderRadius: windowWidth * 0.2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: -1,
  },
  avatarDetailsInfo: {
    alignItems: 'center',
  },
  avatarDetailsEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  avatarDetailsName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  avatarDetailsPersonality: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontWeight: '600',
  },
  avatarDetailsDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Botões de Ação Aprimorados
  actionButtons: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  loginButtonWrapper: {
    borderRadius: 30,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  disabledButtonWrapper: {
    elevation: 6,
    shadowOpacity: 0.15,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: 'relative',
  },
  loginIcon: {
    marginRight: 10,
  },
  loginText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonSparkle: {
    position: 'absolute',
    top: -5,
    right: 15,
  },
  sparkleText: {
    fontSize: 16,
  },
});

export default ChoiceScreen;