import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY"
          source={require('../../../assets/letrinhas.png')}
          style={{ width: '50%' }}
          resizeMode="contain"
        />
      </View>
      <Animatable.View
        delay={600}
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Text style={styles.title}>Seja Bem vindo a Letrinhas Encantadas</Text>
    <Text style={styles.text}>
  Este é um espaço mágico criado com carinho 💖{'\n'}
  para ajudar crianças a se expressarem melhor 🗣️✨{'\n\n'}

</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('login')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffefe7', 
  },
  containerLogo: {
    flex: 2,
    backgroundColor: '#ffefe7', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    flex: 1,
    backgroundColor: '#305F72',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 28,
    marginBottom: 12,
    color: '#305F72 ', // Texto escuro para contraste
  },
  text: {
    color: '#ffe8d3', // Texto escuro para contraste
  },
  button: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: '#CBAACB',
    paddingVertical: 8,
    width: '60%',
    alignSelf: 'center',
    bottom: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#ffe8d3',
    fontWeight: 'bold',
  },
});