import Icon from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Button, Dialog, FAB, Portal } from 'react-native-paper';
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
  const [lastSolicitacoes, setLastSolicitacoes] = useState([]);

  const [estatisticas, setEstatisticas] = useState({
    totalFrete: 0,
    totalSolicitacao: 0,
    totalProposta: 0,
  });

  const getFreteEstatistica = async () => {
    try {
      const responseFrete = await api(token).get(`/frete/estatistica`);
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
      const response = await api(token).get(`/cliente/solicitacao?per_page=4`);
      if (isMounted) {
        setLoading(false);
        if (response.data.data) {
          setLastSolicitacoes(response.data.data);
          if (response.data.data.length > 0) setContentLoaded(true);
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

    if (!loading && lastSolicitacoes.length > 0)
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}
          style={{ marginTop: 35 }}
        >
          <Text color={colors.grayDark} textAlign="center" fontSize="16px">
            Últimas Solicitações
          </Text>
          {lastSolicitacoes.map(solicitacao => (
            <RectButton
              style={styles.solicitacao}
              key={solicitacao.id}
              onPress={() =>
                navigation.navigate('solicitacaoDetails', { solicitacao })
              }
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <Text bold color={colors.primaryDark}>
                  S0{solicitacao?.id}
                </Text>
                <View>
                  <Text bold textAlign="right" color={colors.primaryDark}>
                    {solicitacao?.cargas[0]?.peso} Kg
                  </Text>
                  <Text bold textAlign="right" color={colors.primaryDark}>
                    {parseFloat(solicitacao?.distancia).toFixed(2)} Km
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
              >
                <View style={{ marginRght: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      name="chevron-circle-up"
                      size={11}
                      color={colors.dark}
                      style={{ marginRight: 5 }}
                    />
                    <Text bold color={colors.grayDark} fontSize="10px">
                      Origem
                    </Text>
                  </View>
                  <Text bold color={colors.primaryDark}>
                    {solicitacao?.origem?.municipio.nome},{' '}
                    {solicitacao?.origem?.provincia.nome}{' '}
                  </Text>
                  <Text color={colors.grayDark} fontSize="13px">
                    {convertDate(solicitacao?.origem?.dataCarregamento)}
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
                    <Text bold color={colors.primaryDark}>
                      {solicitacao?.destino?.municipio.nome},{' '}
                      {solicitacao?.destino?.provincia.nome}
                    </Text>
                    <Text color={colors.grayDark} fontSize="13px">
                      {convertDate(solicitacao?.destino?.dataEntrega)}
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
      console.log('focou');
      getFreteEstatistica();
      getSolicitacaoEstatistica();
      getSolicitacaoList();
    }
    return () => (isMounted = false);
  }, []);

  return (
    <SafeArea>
      <View style={contentLoaded ? styles.topContainer : { flex: 1 }}>
        <View
          style={{
            position: contentLoaded ? 'absolute' : 'relative',
            top: contentLoaded ? 10 : 0,
          }}
        >
          <ScrollView
            horizontal={contentLoaded}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={
              contentLoaded
                ? { padding: 10 }
                : {
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }
            }
          >
            <View style={{ flexDirection: 'row' }}>
              {contentLoaded ? null : (
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    //backgroundColor: "gray"
                  }}
                >
                  {role !== 'ROLE_AUTONOMO' ? null : (
                    <>
                      <RectButton
                        style={[styles.option, { alignItems: 'center' }]}
                        onPress={() => navigation.navigate('carDetails')}
                      >
                        <Icon name="car" style={styles.optionIcon} size={23} />
                        <View style={{ alignItems: 'center' }}>
                          <Text bold color={colors.dark}>
                            Meu
                          </Text>
                          <Text old color={colors.dark}>
                            Automóvel
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
                    </>
                  )}
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
              )}

              <View
                style={{
                  alignItems: 'flex-start',
                  justifyContent: contentLoaded ? 'flex-start' : 'center',
                  flexDirection: contentLoaded ? 'row' : 'column',
                }}
              >
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
                {role === 'ROLE_MOTORISTA' ? (
                  <>
                    <View style={{ flex: 1 }} />
                    <View style={{ flex: 1 }} />
                  </>
                ) : (
                  <>
                    <RectButton
                      style={styles.option}
                      onPress={() => navigation.navigate('propostas')}
                    >
                      <Icon
                        name="handshake"
                        style={styles.optionIcon}
                        size={26}
                      />
                      <Text bold style={styles.optionBadge}>
                        {estatisticas?.totalProposta}
                      </Text>
                      <View>
                        <Text bold color={colors.dark}>
                          Propostas
                        </Text>
                        <Text bold color={colors.dark}>
                          Feitas
                        </Text>
                      </View>
                    </RectButton>
                    <RectButton
                      style={styles.option}
                      onPress={() => navigation.navigate('solicitacoes')}
                    >
                      <Icon
                        name="bullhorn"
                        style={styles.optionIcon}
                        size={23}
                      />
                      <Text bold style={styles.optionBadge}>
                        {estatisticas?.totalSolicitacao}
                      </Text>
                      <View>
                        <Text bold color={colors.dark}>
                          Solicitações
                        </Text>
                        <Text bold color={colors.dark}>
                          de Frete
                        </Text>
                      </View>
                    </RectButton>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      {!contentLoaded ? null : (
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
