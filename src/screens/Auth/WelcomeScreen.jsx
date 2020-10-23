import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageBackground, StatusBar, View } from 'react-native';
import logo from '../../../assets/icon.png';
import bgImage from '../../assets/bg-truck1.jpg';
import { CustomButton } from '../../components';
import { Container, SafeArea, Text } from './styles';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeArea>
      <StatusBar translucent={true} />
      <ImageBackground
        style={{ width: '100%', height: '100%' }}
        source={bgImage}
      >
        <View style={{ flex: 1, backgroundColor: '#000000ba', padding: 15 }}>
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
                fontSize="34px"
                bold
              >
                KUSSOMA
              </Text>
              <Text textAlign="center" marginTop="10px" fontSize="17px">
                Melhor solução para fretes e logística
              </Text>
            </View>
            <View>
              <CustomButton
                primary
                title="INICIAR SESSÃO"
                onPress={() => navigation.navigate('login')}
              />
              <CustomButton
                title="CRIAR CONTA"
                onPress={() => navigation.navigate('register')}
              />
              <Text textAlign="center" marginTop="40px" fontSize="12px">
                © {new Date().getFullYear()} - Kussoma
              </Text>
            </View>
          </Container>
        </View>
      </ImageBackground>
    </SafeArea>
  );
};

export default WelcomeScreen;
