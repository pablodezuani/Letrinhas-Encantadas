import { createNativeStackNavigator } from "@react-navigation/native-stack";



import ReadingGame from "../screens/ReadingGame/ReadingGame";
import VowelsGame from "../screens/VowelsGame/VowelsGame";
import WordFormationGame from "../screens/WordFormationGame/WordFormationGame";
import PhraseBuilder from "../screens/PhraseBuilder/PhraseBuilder";
import ChoiceScreen from "../screens/choice/ChoiceScreen";
import ChildScreen from "../screens/ChildScreen/ChildScreen";
import AddChildScreen from "../screens/AddChild";
import HomeScreen from "../screens/Home";


const Stack = createNativeStackNavigator();
 function AppRoutes(){

return(
<Stack.Navigator>
   
<Stack.Screen
  name="HomeScreen"
  component={HomeScreen}  
  options={{ headerShown: false }}
/>
   < Stack.Screen
    name="ChoiceScreen"
    component={ChoiceScreen}
    options={{headerShown: false}}
    />
	
	<Stack.Screen
    name="ReadingGame"
    component={ReadingGame}
    options={{headerShown: false}}
    />

<Stack.Screen
    name="VowelsGame"
    component={VowelsGame}
    options={{headerShown: false}}
    />
    
    <Stack.Screen
    name="WordFormationGame"
    component={WordFormationGame}
    options={{headerShown: false}}
    />

<Stack.Screen
    name="PhraseBuilder"
    component={PhraseBuilder}
    options={{headerShown: false}}
    />
    

    <Stack.Screen
    name="ChildScreen"
    component={ChildScreen}
    options={{headerShown: false}}
    />


  <Stack.Screen
    name="AddChildScreen"
    component={AddChildScreen}
    options={{headerShown: false}}
    />

    


</Stack.Navigator>

)
}

export default AppRoutes;

