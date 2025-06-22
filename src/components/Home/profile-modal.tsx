"use client"
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { User } from "../../lib/types"


const { width: SCREEN_WIDTH } = Dimensions.get("window")

interface ProfileModalProps {
  user: User
  visible: boolean
  onClose: () => void
}

export function ProfileModal({ user, visible, onClose }: ProfileModalProps) {
  const menuItems = [
    { icon: "person-outline", title: "Editar perfil", action: () => {} },
    { icon: "settings-outline", title: "Configurações", action: () => {} },
    { icon: "notifications-outline", title: "Notificações", action: () => {} },
    { icon: "help-circle-outline", title: "Ajuda e suporte", action: () => {} },
    { icon: "information-circle-outline", title: "Sobre o app", action: () => {} },
  ]

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.touchable} onPress={onClose}>
          <View style={styles.modalContent}>
            <LinearGradient colors={["#6C63FF", "#4834D4"]} style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>

              <View style={styles.avatar}>
                <Text style={styles.initial}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.joinDate}>Membro desde {new Date(user.joinDate).toLocaleDateString("pt-BR")}</Text>
            </LinearGradient>

            <View style={styles.actions}>
              {menuItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.action} onPress={item.action}>
                  <View style={styles.actionIconContainer}>
                    <Ionicons name={item.icon as any} size={24} color="#6C63FF" />
                  </View>
                  <Text style={styles.actionText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                onClose()
                setTimeout(() => console.log("Logout"), 300)
              }}
            >
              <LinearGradient colors={["#FF5252", "#F44336"]} style={styles.logoutGradient}>
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.logoutText}>Sair da conta</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  touchable: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 24,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 32,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  initial: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    textAlign: "center",
  },
  joinDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  actions: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  logoutButton: {
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
})
