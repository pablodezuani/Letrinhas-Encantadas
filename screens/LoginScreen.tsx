import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import * as Speech from 'expo-speech';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const avatarsMenino = [
  { name: 'Dudu Dino', image: require('../assets/login/dino.png') },
  { name: 'Lolo Panda', image: require('../assets/login/panda.png') },
  { name: 'BipBop', image: require('../assets/login/robot.png') },
  { name: 'Felix', image: require('../assets/login/feliz.png') },
];

const avatarsMenina = [
  { name: 'Lili', image: require('../assets/login/girl1.png') },
  { name: 'Mimi', image: require('../assets/login/girl2.png') },
  { name: 'Cacau', image: require('../assets/login/girl3.png') },
  { name: 'Estrelinha', image: require('../assets/login/girl4.png') },
];

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<'menino' | 'menina' | null>(null);

  const handleGenderSelect = (gender: 'menino' | 'menina') => {
    setSelectedGender(gender);
    setSelectedAvatar(null);
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
      navigation.navigate('Home', {
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

 
  const backgroundColor = selectedGender === 'menina' ? '#FDF6F0' : '#F3FAFF';
  const textColor = selectedGender === 'menina' ? '#4D4D4D' : '#333333';
  const cardColor = selectedGender === 'menina' ? '#F9C8D9' : '#A5D8FF';
  const cardSelectedColor = selectedGender === 'menina' ? '#F9C8D9' : '#A1C6F1';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
    {selectedGender && (
  <Text style={[styles.title, { color: textColor }]}>
    {selectedGender === 'menina' ? 'Escolha sua amiga' : 'Escolha seu amigo'}
  </Text>
)}

      {!selectedGender && (
        <View style={styles.genderContainer}>
          <TouchableOpacity
  style={[styles.genderButton, styles.boyButton]}
  onPress={() => handleGenderSelect('menino')}
>
  <Text style={styles.genderText}>Sou Menino</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.genderButton, styles.girlButton]}
  onPress={() => handleGenderSelect('menina')}
>
  <Text style={styles.genderText}>Sou Menina</Text>
</TouchableOpacity>
        </View>
      )}

      {selectedGender && (
        <>
          <FlatList
            data={currentAvatars}
            numColumns={2}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.avatarList}
            columnWrapperStyle={styles.avatarRow}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleAvatarSelect(index)}
                style={[
                  styles.avatarContainer,
                  { backgroundColor: cardColor },
                  selectedAvatar === index && {
                    backgroundColor: cardSelectedColor,
                    borderColor: textColor,
                    transform: [{ scale: 1.05 }],
                  },
                ]}
              >
                <Image source={item.image} style={styles.avatar} />
                <Text style={[styles.avatarName, { color: textColor }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

         <TouchableOpacity
  onPress={handleLogin}
  style={[
    styles.loginButton,
    selectedGender === 'menina' && styles.loginButtonGirl,
    selectedGender === 'menino' && styles.loginButtonBoy,
    selectedAvatar === null && styles.disabledButton
  ]}
  disabled={selectedAvatar === null}
>
  <Text style={styles.loginText}>Vamos jogar!</Text>
</TouchableOpacity>

          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',       // centraliza horizontalmente
    justifyContent: 'center',   // centraliza verticalmente
    // Remover paddingTop e paddingBottom para não quebrar a centralização
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',              // garante que o texto ocupe a largura toda para centralizar o texto
  },
  genderContainer: {
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',       // centraliza os botões
  },
  genderButton: {
    backgroundColor: '#FFF0D9',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FF8C42',
  },
  genderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8C42',
    textAlign: 'center',        // centraliza o texto dentro do botão
  },
  avatarList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 10,
  },
  avatarRow: {
    justifyContent: 'space-around',
  },
  avatarContainer: {
    margin: 12,
    padding: 16,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
    elevation: 4,
    alignItems: 'center',
    width: windowWidth * 0.4,
  },
  avatar: {
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    resizeMode: 'contain',
  },
  avatarName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginButton: {
    marginTop: 10,

    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 50,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#FFD4A3',
  },
  loginText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#ffffff88',
  },
  boyButton: {
  backgroundColor: '#A5D8FF',
  borderColor: '#4D9DE0',
},
girlButton: {
  backgroundColor: '#F9C8D9',
  borderColor: '#E07A9E',
},
loginButtonGirl: {
  backgroundColor: '#E07A9E',
},
loginButtonBoy: {
  backgroundColor: '#4D9DE0',
},
  backButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
