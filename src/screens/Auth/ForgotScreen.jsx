import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { CustomButton, CustomInput } from '../../components';
import { colors } from '../../constants';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import { validation } from '../../utils';

import { Button, Text, ModalView, RowView, SafeArea } from './styles';

const ForgotScreen = () => {
  let isMounted = true;
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useContext(authContext);
  const role = route.params?.role;

  const [submiting, setSubmiting] = useState(false);
  const [step, setStep] = useState(1);
  const [sendCodeQtd, setSendCodeQtd] = useState(0);
  const [verificationCode, setVerificationCode] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [userData, setUserData] = useState({
    name: null,
    surname: '  ',
    phone: '+244',
    code: null,
    password: null,
  });

  const [userDataError, setUserDataError] = useState({
    name: null,
    surname: null,
    phone: null,
    code: null,
    password: null,
  });

  const sendRequest = async (endpoint, data) => {
    console.log(`POST: ${endpoint}: ${JSON.stringify(data)}`);
    try {
      setSubmiting(true);
      const response = await api(null).post(endpoint, data);
      console.log(response);
      if (response.data && isMounted)
        if (step == 3) setStep(step + 1);
        else {
          setSuccessModalVisible(true);
          setTimeout(() => {
            login(
              response.data?.user,
              response.data?.access_token,
              response.data?.user?.role,
            );
            setSuccessModalVisible(false);
          }, 2000);
        }
    } catch (error) {
      Alert.alert('Ocorreu um erro', 'Tente novamente');
      console.log(error);
    } finally {
      setSubmiting(false);
    }
  };

  const sendCode = async retry => {
    if (sendCodeQtd == 3) {
      Alert.alert(
        'Precisa de Ajuda?',
        `Parece que está a ter problemas com a verificação. Entre em contacto conosco para podermos ajudá-lo: +244 942 682 194 ou suporte.kussoma@pettabyte.net`,
      );
      return;
    }
    try {
      setVerificationCode(null);
      setUserData({ ...userData, code: null });
      setSubmiting(true);
      setSendCodeQtd(sendCodeQtd + 1);

      const response = await api(null).post('/send_code', {
        email_phone: userData.phone,
      });
      console.log(response.data);
      if (!isNaN(response.data) && isMounted) {
        setVerificationCode(Number(response.data));
        if (!retry) setStep(step + 1);
        else {
          Alert.alert(
            'Código Reenviado',
            `Enviamos um novo código para o ${userData.phone}.`,
          );
        }
      }
    } catch (error) {
      Alert.alert('Ocorreu um erro', 'Tente novamente');
      console.log(error);
    } finally {
      setSubmiting(false);
    }
  };

  const nextStep = () => {
    switch (step) {
      case 1:
        //validacao do telefone
        let validate = validation('phone', userData.phone);
        if (validate) {
          setUserDataError({ ...userDataError, phone: validate });
          return;
        } else setUserDataError({ ...userDataError, phone: null });
        sendCode();
        validate = null;
        break;

      case 2:
        //validacao do codigo token
        validate = validation('code', userData.code);
        if (validate) {
          setUserDataError({ ...userDataError, code: validate });
          return;
        } else setUserDataError({ ...userDataError, code: null });

        console.log('COdigo inserido: ' + userData.code);
        console.log('COdigo enviado: ' + verificationCode);

        if (userData.code != verificationCode) {
          setUserDataError({ ...userDataError, code: true });
        } else setStep(step + 1);

        // sendRequest('/verify', { email_phone: `+244${userData.phone}`, token: userData.code })
        break;

      case 3:
        if (!userData.name || !userData.surname || !userData.password) {
          Alert.alert('Campos em falta', 'Preencha todos os campos!');
          break;
        }

        //validação dos dados
        const validateName = validation('name', userData.name);
        const validateSurname = validation('name', userData.surname);
        const validatePassword = validation('password', userData.password);

        setUserDataError({
          ...userDataError,
          name: validateName,
          surname: validateSurname,
          password: validatePassword,
        });

        if (validateName || validatePassword) break;

        /**
         *** enviar para o server
         **/
        sendRequest('/register', {
          phone: userData.phone,
          token: userData.code,
          password: userData.password,
          name: userData.name,
          role,
        });
    }
  };

  const signInAfterSignUp = () => {
    setSuccessModalVisible(false);
  };

  const renderStep1 = () => (
    <View>
      <Text color={colors.textDark} fontSize="18px" textAlign="center">
        RECUPERAÇÃO DE CONTA
      </Text>
      <Text
        color={colors.textDark}
        fontSize="14px"
        marginVertical="10px"
        textAlign="center"
      >
        Informe o seu número de telefone:
      </Text>

      <CustomInput
        type="phone"
        showIcon
        placeholder="Número de telefone"
        value={userData.phone}
        error={userDataError.phone}
        help="Um numero de 9 dígitos"
        maxLength={13}
        onChangeText={value =>
          setUserData({
            ...userData,
            phone: value.includes('+244') ? value.trim() : '+244',
          })
        }
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text color={colors.textDark} fontSize="18px" textAlign="center">
        Verificação
      </Text>
      <Text
        color={colors.textDark}
        fontSize="14px"
        marginVertical="5px"
        textAlign="justify"
      >
        Enviámos um código de 6 dígitos para {userData.phone}. Se não receber
        dentro de 5 minutos, tente reenviar a SMS!
      </Text>
      <CustomInput
        type="code"
        showIcon
        error={userDataError.code}
        maxLength={6}
        value={userData.code}
        onChangeText={value => setUserData({ ...userData, code: value })}
        style={{ fontSize: 20, letterSpacing: 2, fontWeight: 'bold' }}
        placeholder="XXXXXX"
      />

      <TouchableOpacity onPress={() => sendCode(true)}>
        <Text color={colors.textDark} marginVertical="5px" textAlign="right">
          Reenviar SMS
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text
        color={colors.textDark}
        fontSize="18px"
        style={{}}
        textAlign="center"
      >
        Informações pessoais
      </Text>
      <Text
        color={colors.textDark}
        fontSize="14px"
        style={{ marginBottom: 15 }}
        textAlign="center"
      >
        Informe-nos sobre você
      </Text>

      <CustomInput
        type="password"
        showIcon
        placeholder="Nova Senha"
        error={userDataError.password}
        value={userData.password}
        onChangeText={value => setUserData({ ...userData, password: value })}
      />

      <CustomInput
        type="password"
        showIcon
        placeholder="Confirmar Senha"
        error={userDataError.password}
        value={userData.password}
        onChangeText={value =>
          setUserData({ ...userData, confirmPassword: value })
        }
      />

      <Text color={colors.textDark} marginVertical="15px" textAlign="justify">
        Ao realizar cadastro você concorda com os termos e condições de serviço
        do kussoma, bem como as nossas políticas de privacidade.
      </Text>
    </View>
  );

  useEffect(() => {
    return () => (isMounted = false);
  }, []);

  return (
    <SafeArea>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={{ width: 40, alignItems: 'center' }}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            size={35}
            color="#333"
          />
        </TouchableOpacity>

        <View style={{ marginLeft: 20 }}>
          <Text color={colors.textDark} marginVertical="0" bold fontSize="20px">
            Kussoma
          </Text>
          <Text color={colors.textDark} marginVertical="0">
            Recuperação de Conta
          </Text>
        </View>
        <View />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            paddingHorizontal: 20,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              padding: 20,
              justifyContent: 'center',
              /*
            elevation: 5,
            borderRadius: 8,
            backgroundColor: "white"
            */
            }}
          >
            {step == 1
              ? renderStep1()
              : step == 2
              ? renderStep2()
              : step == 3
              ? renderStep3()
              : null}
            {step == 1 || step == 3 ? (
              <CustomButton
                loading={submiting}
                primary
                title={step == 3 ? 'CRIAR CONTA' : 'SEGUINTE'}
                onPress={nextStep}
                icon={
                  step == 3
                    ? 'ios-checkmark'
                    : step == 1
                    ? 'ios-arrow-round-forward'
                    : null
                }
              />
            ) : (
              <RowView style={{ marginVertical: 10 }}>
                <Button
                  onPress={() => setStep(step - 1)}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons
                    name="ios-arrow-round-back"
                    size={45}
                    color={colors.textDark}
                  />
                </Button>

                <Button primary onPress={nextStep}>
                  <Ionicons
                    name="ios-arrow-round-forward"
                    size={45}
                    color={colors.grayLight}
                  />
                </Button>
              </RowView>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {step != 1 ? null : (
        <TouchableOpacity
          style={{ bottom: 20 }}
          onPress={() => navigation.navigate('login')}
        >
          <Text textAlign="center" color={colors.textDark}>
            Já possui uma conta? Faça Login
          </Text>
        </TouchableOpacity>
      )}
      <Modal animationType="slide" transparent visible={successModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#00000090',
          }}
        >
          <ModalView>
            <Ionicons
              name="ios-checkmark-circle"
              style={{ alignSelf: 'center' }}
              size={50}
              color={colors.success}
            />
            <View style={{ padding: 25, alignItems: 'center' }}>
              <Text
                color={colors.textDark}
                textAlign="center"
                bold
                fontSize="15px"
              >
                CONTA CRIADA COM SUCESSO!
              </Text>
              <Text
                color={colors.textDark}
                textAlign="justify"
                marginVertical="5px"
                fontSize="14px"
              >
                Parabéns {userData.name || 'Edson Gregório'}, a sua conta foi
                criada com sucesso. Seja bem vindo ao Kussoma!
              </Text>
            </View>
          </ModalView>
        </View>
      </Modal>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: 'white',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    padding: 15,
  },
  Button: {},
});

export default ForgotScreen;
