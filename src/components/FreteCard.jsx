import Icon from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';
import styled from 'styled-components/native';
import { colors } from '../constants';
import { Text } from '../constants/styles';
import { convertDate, convertDateDM, convertMoney } from '../utils';

export default FreteCard = ({ isFrete, ...item }) => {
  const navigation = useNavigation();
  const frete = isFrete ? item.solicitacao : item;

  return (
    <Container
      isFrete={isFrete}
      rippleColor={colors.grayLight}
      underlayColor={colors.grayLight}
      estado={item?.estadoFrete?.nome}
      onPress={() =>
        isFrete
          ? navigation.navigate('freteDetails', { frete: item })
          : navigation.navigate('solicitacaoDetails', { solicitacao: item })
      }
    >
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text bold fontSize="17px">
            {isFrete ? `F0${item.id}` : `S0${item.id}`} - {item?.cliente?.nome}
          </Text>
          <View>
            <Text bold fontSize="16px" textAlign="right">
              {frete?.cargas[0]?.peso} Kg
            </Text>
            {frete?.distancia && (
              <Text fontSize="14px" textAlign="right">
                {parseFloat(frete?.distancia).toFixed(2) || 0} Km
              </Text>
            )}
          </View>
        </View>

        <Divider style={{ marginVertical: 10 }} />

        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="upcircle" size={12} color={colors.dark} />
            <Text
              bold
              color={colors.grayDark}
              style={{ marginLeft: 5 }}
              fontSize="10px"
            >
              Origem
            </Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text bold fontSize="16px">
              {frete?.origem?.municipio?.nome}, {frete?.origem?.provincia?.nome}{' '}
            </Text>
            <Text color={colors.grayDark} fontSize="13px">
              {convertDate(frete?.origem?.dataCarregamento)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Icon name="downcircle" size={12} color={colors.primary} />
            <Text
              bold
              color={colors.grayDark}
              style={{ marginLeft: 5 }}
              fontSize="10px"
            >
              Destino
            </Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text bold fontSize="16px">
              {frete?.destino?.municipio.nome}, {frete?.destino?.provincia.nome}{' '}
            </Text>
            <Text color={colors.grayDark} fontSize="13px">
              {convertDate(frete?.destino?.dataEntrega)}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          {!isFrete ? (
            <View />
          ) : (
            <Badge estado={item?.estadoFrete?.nome}>
              {item?.estadoFrete?.nome}
            </Badge>
          )}
          <View>
            {!isFrete ? null : (
              <Text
                bold
                fontSize="16px"
                textAlign="right"
                color={colors.primaryDark}
              >
                {convertMoney(item?.valor || 0)}
              </Text>
            )}
            <Text
              bold
              color={colors.grayDark}
              fontSize="11px"
              textAlign="right"
            >
              Criado aos {convertDateDM(item.dataReg?.data)}
            </Text>
          </View>
        </View>
      </>
    </Container>
  );
};

const Container = styled(RectButton)`
  padding: 15px;
  elevation: 3;
  min-height: 185px;
  max-height: 300px;
  height: auto;
  margin: 6px 0;
  background-color: white;
  border-radius: 4px;
`;

const Badge = styled.Text`
  padding: 3px 10px;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1px;
  border-radius: 8px;
  font-family: 'RobotoSlab_600SemiBold';
  text-transform: uppercase;
  color: #ffffff;
  background-color: ${props =>
    props.estado === 'Activo'
      ? colors.primaryDark
      : props.estado === 'Concluido'
      ? colors.success
      : props.estado === 'Cancelado'
      ? colors.alert
      : colors.dark};
`;
