import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  View,
  Image,
  Modal,
  Alert,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';

import logo from '../../../assets/icon.png';
import bgImage from '../../assets/bg-truck1.jpg';
import { CustomButton, CustomInput } from '../../components';
import { colors } from '../../constants';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import { httpErrorHandler, getExpoPushToken } from '../../utils';
import { Container, ModalView, SafeArea, Text } from './styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(authContext);
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const updatUserExpoToken = async token => {
    try {
      let expoToken = await getExpoPushToken();
      expoToken = expoToken?.data;
      console.log('Expo push token a obter: ', expoToken);
      const response = await api(token).post('/expo_token', {
        expo_token: expoToken,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const signIn = async () => {
    if (!emailPhone || !password)
      Alert.alert(
        'Preencha todos os campos',
        'Informe o telefone/email e a senha!',
      );
    else {
      if (password.length < 5)
        Alert.alert('Senha Inválida', 'A senha deve ter 5 ou mais caracteres');
      else {
        setLoading(true);
        try {
          let username = emailPhone.toLowerCase();
          if (!isNaN(emailPhone)) {
            username = `+244${emailPhone}`;
          }
          const response = await api(null).post('/login', {
            email_phone: username,
            password,
          });
          if (response.data) {
            updatUserExpoToken(response.data?.access_token);
            login(
              response.data?.user,
              response.data?.access_token,
              response.data?.user?.role,
            );
          }
        } catch (error) {
          if (error.response?.status == 401 || error.response?.status == 400)
            setErrorModalVisible(true);
          else httpErrorHandler(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <SafeArea>
      <KeyboardAvoidingView
        enabled
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
      >
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={bgImage}
        >
          <View style={{ flex: 1, backgroundColor: '#000000cc' }}>
            <Container>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('welcome')}
              >
                <Icon name="keyboard-backspace" size={30} color="#fff" />
              </TouchableOpacity>

              <View>
                <View style={{ height: 70, marginBottom: 15 }}>
                  <Image
                    source={logo}
                    resizeMode="contain"
                    style={{ height: '100%', width: '100%' }}
                  />
                </View>
                <Text title fontSize="22px" bold textAlign="center">
                  Iniciar Sessão
                </Text>
              </View>

              <View>
                <CustomInput
                  floatLabel
                  type="name"
                  placeholder="Email ou Telefone"
                  showIcon
                  inline
                  light
                  onChangeText={value => setEmailPhone(value)}
                  value={emailPhone}
                />
                <CustomInput
                  floatLabel
                  type="password"
                  placeholder="Senha"
                  showIcon
                  inline
                  light
                  onChangeText={value => setPassword(value)}
                  value={password}
                />
                <CustomButton
                  primary
                  loading={loading}
                  title="ENTRAR"
                  onPress={signIn}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => navigation.navigate('forgot')}
              >
                <Text textAlign="center">Esqueceu a sua senha?</Text>
              </TouchableOpacity>

              <View />
            </Container>
          </View>

          <Modal animationType="slide" transparent visible={errorModalVisible}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <ModalView>
                <Icon
                  name="close-circle-outline"
                  style={{ alignSelf: 'center' }}
                  size={50}
                  color={colors.alert}
                />
                <View style={{ padding: 25, alignItems: 'center' }}>
                  <Text color={colors.textDark}>
                    Telefone ou Senha incorrecta!
                  </Text>
                  <Text color={colors.textDark}>
                    Verifique as suas credenciais.
                  </Text>
                </View>
                <Button onPress={() => setErrorModalVisible(false)}>OK</Button>
              </ModalView>
            </View>
          </Modal>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeArea>
  );
};
export default LoginScreen;
