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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/navigation';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const avatarsMenino = [
  { name: 'Dudu Dino', image: require('../../../assets/login/dino.png'), emoji: '🦕' },
  { name: 'Lolo Panda', image: require('../../../assets/login/panda.png'), emoji: '🐼' },
  { name: 'BipBop', image: require('../../../assets/login/robot.png'), emoji: '🤖' },
  { name: 'Felix', image: require('../../../assets/login/feliz.png'), emoji: '😊' },
];

const avatarsMenina = [
  { name: 'Lili', image: require('../../../assets/login/girl1.png'), emoji: '🌸' },
  { name: 'Mimi', image: require('../../../assets/login/girl2.png'), emoji: '🦄' },
  { name: 'Cacau', image: require('../../../assets/login/girl3.png'), emoji: '🍫' },
  { name: 'Estrelinha', image: require('../../../assets/login/girl4.png'), emoji: '⭐' },
];

const ChoiceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<'menino' | 'menina' | null>(null);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (selectedGender) {
      // Animação do título quando gênero é selecionado
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      titleAnim.setValue(0);
    }
  }, [selectedGender]);

  const handleGenderSelect = (gender: 'menino' | 'menina') => {
    setSelectedGender(gender);
    setSelectedAvatar(null);
    
    // Feedback tátil
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleAvatarSelect = (index: number) => {
    setSelectedAvatar(index);
    const avatarName =
      selectedGender === 'menina' ? avatarsMenina[index].name : avatarsMenino[index].name;
    
    Speech.speak(avatarName, {
      language: 'pt-BR',
      rate: 1.0,
      pitch: 1.2,
    });
    

  };

  const handleLogin = () => {
    if (selectedAvatar !== null && selectedGender) {
      navigation.navigate('ChildScreen', {
        avatarId: selectedAvatar,
        gender: selectedGender,
      });
    }
  };

  const handleBack = () => {
    setSelectedGender(null);
    setSelectedAvatar(null);
  };

  const currentAvatars = selectedGender === 'menina' ? avatarsMenina : avatarsMenino;

  // Cores dinâmicas baseadas no gênero
  const theme = {
    menino: {
      primary: '#4D9DE0',
      secondary: '#A5D8FF',
      background: ['#E3F2FD', '#F3FAFF'],
      cardGradient: ['#A5D8FF', '#81C7F5'],
      selectedGradient: ['#4D9DE0', '#2196F3'],
      textColor: '#1565C0',
      lightText: '#42A5F5',
    },
    menina: {
      primary: '#E07A9E',
      secondary: '#F9C8D9',
      background: ['#FCE4EC', '#FDF6F0'],
      cardGradient: ['#F9C8D9', '#F48FB1'],
      selectedGradient: ['#E07A9E', '#E91E63'],
      textColor: '#AD1457',
      lightText: '#E91E63',
    },
    neutral: {
      primary: '#FF8C42',
      secondary: '#FFF0D9',
      background: ['#FFF8E1', '#FFFDE7'],
      cardGradient: ['#FFE0B2', '#FFCC80'],
      selectedGradient: ['#FF8C42', '#FF9800'],
      textColor: '#E65100',
      lightText: '#FF9800',
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
      
      {/* Background Gradient */}
      <LinearGradient
        colors={currentTheme.background}
        style={styles.backgroundGradient}
      />

      {/* Header com título animado */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {selectedGender && (
          <TouchableOpacity onPress={handleBack} style={styles.backButtonHeader}>
            <Ionicons name="arrow-back" size={24} color={currentTheme.textColor} />
          </TouchableOpacity>
        )}
        
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
          {selectedGender 
            ? (selectedGender === 'menina' ? '🌟 Escolha sua amiga' : '🚀 Escolha seu amigo')
            : '👋 Olá! Quem é você?'
          }
        </Animated.Text>
      </Animated.View>

      {/* Conteúdo Principal */}
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
          // Seleção de Gênero Melhorada
          <View style={styles.genderContainer}>
            <Text style={[styles.subtitle, { color: currentTheme.lightText }]}>
              Escolha uma opção para começar
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
                    <Text style={styles.genderEmoji}>👦</Text>
                    <Text style={[styles.genderText, { color: theme.menino.textColor }]}>
                      Sou Menino
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
                    <Text style={styles.genderEmoji}>👧</Text>
                    <Text style={[styles.genderText, { color: theme.menina.textColor }]}>
                      Sou Menina
                    </Text>
                    <View style={[styles.genderIndicator, { backgroundColor: theme.menina.primary }]} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Seleção de Avatar Melhorada
          <View style={styles.avatarSection}>
            <FlatList
              data={currentAvatars}
              numColumns={2}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.avatarList}
              columnWrapperStyle={styles.avatarRow}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleAvatarSelect(index)}
                  style={styles.avatarWrapper}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={selectedAvatar === index ? currentTheme.selectedGradient : currentTheme.cardGradient}
                    style={[
                      styles.avatarContainer,
                      selectedAvatar === index && styles.avatarSelected
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {selectedAvatar === index && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                    
                    <View style={styles.avatarImageContainer}>
                      <Image source={item.image} style={styles.avatar} />
                    </View>
                    
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
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </Animated.View>

      {/* Botões de Ação */}
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
          <TouchableOpacity
            onPress={handleLogin}
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
                name="play-circle" 
                size={24} 
                color="#fff" 
                style={styles.loginIcon} 
              />
              <Text style={styles.loginText}>Vamos jogar!</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
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
  },

  // Seleção de Gênero
  genderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderButtonsContainer: {
    width: '100%',
    gap: 20,
  },
  genderButtonWrapper: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  genderButton: {
    borderRadius: 20,
    padding: 20,
  },
  genderButtonContent: {
    alignItems: 'center',
    position: 'relative',
  },
  genderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  genderText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  genderIndicator: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },

  // Seleção de Avatar
  avatarSection: {
    flex: 1,
    paddingTop: 20,
  },
  avatarList: {
    paddingBottom: 20,
  },
  avatarRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  avatarWrapper: {
    width: windowWidth * 0.42,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  avatarContainer: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    minHeight: 160,
    justifyContent: 'space-between',
  },
  avatarSelected: {
    elevation: 10,
    shadowOpacity: 0.2,
    transform: [{ scale: 1.02 }],
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
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
  },
  avatar: {
    width: windowWidth * 0.22,
    height: windowWidth * 0.22,
    resizeMode: 'contain',
  },
  avatarInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  avatarEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Botões de Ação
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  loginButtonWrapper: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabledButtonWrapper: {
    elevation: 3,
    shadowOpacity: 0.1,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  loginIcon: {
    marginRight: 8,
  },
  loginText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChoiceScreen;