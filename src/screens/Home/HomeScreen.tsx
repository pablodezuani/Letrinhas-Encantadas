import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { avatars } from "../../../data/avatars";
import { RootStackParamList } from "../../../types/navigation";


type Props = NativeStackScreenProps<RootStackParamList, "Home">;
const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;

  const gender = route.params?.gender || "menino";
  const avatarId = route.params?.avatarId ?? 0;

  const avatarGroup = avatars[gender] || avatars["menino"];
  const avatar = avatarGroup[avatarId] || avatarGroup[0];

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const isBoy = gender === "menino";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.spring(moveAnim, {
      toValue: 0,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isBoy ? "#A1C6F1" : "#FAD6FF" },
      ]}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          flex: 1,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bem-vindo amiguinho!</Text>
        </View>

        <View style={[styles.speechBubbleWrapper, isLandscape && { top: 10 }]}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>Vamos aprender brincando!</Text>
          </View>
          <View style={styles.speechTailDown} />
        </View>

        <View style={styles.avatarContainer}>
          <Image source={avatar.image} style={styles.avatarImage} />
          <Text style={styles.avatarName}>{avatar.name}</Text>
        </View>

        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateY: moveAnim }] },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isBoy ? "#4D9DE0" : "#E07A9E" },
            ]}
            onPress={() => navigation.navigate("ReadingGame", { gender })}
          >
            <Text style={styles.buttonText}>Jogo de Leitura</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isBoy ? "#6A5ACD" : "#FF7AA2" },
            ]}
            onPress={() => navigation.navigate("PhraseBuilder", { gender })}
          >
            <Text style={styles.buttonText}>Formação de Frases</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isBoy ? "#20B2AA" : "#F78DA7" },
            ]}
            onPress={() => navigation.navigate("VowelsGame", { gender })}
          >
            <Text style={styles.buttonText}>Jogo das Vogais</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isBoy ? "#FFA07A" : "#F06292" },
            ]}
            onPress={() => navigation.navigate("WordFormationGame", { gender })}
          >
            <Text style={styles.buttonText}>Formação de Palavras</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A1C6F1",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Pacifico",
    fontSize: 28,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  speechBubbleWrapper: {
    marginTop: 10,
    alignItems: "center",
    width: "80%",
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    width: "100%",
    borderWidth: 2,
    borderColor: "#3A3897",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  speechText: {
    fontFamily: "Pacifico",
    fontSize: 24,
    color: "#3A3897",
    textAlign: "center",
    lineHeight: 22,
  },
  speechTailDown: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFFFFF",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 50,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FF8C42",
  },
  avatarName: {
    marginTop: 8,
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Poppins",
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontFamily: "Poppins",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default HomeScreen;
