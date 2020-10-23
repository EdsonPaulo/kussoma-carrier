import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Avatar, Button, Dialog, Divider, Portal } from 'react-native-paper';
import { colors, metrics } from '../constants';
import { RowView, Text } from '../constants/styles';
import AuthContext from '../contexts/auth/auth-context';
import { onRate, onShare } from '../utils';

export default SideBar = () => {
  const navigation = useNavigation();
  const { user, role, logout } = useContext(AuthContext);
  //const initials = (user?.nome?.trim()?.split(" ")[0][0] + user?.nome?.trim()?.split(" ")[1][0]) || user?.nome[0]
  const initials = user?.nome ? user?.nome[0] : null;

  const [modalVisible, setModalVisible] = useState(false);

  const signOut = () => {
    Alert.alert(
      'Terminar Sessão',
      'Deseja terminar sessão da sua conta?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => logout() },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Avatar.Text
          size={50}
          label={initials}
          style={{ elevation: 1, marginRight: 8 }}
        />
        <View>
          <Text
            bold
            fontSize="17px"
            textAlign="left"
            marginVertical="0px"
            color={colors.dark}
          >
            {user?.nome}
          </Text>
          <Text textAlign="left">
            {role === 'ROLE_MOTORISTA' ? 'Motorista' : 'Motorista Autónomo'}
          </Text>
          <Text marginVertical="0px" textAlign="left">
            {user?.telefone || user?.email}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.optionsContainer}>
        <RectButton
          style={styles.btn}
          onPress={() => {
            navigation.navigate('home');
          }}
        >
          <RowView>
            <MaterialCommunityIcons name="home-outline" style={styles.icons} />
            <Text>Página Inicial</Text>
          </RowView>
        </RectButton>

        <RectButton
          style={styles.btn}
          onPress={() => {
            navigation.navigate('profile');
          }}
        >
          <RowView>
            <MaterialCommunityIcons
              name="account-outline"
              style={styles.icons}
            />
            <Text>Meu Perfil</Text>
          </RowView>
        </RectButton>
        {role !== 'ROLE_AUTONOMO' ? null : (
          <RectButton
            style={styles.btn}
            onPress={() => {
              navigation.navigate('carDetails');
            }}
          >
            <RowView>
              <MaterialCommunityIcons name="car-back" style={styles.icons} />
              <Text>Meu Automóvel</Text>
            </RowView>
          </RectButton>
        )}
        <RectButton
          style={styles.btn}
          onPress={() => {
            navigation.navigate('fretes');
          }}
        >
          <RowView>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              style={styles.icons}
            />
            <Text> Meus Fretes </Text>
          </RowView>
        </RectButton>
        {role === 'ROLE_MOTORISTA' ? null : (
          <>
            <RectButton
              style={styles.btn}
              onPress={() => {
                navigation.navigate('propostas');
              }}
            >
              <RowView>
                <FontAwesome
                  name="handshake-o"
                  color={colors.dark}
                  size={20}
                  style={{ marginRight: 5 }}
                />
                <Text>Minhas Propostas</Text>
              </RowView>
            </RectButton>

            <RectButton
              style={styles.btn}
              onPress={() => {
                navigation.navigate('solicitacoes');
              }}
            >
              <RowView>
                <MaterialCommunityIcons
                  name="bullhorn-outline"
                  style={styles.icons}
                />
                <Text>Fretes Disponíveis</Text>
              </RowView>
            </RectButton>
          </>
        )}
        <Divider />

        <RectButton style={styles.btn} onPress={onShare}>
          <RowView>
            <MaterialCommunityIcons name="share-outline" style={styles.icons} />
            <Text>Compartilhar </Text>
          </RowView>
        </RectButton>

        <RectButton style={styles.btn} onPress={onRate}>
          <RowView>
            <MaterialCommunityIcons name="star-outline" style={styles.icons} />
            <Text>Avalie-nos </Text>
          </RowView>
        </RectButton>

        <RectButton style={styles.btn} onPress={() => setModalVisible(true)}>
          <RowView>
            <MaterialCommunityIcons
              name="help-circle-outline"
              style={styles.icons}
            />
            <Text>Ajuda e Suporte </Text>
          </RowView>
        </RectButton>

        <RectButton
          style={[
            styles.btn,
            { left: metrics.baseMargin, bottom: '10%', position: 'absolute' },
          ]}
          onPress={signOut}
        >
          <RowView>
            <MaterialCommunityIcons name="power" style={styles.icons} />
            <Text>Terminar Sessão </Text>
          </RowView>
        </RectButton>
        <Portal>
          <Dialog
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
          >
            <Dialog.Content>
              <View style={{ alignItems: 'center', marginBottom: 15 }}>
                <MaterialCommunityIcons name="headphones" size={25} />
                <Text fontSize="20px" bold>
                  Ajuda e Suporte
                </Text>
              </View>
              <Text textAlign="justify" fontSize="16px">
                Se estiver em dificuldades, alguma dúvida ou sugestões, entre em
                contacto e fale conosco pelas vias:
              </Text>
              <Text
                textAlign="center"
                fontSize="16px"
                style={{ marginTop: 10 }}
              >
                Whatsapp
              </Text>
              <Text textAlign="center" fontSize="17px" bold>
                +244 942 682 194
              </Text>
              <Text
                textAlign="center"
                fontSize="16px"
                style={{ marginTop: 10 }}
              >
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  userContainer: {
    padding: metrics.doubleBaseMargin,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 'auto',
    backgroundColor: colors.bgColor,
  },
  optionsContainer: {
    padding: metrics.baseMargin,
    flex: 1,
  },
  icons: {
    color: colors.dark,
    fontSize: 26,
    marginRight: 3,
  },
  btn: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: metrics.baseMargin,
    marginVertical: 1,
  },
});
