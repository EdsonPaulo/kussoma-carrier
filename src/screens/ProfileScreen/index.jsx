import { FontAwesome5 } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, ToastAndroid, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { Button } from 'react-native-paper';
import { CustomButton, CustomInput, HeaderBar } from '../../components';
import { constants } from '../../constants';
import { RowView, SafeArea } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import styles from './styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default index = () => {
  let isMounted = true;
  const modalizeRef = useRef();
  const { user, role, token } = useContext(authContext);
  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({ ...user });
  const inputStyle = editable ? null : { borderWidth: 0 };

  const openModal = () => modalizeRef.current?.open();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      ToastAndroid.show('Dados salvos com sucesso!', 1000);
      setSaving(false);
      setEditable(false);
    }, 2000);
  };

  const getUser = async () => {
    try {
      const response = await api(token).get('/me');
      console.log(response.data);
      if (response.data) setUserInfo({ ...response.data });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isMounted) getUser();
    return () => (isMounted = false);
  }, []);

  return (
    <SafeArea>
      <HeaderBar back title="Meu Perfil" />

      <View style={styles.container}>
        <RowView justifyContent="space-between" style={{ marginBottom: 15 }}>
          <Text style={styles.title}>
            {editable ? 'Editar Perfil' : 'Detalhes do Perfil'}
          </Text>
          {editable ? null : (
            <RectButton
              style={{ alignSelf: 'flex-end', padding: 7 }}
              onPress={() => setEditable(true)}
            >
              <Text style={{ fontWeight: 'bold' }}>
                <FontAwesome5 name="edit" /> Editar
              </Text>
            </RectButton>
          )}
        </RowView>

        {editable ? null : <Text style={styles.labelStyle}>Nome</Text>}
        <CustomInput
          type="name"
          inline={!editable}
          value={userInfo?.nome}
          style={inputStyle}
          editable={editable}
          placeholder="Nome"
          onChangeText={nome => setUserInfo({ ...userInfo, nome })}
        />

        {editable ? null : <Text style={styles.labelStyle}>Telefone</Text>}
        <CustomInput
          type="phone"
          inline={!editable}
          placeholder="Número de telefone"
          style={inputStyle}
          containerStyle={{ borderWidth: 0 }}
          editable={editable}
          value={userInfo?.telefone}
          onChangeText={telefone => setUserInfo({ ...userInfo, telefone })}
        />

        {editable ? null : <Text style={styles.labelStyle}>Email</Text>}
        <CustomInput
          type="email"
          inline={!editable}
          placeholder="Email de Contacto"
          style={inputStyle}
          editable={editable}
          value={userInfo?.email}
          onChangeText={email => setUserInfo({ ...userInfo, email })}
        />

        {/** <CustomInput type="address" inline value={userInfo.address1} style={inputStyle} editable={false} multiline /> */}
        <View style={{ marginTop: 20, flexDirection: 'row' }}>
          {!editable ? (
            <>
              <Button
                style={{ flex: 1, elevation: 3 }}
                icon="lock"
                mode="contained"
                onPress={openModal}
              >
                <Text>Alterar Senha</Text>
              </Button>
            </>
          ) : (
            <>
              <Button
                style={{ flex: 1 }}
                primary
                onPress={() => setEditable(false)}
              >
                <Text>Cancelar</Text>
              </Button>
              <Button
                style={{ flex: 1, elevation: 3 }}
                icon="content-save"
                mode="contained"
                onPress={openModal}
              >
                <Text>Salvar</Text>
              </Button>
            </>
          )}
        </View>

        <Modalize
          ref={modalizeRef}
          modalHeight={600}
          closeOnOverlayTap={false}
          modalStyle={{ paddingHorizontal: 30 }}
          rootStyle={{ elevation: 15 }}
          HeaderComponent={() => (
            <View style={{ alignItems: 'center', paddingVertical: 25 }}>
              <Text style={[styles.title, { fontSize: 17 }]}>
                <FontAwesome5 name="lock" size={15} /> Alterar Senha
              </Text>
            </View>
          )}
        >
          <View>
            <Text style={styles.labelStyle}>Senha Actual</Text>
            <CustomInput
              type="password"
              placeholder="**********"
              onChangeText={nome => setUserInfo({ ...userInfo, nome })}
            />
          </View>

          <View>
            <Text style={styles.labelStyle}>Nova Senha</Text>
            <CustomInput
              type="password"
              placeholder="**********"
              onChangeText={nome => setUserInfo({ ...userInfo, nome })}
            />
          </View>

          <View>
            <Text style={styles.labelStyle}>Confirmar Senha</Text>
            <CustomInput
              type="password"
              placeholder="**********"
              containerStyle={{ borderWidth: 0 }}
              onChangeText={telefone => setUserInfo({ ...userInfo, telefone })}
            />
          </View>
        </Modalize>
      </View>
    </SafeArea>
  );
};
