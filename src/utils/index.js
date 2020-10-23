/** UTILS MÉTHODS */
import AsyncStorage from '@react-native-community/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import 'moment/locale/pt';
import { Alert, Platform, ToastAndroid } from 'react-native';
import Rate, { AndroidMarket } from 'react-native-rate';
import { constants } from '../constants';

moment.locale('pt');

//import Share from 'react-native-share'

//CONVERTER A DATA PARA O FORMATO DIA MES
export const convertDateDMY = date => moment(date).format('DD/MM/YY');

export const convertDateYMD = date => moment(date).format('YYYY/MM/DD');

export const convertDateDM = date => moment(date).format('DD [de] MMMM');

export const convertDateHM = date => moment(date).format('hh:mm');

export const convertDateYMDHM = date => moment(date).format('DD-MM-YYYY hh:mm');

export const convertDateFrete = date =>
  moment(date).format('DD [de] MM, YYYY, [as] hh:mm');

export const convertDate = date =>
  moment(date).format('DD [de] MMMM, [as] hh[h]');

export const convertMoney = number =>
  Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(
    number,
  );

export const validation = (key, value) => {
  let message;
  switch (key) {
    case 'phone':
      if (!value || value.length !== 13 || !value.includes('+244')) {
        message = 'Número de telefone inválido';
      }
      break;
    case 'code':
      if (!value || value.length !== 4) {
        message = 'Código inválido';
      }
      break;
    case 'password':
      if (!value || value.length < 6) {
        message = 'Senha inválida (deve ter no mínimo 6 caracteres)';
      }
      break;
    case 'email':
      if (!value || value.length < 5) {
        message = 'Email inválido';
      }
      break;
    case 'name':
      if (!value || value.length < 4) {
        message = 'Nome inválido';
      }
      break;
  }
  return message;
};

export const httpErrorHandler = error => {
  console.log('ERROR: ', error);
  console.log('ERROR DATA: ', error.response?.data);
  console.log('ERROR STATUS: ', error.response?.status);

  const statusCode = error.response?.status;
  const errorData =
    error.response?.data?.error || error.response?.data?.message;

  if (error.toString().includes('Network Error'))
    Alert.alert('Falha de Conexão', 'Verifique a sua ligação à internet!');

  if (statusCode == 400) Alert.alert('Ocorreu um erro', `${errorData}`);
  else if (statusCode == 401)
    errorData
      ? Alert.alert(null, errorData)
      : Alert.alert(
          'Sem Permissão',
          'O pedido foi rejeitado por não possuir permissão de acesso!',
        );
  else if (statusCode == 500)
    Alert.alert(
      null,
      'Ocorreu um erro ao processar o seu pedido. Tente novamente mais tarde!',
    );
};

export const onRate = async () => {
  const options = {
    AppleAppID: '2193813192',
    GooglePackageName: 'com.petabyte.kussoma',
    //  AmazonPackageName: "com.carnesul.kussoma",
    // OtherAndroidURL: "http://www.randomappstore.com/app/47172391",
    preferredAndroidMarket: AndroidMarket.Google,
    preferInApp: false,
    openAppStoreIfInAppFails: true,
    fallbackPlatformURL: 'http://kussoma.com/',
  };
  Alert.alert(
    'Avaliar o Kussoma',
    'Avalie-nos, comente o que achou e em que podemos melhorar!',
    [
      { text: 'Não, Obrigado', style: 'cancel' },
      {
        text: 'Avaliar',
        onPress: () => {
          Rate.rate(options, success => {
            if (success) ToastAndroid.show('Obrigado por Avaliar-nos!');
          });
        },
      },
    ],
    { cancelable: true },
  );
};

const onShare = () => {
  /**
    try {
        const result = await Share.share({
            title: 'CarneSul',
            message: 'Carnesul | Carnes Frescas de Boa Qualidade',
            url: 'https://deltacorp.co.ao',
        }, { dialogTitle: 'CarneSul' })

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    }
    catch (error) { alert(error.message) }
    const url = 'http://kussoma.co.ao';
    const title = 'Kussoma - Fretes e Logística';
    const message = 'Compartilhe o kussoma com amigos. Compartilhar é Carinhoso :)';
    //const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
    const options = Platform.select({
        ios: {
            activityItemSources: [
                { // For sharing url with custom title.
                    placeholderItem: { type: 'url', content: url },
                    item: {
                        default: {
                            type: 'text',
                            content: `${message} ${url}`
                        }
                    },
                    subject: { default: title },
                    linkMetadata: { originalUrl: url, url, title },
                }
            ],
        },
        default: {
            title,
            subject: title,
            message: `${message} ${url}`,
        },
    });

    Share.open(options)
*/
};

/**
import {Platform} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';

import config from '../../config';

export const fetchAddressFromCoordinatesAsync = async (region: any) => {
  try {
    const loc = await fetch(
      `https:/maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${config.googleApiKey}`,
      {
        method: 'GET',
      },
    );
    const resp = await loc.json();
    return resp.results[0];
  } catch (e) {
    throw e;
  }
};

export const fetchPrediction = async (queryString: string, region: any) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${config.googleApiKey}&input=${queryString}&location=${region.latLong.latitude},${region.latLong.longitude}&radius=50000`;
    const callUrl = await fetch(url);
    const resp = await callUrl.json();
    return resp;
  } catch (e) {
    throw e;
  }
};

export const fetchCoordinatesFromAddress = async (address: string) => {
  const fetchCoords = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${config.googleApiKey}`,
    {
      method: 'GET',
    },
  );
  const resp = await fetchCoords.json();
  return resp.results[0];
};

const getGpsLoc = () => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(async (info: any) => {
      const {coords} = info;
      const resp = await fetchAddressFromCoordinatesAsync(coords);
      const response = {
        resp,
        coords,
      };
      resolve(response);
    });
  });
};

export const checkPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    if (result === 'granted') {
      const resp = await getGpsLoc();
      return resp;
    }
  } else {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === 'granted') {
      const resp = await getGpsLoc();
      return resp;
    }
  }
};
*/
export const getCameraPermission = async () => {
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Por favor, dê permissão de câmera para continuar com o trabalho..',
      );
    }
  }
};

export const getExpoPushToken = async () => {
  try {
    const expoPushToken = await AsyncStorage.getItem(constants.PUSH_TOKEN_KEY);
    if (expoPushToken) return expoPushToken;
    return getNotificationsPermission();
  } catch (error) {
    console.log(error);
  }
};

export const saveDataToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Dado salvo com sucesso!');
  } catch (error) {
    console.log(error);
  }
};

export const getDataOfStorage = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyExpoPushToken = async () => {
  try {
    const expoPushToken = await AsyncStorage.getItem(constants.PUSH_TOKEN_KEY);
    return JSON.parse(expoPushToken);
  } catch (error) {
    console.log(error, error?.response?.data);
    return null;
  }
};

export const getNotificationsPermission = async () => {
  try {
    if (!Constants.isDevice)
      console.log('Must use physical device for Push Notifications');
    else {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS,
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS,
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      } else console.log('permissão garantida');

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          sound: true,
          showBadge: true,
          enableVibrate: true,
          enableLights: true,
          lockscreenVisibility: Notifications.AndroidImportance.HIGH,
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }
      return Notifications.getExpoPushTokenAsync();
    }
  } catch (error) {
    console.log(error, error?.response?.data);
  }
};
