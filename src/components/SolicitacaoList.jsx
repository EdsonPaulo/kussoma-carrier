import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { colors, metrics } from '../constants';
import { Container, Text } from '../constants/styles';
import authContext from '../contexts/auth/auth-context';
import api from '../services/api';
import FreteCard from './FreteCard';

const SolicitacaoList = () => {
  let isMounted = true;

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);

  const { role, token } = useContext(authContext);

  const onRefresh = useCallback(() => {
    if (isMounted) {
      setRefreshing(true);
      setPage(1);
      getSolicitacaoList();
    }
  }, []);

  const getSolicitacaoList = async () => {
    if (loading) return;
    if (total > 0 && solicitacoes.length >= total) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setLoading(true);
    try {
      const response = await api(token).get(
        `/cliente/solicitacao?page=${page}`,
      );
      if (response.data && isMounted) {
        setLoading(false);
        setRefreshing(false);
        setTotal(response.data.total);
        if (response.data.data) {
          if (refreshing) setSolicitacoes(response.data.data);
          else setSolicitacoes([...solicitacoes, ...response.data.data]);
          setPage(page + 1);
        }
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

  useEffect(() => {
    getSolicitacaoList();
    return () => (isMounted = false);
  }, []);

  if (loading && solicitacoes.length == 0) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.dark} />
        <Text>Carregando Dados</Text>
      </Container>
    );
  }

  if (total == 0 || solicitacoes.length == 0) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <Icon name="inbox" size={40} color={colors.grayDark} />
        {role === 'ROLE_CLIENTE' ? (
          <Text fontSize="16px" color={colors.grayDark}>
            Nenhuma solicitação pendente!
          </Text>
        ) : (
          <Text fontSize="16px" color={colors.grayDark}>
            Não há nenhuma solicitação de frete!
          </Text>
        )}
        <Icon
          style={{ position: 'absolute', top: 10, right: 10 }}
          name="refresh"
          onPress={getSolicitacaoList}
          size={35}
          color={colors.grayDark}
        />
      </Container>
    );
  }

  return (
    <FlatList
      data={solicitacoes}
      contentContainerStyle={{ padding: 15 }}
      renderItem={({ item }) => <FreteCard {...item} />}
      onEndReached={getSolicitacaoList}
      onEndReachedThreshold={0.6}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={
        solicitacoes.length !== total && loading ? (
          <View style={{ margin: metrics.doubleBaseMargin }}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        ) : null
      }
    />
  );
};
export default SolicitacaoList;
