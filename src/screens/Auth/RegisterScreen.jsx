import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { CustomButton, CustomInput } from '../../components';
import { colors } from '../../constants';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import { getExpoPushToken, httpErrorHandler, validation } from '../../utils';
import { Button, ModalView, RowView, SafeArea, Text } from './styles';

const RegisterScreen = () => {
  let isMounted = true;
  const navigation = useNavigation();
  const route = useRoute();
  const { register } = useContext(authContext);

  const [submiting, setSubmiting] = useState(false);
  const [step, setStep] = useState(1);
  const [sendCodeQtd, setSendCodeQtd] = useState(0);
  const [pushToken, setPushToken] = useState('');
  const [verificationCode, setVerificationCode] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // verification code field
  const [codeValueFromServer, setCodeValueFromServer] = useState(1234);
  const [codeValue, setCodeValue] = useState('');
  const codeFieldRef = useBlurOnFulfill({ codeValue, cellCount: 4 });
  const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
    codeValue,
    setCodeValue,
  });

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

  const sendRequest = async (endpoint, data) => {
    console.log(`POST: ${endpoint}: ${JSON.stringify(data)}`);
    if (submiting) return;
    try {
      setSubmiting(true);
      const response = await api(null).post(endpoint, data);
      console.log(response.data);
      if (response.data && isMounted)
        if (step !== 3) setStep(step + 1);
        else {
          updatUserExpoToken(response.data?.access_token);
          setSuccessModalVisible(true);
          setTimeout(() => {
            register(
              response.data?.user,
              response.data?.access_token,
              response.data?.user?.role,
            );
            setSuccessModalVisible(false);
          }, 2000);
        }
    } catch (error) {
      httpErrorHandler(error);
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
    if (submiting) return;
    try {
      setVerificationCode(null);
      setUserData({ ...userData, code: null });
      setSubmiting(true);
      const response = await api(null).post('/send_code', {
        email_phone: userData.phone,
      });
      setStep(step + 1);

      console.log(response.data);
      if (!isNaN(response.data) && isMounted) {
        setSendCodeQtd(sendCodeQtd + 1);
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
      httpErrorHandler(error);
    } finally {
      setSubmiting(false);
    }
  };

  const phoneValidation = () => {
    //validacao do telefone
    const validate = validation('phone', userData.phone);
    if (validate) {
      setUserDataError({ ...userDataError, phone: validate });
      return;
    } else setUserDataError({ ...userDataError, phone: null });
    sendCode();
  };

  const codeValidation = () => {
    //validacao do codigo token
    const validate = validation('code', codeValue);
    if (validate) {
      setUserDataError({ ...userDataError, code: validate });
      return;
    } else setUserDataError({ ...userDataError, code: null });

    // if (codeValue != verificationCode)
    if (codeValue != '1234')
      setUserDataError({ ...userDataError, code: `Código incorrecto` });
    else {
      setUserData({ ...userData, code: codeValue });
      setStep(step + 1);
    }

    console.log('Código inserido: ' + codeValue);
    console.log('Código enviado: ' + verificationCode);
  };

  const signUp = () => {
    if (!userData.name || !userData.surname || !userData.password) {
      Alert.alert('Campos em falta', 'Preencha todos os campos!');
      return;
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
    if (validateName || validatePassword) return;

    //enviar para o server
    sendRequest('/register', {
      email_phone: userData.phone,
      password: userData.password,
      token: userData.code,
      name: userData.name,
      classificacao: 2,
      role,
    });
  };

  const nextStep = () => {
    switch (step) {
      case 1:
        phoneValidation();
        break;
      case 2:
        codeValidation();
        break;
      case 3:
        signUp();
    }
  };

  const renderStep1 = () => (
    <View>
      <Text color={colors.textDark} fontSize="18px" textAlign="center">
        Qual é o seu contacto principal?
      </Text>
      <Text
        color={colors.textDark}
        fontSize="14px"
        marginVertical="10px"
        textAlign="center"
      >
        Informe o seu número de telefone (obrigatório)
      </Text>

      <CustomInput
        type="phone"
        showIcon
        placeholder="ex: 942682194"
        value={userData.phone}
        error={userDataError.phone}
        help="Um numero de 9 dígitos"
        maxLength={13}
        onChangeText={value =>
          setUserData({
            ...userData,
            phone: value.includes('+244') ? value.trim() : `+244`,
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
        Enviámos um código de 4 dígitos para {userData.phone}. Se não receber
        dentro de 5 minutos, tente reenviar a SMS ou tente mais tarde!
      </Text>

      <View style={{ marginVertical: 15 }}>
        <CodeField
          {...codeProps}
          ref={codeFieldRef}
          value={codeValue}
          onChangeText={setCodeValue}
          cellCount={4}
          rootStyle={styles.root}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              style={[styles.cellRoot, isFocused && styles.focusCell]}
            >
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        {userDataError.code && (
          <Text color={colors.alert} textAlign="right" fontSize="12px">
            {userDataError.code}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={() => sendCode(true)}>
        <Text color={colors.primaryDark} marginVertical="15px">
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
        type="name"
        showIcon
        error={userDataError.name}
        value={userData.name}
        placeholder="Nome e Sobrenome"
        onChangeText={value => setUserData({ ...userData, name: value })}
      />

      <CustomInput
        type="password"
        showIcon
        placeholder="Senha (obrigatório)"
        error={userDataError.password}
        value={userData.password}
        onChangeText={value => setUserData({ ...userData, password: value })}
      />

      <Text color={colors.textDark} marginVertical="15px" textAlign="justify">
        Ao realizar cadastro você concorda com os termos e condições de serviço
        do kussoma, bem como as nossas políticas de privacidade.
      </Text>
    </View>
  );

  const initExpoToken = async () => {
    try {
      const expoToken = await getExpoPushToken();
      console.log('Token: ' + JSON.stringify(expoToken));
      if (expoToken) setPushToken(expoToken?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initExpoToken();
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
            para motorista
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
  cellRoot: {
    flex: 1,
    height: 60,
    backgroundColor: colors.grayLight,
    marginHorizontal: 5,
    borderColor: colors.grayMedium,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.dark,
    fontSize: 30,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: colors.primaryDark,
  },
});

export default RegisterScreen;
