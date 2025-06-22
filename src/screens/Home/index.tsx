"use client"

import { useState } from "react"
import { SafeAreaView, StatusBar, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { Child } from "../../lib/types"
import { mockChildren, mockUser } from "../../lib/mock-data"

import { ChildrenList } from "../../components/Home/ChildrenList"
import { ChildModal } from "../../components/Home/ChildModal"
import { ProfileModal } from "../../components/Home/profile-modal"
import { Header } from "../../components/Home/header"

export default function HomeScreen() {
  const navigation = useNavigation()
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchBar, setShowSearchBar] = useState(false)

  const filteredChildren = mockChildren.filter(
    (child) =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.nickname.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const openModal = (child: Child) => {
    setSelectedChild(child)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedChild(null)
  }

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar)
    if (showSearchBar) {
      setSearchQuery("")
    }
  }

  const navigateToAddChild = () => {
    navigation.navigate("AddChildScreen")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient colors={["#F8F9FA", "#E9ECEF"]} style={styles.container}>
        <Header
          user={mockUser}
          children={mockChildren}
          searchQuery={searchQuery}
          showSearchBar={showSearchBar}
          onSearchChange={setSearchQuery}
          onToggleSearch={toggleSearchBar}
          onOpenProfile={() => setProfileModalVisible(true)}
        />

        <ChildrenList
          children={filteredChildren}
          onChildSelect={openModal}
          searchQuery={searchQuery}
          onAddChild={navigateToAddChild}
        />

        {selectedChild && <ChildModal child={selectedChild} visible={modalVisible} onClose={closeModal} />}

        <ProfileModal user={mockUser} visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} />


        <TouchableOpacity style={styles.fab} onPress={navigateToAddChild} activeOpacity={0.8}>
          <LinearGradient colors={["#6C63FF", "#4834D4"]} style={styles.fabGradient}>
            <Ionicons name="add" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#6C63FF",
  },
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  fabGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
})
