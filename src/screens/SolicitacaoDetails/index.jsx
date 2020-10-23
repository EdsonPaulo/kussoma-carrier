import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Modal,
  DatePickerAndroid,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  Button,
  Chip,
  Dialog,
  TextInput,
  Snackbar,
  Divider,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import {
  convertDateHM,
  convertDateDM,
  convertDateDMY,
  convertMoney,
  convertDate,
} from '../../utils';
import { CustomInput, CustomButton, HeaderBar } from '../../components';
import authContext from '../../contexts/auth/auth-context';

import api from '../../services/api';

import styles from './styles';
import { SafeArea, ModalView, RowView, Text } from '../../constants/styles';
import { colors, mapSilverStyle, mapstyle } from '../../constants';

export default index = () => {
  const navigation = useNavigation();
  const { role, token } = useContext(authContext);

  const [propostaModalVisible, setPropostaModalVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [sended, setSended] = useState(false);
  const [valor, setValor] = useState(0);

  const [region, setRegion] = useState({
    latitude: -8.8356422,
    longitude: 13.2495329,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const route = useRoute();
  const solicitacao = route.params?.solicitacao;
  const carga = solicitacao?.cargas[0];

  useEffect(() => {}, []);

  const sendProposta = async () => {
    try {
      setSending(true);
      console.log('Solicitacao: ' + solicitacao.id, 'Valor: ' + valor);
      const response = await api(token).post('/fazer_proposta', {
        solicitacaoId: solicitacao.id,
        valor,
      });
      if (response.data) {
        setPropostaModalVisible(false);
        //setSended(true)
        if (Platform.OS === 'android')
          ToastAndroid.show(
            'A sua proposta foi enviada com sucesso! Avisaremos quando o cliente der um feedback',
            ToastAndroid.LONG,
          );
        navigation.navigate('propostas');
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao enviar proposta! Tente novamente.',
      );
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const fazerProposta = () => {
    if (valor && valor >= 1000) {
      sendProposta();
    } else
      Alert.alert('Valor inválido', 'Informe um valor válido de proposta!');
  };

  const cancelarSolicitacao = solicitacaoId => {
    Alert.alert(
      'Cancelar Solicitação',
      'Tem certeza que quer cancelar a sua solicitação?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            console.log(`/cancelar_solicitacao/${solicitacaoId}`);
            try {
              const response = await api(token).post(
                `/cancelar_solicitacao/${solicitacaoId}`,
              );
              if (Platform.OS === 'android')
                ToastAndroid.show(
                  'A sua solicitação foi cancelada!',
                  ToastAndroid.LONG,
                );
              navigation.navigate('solicitacoes');
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const onRegionChange = region => {
    setRegion(region);
  };

  return (
    <SafeArea>
      <HeaderBar back title="Detalhes da Solicitacação" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
      >
        <View style={{ flex: 1 }}>
          <View style={{ height: 335 }}>
            <MapView
              zoomEnabled={true}
              initialRegion={region}
              onRegionChange={onRegionChange}
              customMapStyle={mapstyle}
              showsMyLocationButton
              minZoomLevel={6}
              showsUserLocation
              style={styles.mapView}
            >
              <Marker // pinColor="wheat"
                coordinate={{ latitude: -8.8356422, longitude: 13.2495329 }}
                description={'Local de carregamento da carga'}
                title={'Origem'}
              />

              <Polyline
                strokeWidth={3}
                strokeColor={colors.primary}
                coordinates={[
                  { latitude: -8.8356422, longitude: 13.2495329 },
                  { latitude: -8.838285, longitude: 13.2533433 },
                ]}
              />

              <Marker
                pinColor="blue"
                coordinate={{ latitude: -8.838285, longitude: 13.2533433 }}
                title={'Destino'}
                description={'Local de descarga'}
              />
            </MapView>
          </View>

          <View
            style={[styles.section, { justifyContent: 'center', marginTop: 0 }]}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text fontSize="16px">
                Ref.: <Text fontSize="17px" bold>{`S0${solicitacao?.id}`}</Text>
              </Text>
              <Text bold fontSize="17px">
                {solicitacao?.cliente?.nome}
              </Text>
            </View>

            <View style={{ marginVertical: 5 }}>
              <Text color={colors.grayDark} textAlign="center" fontSize="16px">
                Tipo de Carga
              </Text>
              <Text textAlign="center" fontSize="16px">
                {carga?.tipoCarga?.nome}
              </Text>
            </View>

            <View
              style={{
                marginVertical: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text bold fontSize="15px">
                {solicitacao?.origem?.municipio?.nome},{' '}
                {solicitacao?.origem?.provincia?.nome}
              </Text>
              <Icon
                name="arrow-right"
                style={{ marginHorizontal: 7 }}
                size={15}
                color={colors.dark}
              />
              <Text bold fontSize="15px">
                {solicitacao?.destino?.municipio?.nome},{' '}
                {solicitacao?.destino?.provincia?.nome}
              </Text>
            </View>

            <View
              style={{
                marginBottom: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text fontSize="16px">
                Peso:{' '}
                <Text fontSize="16px" bold>
                  {carga?.peso || 0} Kg
                </Text>
              </Text>
              {solicitacao?.distancia && (
                <Text fontSize="16px">
                  Distância:{' '}
                  <Text fontSize="16px" bold>
                    {parseFloat(solicitacao?.distancia).toFixed(2) || 0} Km
                  </Text>
                </Text>
              )}
            </View>

            <Text color={colors.grayDark} textAlign="center" fontSize="13px">
              Criado aos {convertDateDM(solicitacao?.dataReg?.data)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          {/** CARREGAMENTO */}
          <View style={[styles.row, { marginBottom: 0 }]}>
            <Text
              bold
              fontSize="13px"
              color={colors.grayDark}
              textAlign="center"
            >
              CARREGAMENTO
            </Text>
          </View>

          <View style={styles.row}>
            <Icon
              name="map-marker-outline"
              style={{ marginRight: 3 }}
              size={20}
            />
            <Text bold fontSize="16px">
              {solicitacao.origem?.municipio.nome},{' '}
              {solicitacao.origem?.provincia.nome}
            </Text>
          </View>

          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              <Icon
                name="calendar-month-outline"
                style={{ marginRight: 3 }}
                size={20}
              />
              <Text fontSize="15px">
                {convertDateDM(solicitacao.origem?.dataCarregamento)}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="clock-outline" style={{ marginRight: 3 }} size={20} />
              <Text fontSize="15px">
                {convertDateHM(solicitacao.origem?.dataCarregamento)}
              </Text>
            </View>
          </View>

          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              <Icon
                name="account-outline"
                style={{ marginRight: 3 }}
                size={20}
              />
              <Text fontSize="15px">
                {solicitacao.origem?.responsavel || solicitacao.cliente.nome}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon
                name="cellphone-basic"
                style={{ marginRight: 3 }}
                size={20}
              />
              <Text fontSize="15px">
                {solicitacao.origem?.telefone ||
                  solicitacao.cliente.telefone ||
                  solicitacao.cliente.email}
              </Text>
            </View>
          </View>

          <Divider style={{ marginVertical: 15 }} />

          {/** ENTREGA */}
          <View style={[styles.row, { marginBottom: 0 }]}>
            <Text
              bold
              fontSize="13px"
              color={colors.grayDark}
              textAlign="center"
            >
              ENTREGA
            </Text>
          </View>

          <View style={styles.row}>
            <Icon
              name="map-marker-outline"
              style={{ marginRight: 3 }}
              size={20}
            />
            <Text bold fontSize="16px">
              {solicitacao.destino?.municipio.nome},{' '}
              {solicitacao.destino?.provincia.nome}{' '}
            </Text>
          </View>

          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              <Icon
                name="calendar-month-outline"
                style={{ marginRight: 3 }}
                size={20}
              />
              <Text fontSize="15px">
                {convertDateDM(solicitacao.destino?.dataEntrega)}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="clock-outline" style={{ marginRight: 3 }} size={20} />
              <Text fontSize="15px">
                {convertDateHM(solicitacao.destino?.dataEntrega)}
              </Text>
            </View>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              {!solicitacao.destino?.responsavel &&
              solicitacao.destino?.telefone ? (
                <Text bold fontSize="14px">
                  Tel. do Responsável:
                </Text>
              ) : (
                <>
                  <Icon
                    name="account-outline"
                    style={{ marginRight: 3 }}
                    size={20}
                  />
                  <Text fontSize="15px">
                    {solicitacao.destino?.responsavel}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.row}>
              <Icon
                name="cellphone-basic"
                style={{ marginRight: 3 }}
                size={20}
              />
              <Text fontSize="15px">{solicitacao.destino?.telefone}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 0 }]}>
          {/** DEeTALHES DA CARGA */}

          <Text textAlign="center" bold>
            DETALHES DA CARGA
          </Text>

          <View style={{ marginVertical: 15 }}>
            <Text bold color={colors.grayDark} textAlign="center">
              Tipo de Carga
            </Text>
            <Text textAlign="center">{carga.tipoCarga.nome}</Text>
          </View>
          <Divider style={{ marginVertical: 5 }} />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Peso
            </Text>
            <Text fontSize="16px" bold>
              {carga.peso}Kg
            </Text>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Altura
            </Text>
            <Text fontSize="16px" bold>
              {carga.altura}m
            </Text>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Largura
            </Text>
            <Text fontSize="16px" bold>
              {carga.largura}m
            </Text>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Comprimento
            </Text>
            <Text fontSize="16px" bold>
              {carga.comprimento}m
            </Text>
          </View>
          <Divider style={{ marginVertical: 5 }} />
          <View style={{ marginBottom: 25 }}>
            <Text textAlign="center" bold color={colors.grayDark}>
              Observação
            </Text>
            <Text fontSize="16px" textAlign="center">
              {carga.obs || '-'}
            </Text>
          </View>

          <View style={[styles.row, { justifyContent: 'space-evenly' }]}>
            {!carga.perigosa ? null : (
              <Chip
                textStyle={{ fontSize: 12 }}
                style={{ height: 30, justifyContent: 'center', marginRight: 3 }}
                icon="alert"
              >
                Carga perigosa
              </Chip>
            )}
            {!carga.controlTemp ? null : (
              <Chip
                textStyle={{ fontSize: 12 }}
                style={{ height: 30, justifyContent: 'center' }}
                icon="information"
              >
                Controlar temperatura
              </Chip>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {role === 'ROLE_CLIENTE' ? (
          <>
            <Button
              icon="close"
              style={{
                backgroundColor: colors.alert,
                flex: 1,
                marginRight: 10,
              }}
              mode="contained"
              onPress={() => cancelarSolicitacao(solicitacao?.id)}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate('propostas', { solicitacao: solicitacao })
              }
            >
              Ver Propostas
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            style={{ flex: 1 }}
            onPress={() => setPropostaModalVisible(true)}
          >
            Fazer Proposta
          </Button>
        )}
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={propostaModalVisible}
        onDismiss={() => setPropostaModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: '#00000092',
          }}
        >
          <View
            style={{
              height: 'auto',
              alignSelf: 'center',
              borderRadius: 5,
              width: '90%',
              padding: 35,
              backgroundColor: 'white',
            }}
          >
            <Text bold textAlign="center" marginVertical="15px">
              FAZER PROPOSTA DE TRABALHO
            </Text>

            <Text>
              Deseja fazer um proposta na solicitacao #{solicitacao.id} de{' '}
              {solicitacao.cliente?.nome}? Se sim, informe o valor que deseja
              cobrar, a data e hora de entrega no local de destino.
            </Text>

            <View style={{ marginVertical: 15 }}>
              <Text>Informe o valor a cobrar (em kz)</Text>
              <CustomInput
                disabled={!sending}
                type="number"
                onChangeText={value => setValor(value)}
                inline
                placeholder="Valor do Frete (AKZ)"
              />
            </View>

            <RowView justifyContent="space-between">
              <Button onPress={() => setPropostaModalVisible(false)}>
                Cancelar
              </Button>
              <Button
                mode="contained"
                loading={sending}
                onPress={fazerProposta}
              >
                Enviar
              </Button>
            </RowView>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={sended}
        duration={2000}
        onDismiss={() => setSended(false)}
      >
        A sua proposta foi enviada com sucesso!
      </Snackbar>
    </SafeArea>
  );
};
