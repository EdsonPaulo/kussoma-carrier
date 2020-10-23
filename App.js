import React from 'react';
import { AppLoading } from 'expo';
import { enableScreens } from 'react-native-screens';
enableScreens();
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import 'intl';
import 'intl/locale-data/jsonp/pt-AO';

import {
  useFonts,
  RobotoSlab_400Regular,
  RobotoSlab_500Medium,
  RobotoSlab_600SemiBold,
  RobotoSlab_700Bold,
} from '@expo-google-fonts/roboto-slab';

import Router from './src/routes';
import { colors } from './src/constants';
import AuthProvider from './src/contexts/auth/auth-provider';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.primary,
    text: colors.textDark,
    placeholder: colors.grayMedium,
    background: colors.bgColor,
  },
};

export default function App() {
  let [fontsLoaded] = useFonts({
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    RobotoSlab_600SemiBold,
    RobotoSlab_700Bold,
  });

  if (!fontsLoaded) return <AppLoading />;
  else
    return (
      <PaperProvider theme={theme}>
        <AuthProvider>
          <SafeAreaProvider>
            <Router />
          </SafeAreaProvider>
        </AuthProvider>
      </PaperProvider>
    );
}
