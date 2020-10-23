import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Avatar, Card, IconButton } from 'react-native-paper';
import styled from 'styled-components/native';
import { colors } from '../constants';
import { Text } from '../constants/styles';
import authContext from '../contexts/auth/auth-context';
import api from '../services/api';

export default PropostaCard = proposta => {
  const navigation = useNavigation();
  const { token, role } = useContext(authContext);

  const cancelarProposta = async () => {
    try {
      const response = await api(token).post(
        `/cancelar_proposta/${proposta?.id}`,
      );
      if (response.data) {
        console.log('Proposta cancelada!');
      }
    } catch (error) {}
  };

  return (
    <Card>
      <Card.Title
        title="Card Title"
        subtitle="Card Subtitle"
        left={props => <Avatar.Icon {...props} icon="folder" />}
        right={props => (
          <IconButton {...props} icon="more-vert" onPress={() => {}} />
        )}
      />
      <Card.Content>
        <Text>{JSON.stringify(proposta)}</Text>
      </Card.Content>

      <Card.Actions>
        <Button
          onPress={() =>
            Alert.alert(
              'Cancelando Proposta',
              'Deseja cancelar a sua proposta?',
              [
                { text: 'Não', style: 'cancel' },
                { text: 'SIm', onPress: () => logout() },
              ],
              { cancelable: true },
            )
          }
        >
          Cancelar
        </Button>
      </Card.Actions>
    </Card>
  );
};

const Container = styled(RectButton)`
  padding: 15px
  elevation: 3
  min-height: 120px
  max-height: 300px
  height: auto
  marginVertical: 6px
  background-color: white
  border-radius: 4px
`;

const Badge = styled.Text`
    padding: 3px 10px
    font-size: 12px
    font-weight: bold
    letter-spacing: 1px
    border-radius: 15px
    font-family: "RobotoSlab_600SemiBold"
    text-transform: uppercase
    color: #ffffff
    background-color: ${props =>
      props.estado === 'Activo'
        ? colors.primary
        : props.estado === 'Concluido'
        ? colors.success
        : props.estado === 'Cancelado'
        ? colors.alert
        : colors.dark}

`;
