import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const LoginScreen2 = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(50)).current;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isBoy = true;

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

  const handleLogin = () => {
    navigation.navigate("Home", { gender: isBoy ? "menino" : "menina" });
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isBoy ? "#A1C6F1" : "#FAD6FF" },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          flex: 1,
          alignItems: "center",
          width: "100%",
        }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bem-vindo, responsável!</Text>
        </View>

        <View style={[styles.speechBubbleWrapper, isLandscape && { top: 10 }]}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Entre para começar a jornada educativa!
            </Text>
          </View>
          <View style={styles.speechTailDown} />
        </View>

        <View style={styles.avatarContainer}>
          <Image
            source={require("../assets/words/sol.png")}
            style={styles.avatarImage}
          />
          <Text style={styles.avatarName}>Login do Pai/Mãe</Text>
        </View>

        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateY: moveAnim }] },
          ]}
        >
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isBoy ? "#4D9DE0" : "#E07A9E" },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Pacifico",
    fontSize: 28,
    color: "#FFFFFF",
    textAlign: "center",
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
    fontSize: 20,
    color: "#3A3897",
    textAlign: "center",
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
  input: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
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
  linkText: {
    marginTop: 10,
    fontSize: 16,
    color: "#3A3897",
    textAlign: "center",
    fontFamily: "Poppins",
  },
});

export default LoginScreen2;
