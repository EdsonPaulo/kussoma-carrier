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

const FreteList = props => {
  let isMounted = true;

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [fretes, setFretes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { token } = useContext(authContext);
  const { estado } = props;

  const onRefresh = useCallback(() => {
    if (isMounted) {
      setRefreshing(true);
      setPage(1);
      getFreteList();
    }
  }, []);

  const getFreteList = async () => {
    if (loading) return;
    if (total > 0 && fretes.length >= total) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    setLoading(true);
    try {
      const filter = estado ? `&estado=${estado}` : undefined;
      const response = await api(token).get(`/frete?page=${page}${filter}`);
      if (response.data && isMounted) {
        setLoading(false);
        setRefreshing(false);
        setTotal(response.data.total);
        if (response.data.data) {
          if (refreshing) setFretes(response.data.data);
          else setFretes([...fretes, ...response.data.data]);
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
    getFreteList();
    return () => (isMounted = false);
  }, []);

  if (loading && fretes.length == 0) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.dark} />
        <Text>Carregando Dados</Text>
      </Container>
    );
  }

  if (total == 0 && !loading) {
    return (
      <Container style={{ alignItems: 'center' }}>
        <Icon name="inbox" size={40} color={colors.grayDark} />
        <Text fontSize="16px" color={colors.grayDark}>
          Nenhum Frete Registado!
        </Text>
        <Icon
          style={{ position: 'absolute', top: 10, right: 10 }}
          name="refresh"
          onPress={getFreteList}
          size={35}
          color={colors.grayDark}
        />
      </Container>
    );
  }

  return (
    <FlatList
      data={fretes}
      contentContainerStyle={{ padding: 15 }}
      renderItem={({ item }) => <FreteCard {...item} isFrete />}
      onEndReached={getFreteList}
      onEndReachedThreshold={0.6}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={
        fretes.length !== total && loading ? (
          <View style={{ margin: metrics.doubleBaseMargin }}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        ) : null
      }
    />
  );
};
export default FreteList;
