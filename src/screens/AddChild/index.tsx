import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function AddChildScreen() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [hasAutism, setHasAutism] = useState<'sim' | 'nao' | null>(null);
  const [autismLevel, setAutismLevel] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Criança</Text>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Escolher Imagem</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
        <Text style={styles.cameraText}>Tirar Foto</Text>
      </TouchableOpacity>

      <TextInput placeholder="Nome" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Apelido" style={styles.input} value={nickname} onChangeText={setNickname} />
      <TextInput placeholder="Idade" style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput placeholder="Dificuldade" style={styles.input} value={difficulty} onChangeText={setDifficulty} />

      <Text style={styles.label}>Tem autismo?</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => setHasAutism('sim')} style={hasAutism === 'sim' ? styles.selected : styles.option}>
          <Text>Sim</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHasAutism('nao')} style={hasAutism === 'nao' ? styles.selected : styles.option}>
          <Text>Não</Text>
        </TouchableOpacity>
      </View>

      {hasAutism === 'sim' && (
        <Picker
          selectedValue={autismLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setAutismLevel(itemValue)}
        >
          <Picker.Item label="Selecione o nível" value="" />
          <Picker.Item label="Leve" value="leve" />
          <Picker.Item label="Moderado" value="moderado" />
          <Picker.Item label="Severo" value="severo" />
        </Picker>
      )}

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  image: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center' },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  cameraButton: {
    alignSelf: 'center',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  cameraText: { fontWeight: 'bold' },
  label: { marginTop: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', gap: 16, marginTop: 8 },
  option: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  selected: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#87cefa',
  },
  picker: { backgroundColor: '#f1f1f1', marginTop: 8 },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#3A86FF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
