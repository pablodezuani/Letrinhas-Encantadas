import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen2 from "./screens/LoginScreen2";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ReadingGame from "./screens/ReadingGame";
import VowelsGame from "./screens/VowelsGame";
import WordFormationGame from "./screens/WordFormationGame";
import PhraseBuilder from "./screens/PhraseBuilder";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen2} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ReadingGame" component={ReadingGame} />
        <Stack.Screen name="VowelsGame" component={VowelsGame} />
        <Stack.Screen name="WordFormationGame" component={WordFormationGame} />
        <Stack.Screen name="PhraseBuilder" component={PhraseBuilder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
