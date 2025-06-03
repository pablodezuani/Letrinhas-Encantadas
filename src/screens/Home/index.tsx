import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const mockChildren = [
  { id: '1', name: 'Maria', nickname: 'Mari', image: require('../../../assets/animals/gato.png'), gender: 'female', bio: 'Adora pintar e brincar com amigos.' },
  { id: '2', name: 'Lucas', nickname: 'Lu', image: require('../../../assets/animals/gato.png'), gender: 'male', bio: 'Curte futebol e videogames.' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  const [selectedChild, setSelectedChild] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const openModal = (child) => {
    setSelectedChild(child);
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedChild(null);
    });
  };

  const handleSignOut = () => {
    Alert.alert('Sair', 'Deseja mesmo sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityRole="header"
              accessible={true}
            >
              Olá, {user.name}!
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.logoutButton}
            activeOpacity={0.7}
            accessibilityLabel="Sair do aplicativo"
            accessibilityHint="Clique para sair"
          >
            <Ionicons name="log-out-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* LISTA DE CRIANÇAS */}
        <FlatList
          data={mockChildren}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isMale = item.gender === 'male';
            return (
              <View style={[styles.card, isMale ? styles.maleCard : styles.femaleCard]}>
                <View style={[styles.avatarContainer, isMale ? styles.maleAvatarBorder : styles.femaleAvatarBorder]}>
                  <Image source={item.image} style={styles.avatar} />
                  <View style={styles.sticker}>
                    <Text style={{ fontSize: 16 }}>{isMale ? '⚽' : '🎨'}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.name, isMale ? styles.maleText : styles.femaleText]} numberOfLines={1} ellipsizeMode="tail">
                    {isMale ? '👦' : '👧'} {item.name}
                  </Text>
                  <Text style={styles.nickname} numberOfLines={1} ellipsizeMode="tail">
                    Apelido carinhoso: <Text style={styles.nicknameHighlight}>{item.nickname}</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => openModal(item)}
                  style={[styles.detailsButton, isMale ? styles.maleDetailsBtn : styles.femaleDetailsBtn]}
                >
                  <Ionicons name="information-circle-outline" size={22} color={isMale ? '#0077FF' : '#FF6B81'} />
                </TouchableOpacity>
              </View>
            );
          }}
        />

        {/* BOTÃO ADICIONAR */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddChildScreen')}
          activeOpacity={0.7}
          accessibilityLabel="Adicionar criança"
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>

        {/* MODAL DETALHES */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
              {selectedChild && (
                <ScrollView
                  contentContainerStyle={styles.modalScrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedChild.name}</Text>
                    <TouchableOpacity onPress={closeModal} accessibilityLabel="Fechar modal" accessibilityHint="Fecha a janela de detalhes">
                      <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <Image source={selectedChild.image} style={styles.modalAvatar} resizeMode="contain" />
                  <Text style={styles.modalNickname}>
                    Apelido: <Text style={styles.nicknameHighlight}>{selectedChild.nickname}</Text>
                  </Text>
                  <Text style={styles.modalBio}>{selectedChild.bio}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={closeModal} activeOpacity={0.7}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 40,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  titleContainer: {
    flex: 1,
    maxWidth: '85%',
    marginRight: 10,
  },
  title: {
    fontSize: SCREEN_WIDTH > 350 ? 24 : 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // CARTÃO CRIANÇA
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  maleCard: {
    backgroundColor: '#DCEEFB',
  },
  femaleCard: {
    backgroundColor: '#FDEFF4',
  },
  avatarContainer: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: (SCREEN_WIDTH * 0.15) / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
  },
  maleAvatarBorder: {
    borderWidth: 3,
    borderColor: '#0077FF',
  },
  femaleAvatarBorder: {
    borderWidth: 3,
    borderColor: '#FF6B81',
  },
  avatar: {
    width: SCREEN_WIDTH * 0.13,
    height: SCREEN_WIDTH * 0.13,
    borderRadius: (SCREEN_WIDTH * 0.13) / 2,
  },
  sticker: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    minWidth: 0, // importante para o texto respeitar o flexbox e truncar
  },
  name: {
    fontSize: SCREEN_WIDTH > 350 ? 20 : 16,
    fontWeight: '700',
  },
  maleText: {
    color: '#0077FF',
  },
  femaleText: {
    color: '#FF6B81',
  },
  nickname: {
    fontSize: SCREEN_WIDTH > 350 ? 14 : 12,
    color: '#777',
    marginTop: 2,
  },
  nicknameHighlight: {
    fontWeight: 'bold',
    color: '#FF6B81',
  },
  detailsButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  maleDetailsBtn: {
    borderColor: '#0077FF',
  },
  femaleDetailsBtn: {
    borderColor: '#FF6B81',
  },

  // BOTÃO ADD
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3A86FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    maxHeight: SCREEN_HEIGHT * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  modalAvatar: {
    width: '100%',
    height: SCREEN_WIDTH * 0.8,
    borderRadius: 16,
    marginBottom: 16,
  },
  modalNickname: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalBio: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#3A86FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
