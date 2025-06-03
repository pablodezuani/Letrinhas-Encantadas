import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../screens/welcome";
import ForgotPasswordScreen from "../screens/reset";
import CadastroScreen from "../screens/create";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();
 function AuthRoutes(){

return(

<Stack.Navigator>
    <Stack.Screen
    name="welcome"
    component={Welcome}
    options={{headerShown: false}}
    />

<Stack.Screen
    name="login"
    component={Login}
    options={{headerShown: false}}
    />


<Stack.Screen
    name="ForgotPasswordScreen"
    component={ForgotPasswordScreen}
    options={{headerShown: false}}
    />

<Stack.Screen
    name="Create"
    component={CadastroScreen}
    options={{headerShown: false}}
    />

</Stack.Navigator>

)
}

export default AuthRoutes;

