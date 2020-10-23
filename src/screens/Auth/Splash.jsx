import React from 'react';
import { View, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { SafeArea, Container, Text } from './styles';
import { colors } from '../../constants';
import bgImage from '../../assets/bg-truck1.jpg';
import logo from '../../../assets/icon.png';

const Splash = ({ text }) => (
  <SafeArea>
    <StatusBar translucent={false} />
    <ImageBackground style={{ width: '100%', height: '100%' }} source={bgImage}>
      <View style={{ flex: 1, backgroundColor: '#000000b8' }}>
        <Container>
          <View>
            <View style={{ height: 80 }}>
              <Image
                source={logo}
                resizeMode="contain"
                style={{ height: '100%', width: '100%' }}
              />
            </View>
            <Text
              textAlign="center"
              marginTop="25px"
              title
              fontSize="38px"
              bold
            >
              KUSSOMA
            </Text>
            <Text textAlign="center" fontSize="17px">
              Melhor solução para fretes e logística
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.textLight} />
            <Text> {text || 'Carregando'}</Text>
          </View>
        </Container>
      </View>
    </ImageBackground>
  </SafeArea>
);

export default Splash;
