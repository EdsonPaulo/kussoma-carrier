import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { List, Divider, Button, Chip } from 'react-native-paper';

import { colors } from '../../constants';
import { SafeArea, Text, RowView, Container } from '../../constants/styles';
import { CustomInput, CustomButton, HeaderBar } from '../../components';
import authContext from '../../contexts/auth/auth-context';
import { convertDateDMY, convertDateHM, convertMoney } from '../../utils';
import api from '../../services/api';
import styles from './styles';

export default index = () => {
  const { user, role, token } = useContext(authContext);
  const navigation = useNavigation();
  const route = useRoute();

  const frete = route.params?.frete;
  const solicitacao = frete?.solicitacao;
  const carga = solicitacao?.cargas[0];

  console.log(frete);

  useEffect(() => {}, []);

  return (
    <SafeArea>
      <HeaderBar back title={'Detalhes do Frete'} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 15 }}
        showsVerticalScrollIndicator={false}
      >
        <RowView justifyContent="space-between">
          <Text
            style={[
              styles.estadoFrete,
              {
                backgroundColor:
                  frete.estadoFrete?.nome === 'Activo'
                    ? colors.primary
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

          <Text color={colors.grayDark} bold fontSize="17px">
            Ref.: {`F0${frete?.id}`}
          </Text>

          <Text color={colors.grayDark} bold fontSize="17px">
            {convertDateDMY(frete.dataReg?.data)}
          </Text>
        </RowView>

        <View style={{ marginVertical: 20, alignItems: 'center' }}>
          {role === 'ROLE_CLIENTE' ? (
            <>
              <Text fontSize="12px">MOTORISTA</Text>
              <Text fontSize="17px" bold>
                {frete.motorista?.nome || '-'}
              </Text>
              <Text fontSize="17px" bold>
                {frete.motorista?.telefone || null}
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="12px">CLIENTE</Text>
              <Text fontSize="17px" bold>
                {frete.cliente?.nome || '-'}
              </Text>
              <Text fontSize="17px" bold>
                {frete.cliente?.telefone || frete.cliente?.email}
              </Text>
            </>
          )}
        </View>

        <View style={[styles.section]}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
              <Text color={colors.grayDark} fontSize="14px">
                PESO
              </Text>
              <Text bold fontSize="17px">
                {carga.peso} Kg
              </Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Text color={colors.grayDark} fontSize="14px">
                VALOR
              </Text>
              <Text bold color={colors.dark} fontSize="17px">
                {convertMoney(frete.valor || 0)}
              </Text>
            </View>
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
            <Icon name="map-marker-outline" size={20} />
            <Text bold fontSize="16px">
              {solicitacao.origem?.municipio.nome},{' '}
              {solicitacao.origem?.provincia.nome}
            </Text>
          </View>

          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              <Icon name="calendar-month-outline" size={20} />
              <Text bold fontSize="14px">
                {solicitacao.origem?.dataCarregamento?.split(' ')[0]}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="clock-outline" size={20} />
              <Text bold fontSize="14px">
                {convertDateHM(solicitacao.origem?.dataCarregamento)}
              </Text>
            </View>
          </View>

          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              <Icon name="account-outline" size={20} />
              <Text bold fontSize="14px">
                {solicitacao.origem?.responsavel || frete.cliente.nome}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="cellphone-basic" size={20} />
              <Text bold fontSize="14px">
                {solicitacao.origem?.telefone ||
                  frete.cliente.telefone ||
                  frete.cliente.email}
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
            <Icon name="map-marker-outline" size={20} />
            <Text bold fontSize="16px">
              {solicitacao.destino?.municipio.nome},{' '}
              {solicitacao.destino?.provincia.nome}{' '}
            </Text>
          </View>

          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={styles.row}>
              <Icon name="calendar-month-outline" size={20} />
              <Text bold fontSize="14px">
                {solicitacao.destino?.dataEntrega?.split(' ')[0]}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="clock-outline" size={20} />
              <Text bold fontSize="14px">
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
                  <Icon name="account-outline" size={20} />
                  <Text bold fontSize="14px">
                    {solicitacao.destino?.responsavel}
                  </Text>
                </>
              )}
            </View>
            <View style={styles.row}>
              <Icon name="cellphone-basic" size={20} />
              <Text bold fontSize="14px">
                {solicitacao.destino?.telefone}
              </Text>
            </View>
          </View>

          <View style={[styles.row, { marginTop: 10 }]}>
            <Text fontSize="15px" color={colors.dark} textAlign="center">
              Distância:{' '}
              <Text bold fontSize="15px">
                {' '}
                {parseFloat(solicitacao?.distancia).toFixed(2)} Km
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
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
          <Divider />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Peso
            </Text>
            <Text bold>{carga.peso}Kg</Text>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Altura
            </Text>
            <Text bold>{carga.altura}m</Text>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Largura
            </Text>
            <Text bold>{carga.largura}m</Text>
          </View>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text bold color={colors.grayDark}>
              Comprimento
            </Text>
            <Text bold>{carga.comprimento}m</Text>
          </View>
          <Divider />
          <View style={{ marginBottom: 25 }}>
            <Text textAlign="center" bold color={colors.grayDark}>
              Observação
            </Text>
            <Text textAlign="center">{carga.obs || '-'}</Text>
          </View>

          <View style={[styles.row, { justifyContent: 'space-evenly' }]}>
            {!carga.perigosa ? null : (
              <Chip
                textStyle={{ fontSize: 12 }}
                style={{ height: 30, justifyContent: 'center' }}
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

        <View style={styles.section}>
          <View style={{ alignItems: 'center' }}>
            <Text bold>MOTORISTA</Text>
            <RowView justifyContent="space-between">
              <View style={{ alignItems: 'center' }}>
                <Text color={colors.grayDark}>Nome</Text>
                <Text>
                  {frete.motorista?.nome + ' ' + frete.motorista?.apelido}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text color={colors.grayDark}>Telefone</Text>
                <Text>{frete.motorista?.telefone}</Text>
              </View>
            </RowView>
          </View>

          <Divider style={{ marginVertical: 10 }} />

          <View style={{ alignItems: 'center' }}>
            <Text bold>AUTOMÓVEL</Text>
            <RowView justifyContent="space-between">
              <View style={{ alignItems: 'center' }}>
                <Text color={colors.grayDark}>Matrícula</Text>
                <Text>{frete.automovel?.matricula}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text color={colors.grayDark}>Marca</Text>
                <Text>{frete.automovel?.marca?.nome}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text color={colors.grayDark}>Modelo</Text>
                <Text>{frete.automovel?.modelo?.nome}</Text>
              </View>
            </RowView>
          </View>
        </View>
      </ScrollView>
      {/**
         *
        "automovel": {
        "motor": "teste",
        "comprimento": "10",
        "altura": "10",
        "largura": "10",

        "img1": null,
        "img2": null,
        "img3": null,

        "categoria": { "nome": "Herdeiro lele" }
         */}
      {frete.estadoFrete.nome !== 'Activo' ? null : (
        <View style={styles.bottomBar}>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('tracking', { frete: solicitacao })
            }
          >
            Acompanhamento / Tracking
          </Button>
        </View>
      )}
    </SafeArea>
  );
};
