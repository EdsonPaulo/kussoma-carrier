import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import React, { useContext, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import AuthContext from '../contexts/auth/auth-context';
import Splash from '../screens/Auth/Splash';
import AuthNavigation from './AuthNavigation';
import CarrierNavigation from './CarrierNavigation';
import CustomerNavigation from './CustomerNavigation';

export default index = () => {
  const { isLogged, isLoading, role, retrieveToken } = useContext(AuthContext);
  const notificationListener = useRef();
  const responseListener = useRef();

  const bootstrapAsync = async () => retrieveToken();

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Chegou uma nova Notificação: ', notification);
      },
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(response);
      },
    );

    bootstrapAsync();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const RootStack = createStackNavigator();
  return (
    <NavigationContainer>
      <>
        {
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {isLoading ? (
              <RootStack.Screen name="splash" component={Splash} />
            ) : !isLogged ? (
              <RootStack.Screen name="auth" component={AuthNavigation} />
            ) : role === 'ROLE_AUTONOMO' ? (
              <RootStack.Screen name="carrier" component={CarrierNavigation} />
            ) : role === 'ROLE_CLIENTE' ? (
              <RootStack.Screen
                name="customer"
                component={CustomerNavigation}
              />
            ) : (
              <RootStack.Screen name="auth" component={AuthNavigation} />
            )}
          </RootStack.Navigator>
        }
      </>
    </NavigationContainer>
  );
};
