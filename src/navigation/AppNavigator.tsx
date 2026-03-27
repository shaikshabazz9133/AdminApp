import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthStore } from "../store/authStore";
import { RootStackParamList } from "./types";
import { AuthNavigator, MainNavigator } from "./navigators";
import SplashScreen from "../screens/auth/SplashScreen";

const Root = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated } = useAuthStore();
  return (
    <Root.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}
    >
      <Root.Screen name="Splash" component={SplashScreen} />
      {isAuthenticated ? (
        <Root.Screen name="Main" component={MainNavigator} />
      ) : (
        <Root.Screen name="Auth" component={AuthNavigator} />
      )}
    </Root.Navigator>
  );
};

export default AppNavigator;
