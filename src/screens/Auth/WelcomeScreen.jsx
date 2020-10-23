import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import {
  Image,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import logo from '../../../assets/icon.png';
import bgImage from '../../assets/bg-truck1.jpg';
import { CustomButton } from '../../components';
import { colors } from '../../constants';
import { Container, Divider, SafeArea, Text } from './styles';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const modalizeSignUpRef = useRef(null);

  const signUpModal = () => modalizeSignUpRef.current?.open();

  const renderMakeRegisterWith = () => {
    return (
      <View style={{ height: 320, justifyContent: 'center' }}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate('register', { role: 'ROLE_CLIENTE' })
          }
        >
          <Text bold color="#111" fontSize="18px">
            » Cliente
          </Text>
          <Text color={colors.grayDark}>
            Divulgue a sua carga e encontre motorista para transportá-las em
            poucos passos.
          </Text>
        </TouchableOpacity>

        <Divider />

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() =>
            navigation.navigate('register', { role: 'ROLE_AUTONOMO' })
          }
        >
          <Text bold color="#111" fontSize="18px">
            » Motorista
          </Text>
          <Text color={colors.grayDark}>
            Encontre facilmente cargas para transportar para transportar para
            transportar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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
              <CustomButton title="CRIAR CONTA" onPress={signUpModal} />
              <Text textAlign="center" marginTop="40px" fontSize="12px">
                © {new Date().getFullYear()} - Kussoma
              </Text>
            </View>
          </Container>

          <Modalize
            ref={modalizeSignUpRef}
            modalStyle={{ paddingHorizontal: 30 }}
            rootStyle={{ elevation: 15 }}
            modalHeight={350}
          >
            {renderMakeRegisterWith()}
          </Modalize>
        </View>
      </ImageBackground>
    </SafeArea>
  );
};

export default WelcomeScreen;
