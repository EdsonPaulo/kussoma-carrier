import Icon from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Button, Dialog, Portal } from 'react-native-paper';
import { colors } from '../../constants';
import { SafeArea, Text } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import { convertDate } from '../../utils';
import styles from './styles';

export default index = () => {
  let isMounted = true;
  const navigation = useNavigation();
  const { user, token, role } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [lastFretes, setLastFretes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalFrete: 0,
    totalSolicitacao: 0,
    totalProposta: 0,
  });

  const getFreteEstatistica = async () => {
    try {
      const responseFrete = await api(token).get('/frete/estatistica');
      console.log(responseFrete.data);
      if (responseFrete.data && isMounted) {
        setEstatisticas({
          ...estatisticas,
          totalFrete: responseFrete.data?.total || 0,
        });
      }
    } catch (error) {
      console.log('=> erro', error);
      //httpErrorHandler(err)
    }
  };

  const getSolicitacaoEstatistica = async () => {
    try {
      const responseSolicitacao = await api(token).get(
        '/solicitacao_estatistica',
      );
      console.log(responseSolicitacao.data);
      if (responseSolicitacao && isMounted) {
        setEstatisticas({
          ...estatisticas,
          totalSolicitacao: responseSolicitacao.data?.total || 0,
        });
      }
    } catch (error) {
      console.log('=> erro', error);
      //httpErrorHandler(err)
    }
  };

  const getSolicitacaoList = async () => {
    setLoading(true);
    try {
      const response = await api(token).get(`/frete?per_page=4`);
      if (isMounted) {
        setLoading(false);
        if (response.data.data) {
          setLastFretes(response.data.data);
          if (response.data?.data?.length > 0) setContentLoaded(true);
        }
      }
    } catch (error) {
      console.log('=> erro', error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const renderBottomView = () => {
    if (loading) return <ActivityIndicator color={colors.dark} />;

    if (!loading && lastFretes.length > 0)
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}
          style={{ marginTop: 35 }}
        >
          <Text color={colors.grayDark} textAlign="center" fontSize="16px">
            Últimos Fretes
          </Text>
          {lastFretes.map(frete => (
            <RectButton
              style={styles.frete}
              key={frete.id}
              onPress={() => navigation.navigate('freteDetails', { frete })}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginBottom: 7,
                }}
              >
                <Text bold color={colors.primary}>
                  F0{frete?.id}
                </Text>
                <Text
                  style={[
                    styles.estadoFrete,
                    {
                      backgroundColor:
                        frete.estadoFrete?.nome === 'Activo'
                          ? colors.primaryDark
                          : frete.estadoFrete.nome === 'Concluido'
                          ? colors.success
                          : frete.estadoFrete.nome === 'Cancelado'
                          ? colors.alert
                          : colors.dark,
                    },
                  ]}
                >
                  {frete.estadoFrete?.nome}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <View style={{ marginRight: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      size={11}
                      color={colors.dark}
                      name="chevron-circle-up"
                      style={{ marginRight: 5 }}
                    />
                    <Text bold color={colors.grayDark} fontSize="10px">
                      Origem
                    </Text>
                  </View>
                  <Text bold color={colors.primary}>
                    {frete.solicitacao?.origem?.municipio.nome},{' '}
                    {frete.solicitacao?.origem?.provincia.nome}{' '}
                  </Text>
                  <Text color={colors.grayDark} fontSize="13px">
                    {convertDate(frete.solicitacao?.origem?.dataCarregamento)}
                  </Text>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Icon
                      name="chevron-circle-down"
                      size={11}
                      color={colors.primary}
                      style={{ marginRight: 5 }}
                    />
                    <Text bold color={colors.grayDark} fontSize="10px">
                      Destino
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text bold color={colors.primary}>
                      {frete.solicitacao?.destino?.municipio.nome},{' '}
                      {frete.solicitacao?.destino?.provincia.nome}
                    </Text>
                    <Text color={colors.grayDark} fontSize="13px">
                      {convertDate(frete.solicitacao?.destino?.dataEntrega)}
                    </Text>
                  </View>
                </View>
              </View>
            </RectButton>
          ))}

          <RectButton
            style={styles.seeMore}
            onPress={() => navigation.navigate('solicitacoes')}
          >
            <Text>
              Ver mais <Icon name="arrow-right" size={10} />
            </Text>
          </RectButton>
        </ScrollView>
      );
    return (
      <View style={{ alignItems: 'center' }}>
        <Text fontSize="22px" color={colors.grayDark}>
          Nenhuma Solicitação!
        </Text>
      </View>
    );
  };

  useEffect(() => {
    if (isMounted) {
      getFreteEstatistica();
      getSolicitacaoEstatistica();
      getSolicitacaoList();
    }
    return () => (isMounted = false);
  }, []);

  return (
    <SafeArea>
      <View
        style={
          contentLoaded && lastFretes.length > 2
            ? styles.topContainer
            : { flex: 1 }
        }
      >
        <View
          style={{
            position:
              contentLoaded && lastFretes.length > 2 ? 'absolute' : 'relative',
            top: contentLoaded && lastFretes.length > 2 ? 10 : 0,
          }}
        >
          <ScrollView
            horizontal={contentLoaded && lastFretes.length > 2}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              contentLoaded && lastFretes.length > 2
                ? { padding: 10 }
                : {
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }
            }
          >
            <View style={{ flexDirection: 'row' }}>
              {!contentLoaded || (contentLoaded && lastFretes.length <= 2) ? (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                  }}
                >
                  <RectButton
                    style={[
                      styles.option,
                      {
                        alignItems: 'center',
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => navigation.navigate('freteCreate')}
                  >
                    <Icon name="plus" color={colors.textLight} size={25} />
                    <View style={{ alignItems: 'center' }}>
                      <Text bold color={colors.textLight}>
                        Solicitar
                      </Text>
                      <Text bold color={colors.textLight}>
                        Frete
                      </Text>
                    </View>
                  </RectButton>

                  <RectButton
                    style={[styles.option, { alignItems: 'center' }]}
                    onPress={() => navigation.navigate('profile')}
                  >
                    <Icon name="user-tie" size={25} />
                    <View style={{ alignItems: 'center' }}>
                      <Text bold color={colors.dark}>
                        Info.
                      </Text>
                      <Text bold color={colors.dark}>
                        Pessoais
                      </Text>
                    </View>
                  </RectButton>

                  <RectButton
                    style={[styles.option, { alignItems: 'center' }]}
                    onPress={() => setModalVisible(true)}
                  >
                    <Icon name="headset" size={23} />
                    <View style={{ alignItems: 'center' }}>
                      <Text bold color={colors.dark}>
                        Ajuda
                      </Text>
                      <Text bold color={colors.dark}>
                        Suporte
                      </Text>
                    </View>
                  </RectButton>
                </View>
              ) : null}

              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent:
                    contentLoaded && lastFretes.length > 2
                      ? 'flex-start'
                      : 'center',
                  flexDirection:
                    contentLoaded && lastFretes.length > 2 ? 'row' : 'column',
                }}
              >
                {contentLoaded && lastFretes.length > 2 && (
                  <RectButton
                    style={[styles.option, { alignItems: 'center' }]}
                    onPress={() => navigation.navigate('freteCreate')}
                  >
                    <Icon name="plus" color={colors.dark} size={25} />
                    <View style={{ alignItems: 'center' }}>
                      <Text bold color={colors.dark}>
                        Solicitar
                      </Text>
                      <Text bold color={colors.dark}>
                        Frete
                      </Text>
                    </View>
                  </RectButton>
                )}
                <RectButton
                  style={styles.option}
                  onPress={() => navigation.navigate('fretes')}
                >
                  <Icon name="truck" style={styles.optionIcon} size={23} />
                  <Text bold style={styles.optionBadge}>
                    {estatisticas?.totalFrete}
                  </Text>
                  <View>
                    <Text bold color={colors.dark}>
                      Meus
                    </Text>
                    <Text bold color={colors.dark}>
                      Fretes
                    </Text>
                  </View>
                </RectButton>
                <RectButton
                  style={styles.option}
                  onPress={() => navigation.navigate('propostas')}
                >
                  <Icon name="handshake" style={styles.optionIcon} size={26} />
                  <Text bold style={styles.optionBadge}>
                    {estatisticas?.totalProposta}
                  </Text>
                  <View>
                    <Text bold color={colors.dark}>
                      Propostas
                    </Text>
                    <Text bold color={colors.dark}>
                      Recebidas
                    </Text>
                  </View>
                </RectButton>
                <RectButton
                  style={styles.option}
                  onPress={() => navigation.navigate('solicitacoes')}
                >
                  <Icon name="bullhorn" style={styles.optionIcon} size={23} />
                  <Text bold style={styles.optionBadge}>
                    {estatisticas?.totalSolicitacao}
                  </Text>
                  <View>
                    <Text bold color={colors.dark}>
                      Minhas
                    </Text>
                    <Text bold color={colors.dark}>
                      Solicitações
                    </Text>
                  </View>
                </RectButton>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {contentLoaded && lastFretes.length > 2 && (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          {renderBottomView()}
        </View>
      )}
      <Portal>
        <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <Dialog.Content>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Icon name="headset" size={25} />
              <Text fontSize="20px" bold>
                Ajuda e Suporte
              </Text>
            </View>
            <Text textAlign="justify" fontSize="16px">
              Se estiver em dificuldades, alguma dúvida ou sugestões, entre em
              contacto e fale conosco pelas vias:
            </Text>
            <Text textAlign="center" fontSize="16px" style={{ marginTop: 10 }}>
              Whatsapp
            </Text>
            <Text textAlign="center" fontSize="17px" bold>
              +244 942 682 194
            </Text>
            <Text textAlign="center" fontSize="16px" style={{ marginTop: 10 }}>
              Endereço de Email
            </Text>
            <Text textAlign="center" fontSize="17px" bold>
              suporte@kussoma.co.ao
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setModalVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <StatusBar
        style="light"
        barStyle="light-content"
        backgroundColor={colors.primaryDark}
        translucent={false}
      />
    </SafeArea>
  );
};
