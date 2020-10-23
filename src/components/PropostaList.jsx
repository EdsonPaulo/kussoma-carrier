import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Card, Chip, List, Modal, Portal } from 'react-native-paper';
import { colors } from '../constants';
import { Container, RowView, Text } from '../constants/styles';
import authContext from '../contexts/auth/auth-context';
import api from '../services/api';
import { convertDateDM, convertDateHM, convertMoney } from '../utils';

const PropostaList = () => {
  let isMounted = true;

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [propostas, setPropostas] = useState([]);
  const { token } = useContext(authContext);

  const onRefresh = useCallback(() => {
    if (isMounted) {
      setRefreshing(true);
      getPropostaList();
    }
  }, []);

  const getPropostaList = async () => {
    if (loading || refreshing) return;
    setLoading(true);
    try {
      const API_URL_ENDPOINT = `/propostas_entidade`;

      const response = await api(token).get(API_URL_ENDPOINT);
      console.log('Lista de Propostas');
      console.log(response.data);
      if (response.data && isMounted) {
        setLoading(false);
        setRefreshing(false);
        setPropostas(response.data);
      }
    } catch (error) {
      console.log(error + ' ==> erro');
    } finally {
      if (isMounted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const checkout = solicitacaoId => {
    Alert.alert(
      'Começar Frete',
      'Deseja começar o trablho para esse frete?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            const data = {
              solicitacaoId: solicitacaoId,
              motoristaId: 73,
              automovelId: 50,
            };
            console.log(`/frete`, { ...data });
            //return
            try {
              setProcessing(true);
              const response = await api(token).post(`/frete`, { ...data });
              if (response.data) {
                console.log('Frete negociado!');
                getPropostaList();
              }
            } catch (error) {
              console.log(error.response?.data);
            } finally {
              setProcessing(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const cancelarProposta = solicitacaoId => {
    Alert.alert(
      'Cancelar Proposta',
      'Tem certeza que quer cancelar a sua proposta?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            console.log(`/cancelar_proposta/${solicitacaoId}`);
            // return
            try {
              setProcessing(true);
              const response = await api(token).post(
                `/cancelar_proposta/${solicitacaoId}`,
              );
              if (response.data) {
                console.log('Proposta cancelada!');
                getPropostaList();
              }
            } catch (error) {
              console.log(error);
            } finally {
              setProcessing(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const PropostaCard = proposta => {
    return (
      <Card style={{ padding: 5, elevation: 5, marginBottom: 15 }}>
        <Card.Content>
          <RowView justifyContent="space-between">
            <Chip
              style={{
                backgroundColor: proposta.estadoProposta ? 'green' : '#eee',
              }}
              textStyle={{
                color: proposta.estadoProposta
                  ? colors.textLight
                  : colors.textDark,
              }}
            >
              {proposta.estadoProposta ? 'Aceite' : 'Pendente'}
            </Chip>
            <Text fontSize="20px" color={colors.dark} bold>
              {convertMoney(proposta.valor)}
            </Text>
          </RowView>

          <View style={{ alignItems: 'center' }}>
            <Text fontSize="16px" color={colors.grayDark}>
              Cliente
            </Text>
            <Text fontSize="18px" bold>
              {proposta?.cliente?.nome}
            </Text>
          </View>

          <View style={{ marginVertical: 5, alignItems: 'center' }}>
            <Text fontSize="16px" color={colors.grayDark}>
              Referência da Solicitação
            </Text>
            <Text fontSize="18px" bold>{`S0${proposta.solicitacaoId}`}</Text>
          </View>
        </Card.Content>

        <Card.Actions style={{ justifyContent: 'space-between' }}>
          {!proposta.estadoProposta ? (
            <Text fontSize="17px" color={colors.grayDark} bold>
              {convertDateDM(proposta.dataProposta)},{' '}
              {convertDateHM(proposta.dataProposta)}
            </Text>
          ) : (
            <Button
              icon="truck"
              color="white"
              style={{ backgroundColor: colors.primary, color: 'white' }}
              onPress={() => checkout(proposta?.solicitacaoId)}
            >
              Começar Trabalho
            </Button>
          )}
          <Button
            icon="close"
            color="white"
            style={{ backgroundColor: colors.alert, color: 'white' }}
            onPress={() => cancelarProposta(proposta?.solicitacaoId)}
          >
            Cancelar
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  useEffect(() => {
    getPropostaList();

    return () => (isMounted = false);
  }, []);

  if (loading && propostas.length == 0) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.dark} />
        <Text>Carregando Dados</Text>
      </Container>
    );
  }

  if (propostas.length == 0) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <Text fontSize="16px" style={{}} color={colors.grayDark}>
          Não tem nenhuma proposta pendente!
        </Text>
        <Text
          fontSize="16px"
          style={{ marginBottom: 15 }}
          color={colors.grayDark}
        >
          Veja as recentes solicitações e faça proposta
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('solicitacoes')}
        >
          Ver Trabalhos
        </Button>
        <Icon
          style={{ position: 'absolute', top: 10, right: 10 }}
          name="refresh"
          onPress={getPropostaList}
          size={35}
          color={colors.grayDark}
        />
      </Container>
    );
  }

  return (
    <View>
      <FlatList
        data={propostas}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => PropostaCard({ ...item })}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Portal>
        <Modal
          visible={processing}
          contentContainerStyle={{
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" />
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  clientePropostaCard: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 15,
    elevation: 3,
  },
});

export default PropostaList;
