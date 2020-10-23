import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotScreen,
} from '../screens';

const AuthStack = createStackNavigator();
export default AuthNavigation = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="welcome" component={WelcomeScreen} />
    <AuthStack.Screen name="login" component={LoginScreen} />
    <AuthStack.Screen name="register" component={RegisterScreen} />
    <AuthStack.Screen name="forgot" component={ForgotScreen} />
  </AuthStack.Navigator>
);
