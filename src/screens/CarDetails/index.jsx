import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-community/picker';
import React, { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  View,
} from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { CustomInput, HeaderBar } from '../../components';
import { colors } from '../../constants';
//import styles from './styles'
import { Container, RowView, SafeArea, Text } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';

export default index = () => {
  let isMounted = true;
  const { user, token } = useContext(authContext);
  const [editable, setEditable] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [marcaLoading, setMarcaLoading] = useState(false);
  const [modeloLoading, setModeloLoading] = useState(false);

  const [selectedItems, setSelectedItem] = useState({
    marcaId: null,
    modeloId: null,
  });

  const [marcaList, setMarcaList] = useState([]);
  const [modeloList, setModeloList] = useState([]);

  const [automovel, setAutomovel] = useState({
    matricula: null,
    marca: null,
    modelo: null,
    pesoSuportado: null,
    altura: null,
    largura: null,
    comprimento: null,

    marcaid: selectedItems.marcaId,
    modeloid: selectedItems.modeloId,
  });

  const inputProps = editable
    ? {}
    : { inline: true, enabled: false, disabled: true, editable: false };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      ToastAndroid.show('Dados salvos com sucesso!', 1000);
      setSaving(false);
      setEditable(false);
    }, 2000);
  };

  const getMarcaList = async () => {
    if (marcaLoading) return;
    setMarcaLoading(true);
    try {
      const response = await api(token).get('/marca');
      console.log(response.data);
      setMarcaList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setMarcaLoading(false);
    }
  };

  const getModeloList = async marcaId => {
    if (modeloLoading || marcaLoading) return;
    setModeloLoading(true);
    try {
      const response = await api(token).get(`/modelo`);
      console.log(response.data);
      setModeloList(
        response.data?.filter(modelo => modelo.marca?.id === marcaId),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setModeloLoading(false);
    }
  };

  const getAutomovel = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api(token).get('/automovel');
      console.log(response.data);
      console.log(response.data?.data[0]);
      if (response.data?.data) {
        const automovelData = response.data.data[0];
        setAutomovel({
          matricula: automovelData.matricula,
          marca: automovelData.marca,
          modelo: automovelData.modelo,
          pesoSuportado: automovelData.pesoSuportado,
          altura: automovelData.altura,
          largura: automovelData.largura,
          comprimento: automovelData.comprimento,

          marcaid: automovelData.marca?.id,
          modeloid: automovelData.modelo?.id,
        });
        setSelectedItem({
          marcaId: automovelData.marca?.id,
          modeloId: automovelData.modelo?.id,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveAutomovel = async () => {
    if (loading || saving) return;
    setSaving(true);
    try {
      const response = await api(token).post('/automovel', automovel);
      console.log(response.data);
      ToastAndroid.show('Dados salvos com sucesso!', 1000);
      setEditable(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (isMounted) {
      getMarcaList();
      // getModeloList()
      getAutomovel();
    }
    return () => (isMounted = false);
  }, []);

  return (
    <SafeArea style={{ backgroundColor: '#FFF' }}>
      <HeaderBar back title="Meu Automóvel" />
      {loading ? (
        <Container style={{ alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.dark} />
          <Text>Carregando Dados</Text>
        </Container>
      ) : !automovel && !editable ? (
        <Container style={{ alignItems: 'center' }}>
          <Text fontSize="16px" style={{}} color={colors.grayDark}>
            Não tem nenhum automóvel cadastrado!
          </Text>
          <Text
            fontSize="16px"
            style={{ marginBottom: 15 }}
            color={colors.grayDark}
          >
            Cadastre um para poder começar um trabalho.
          </Text>

          <Button
            icon="plus"
            mode="contained"
            onPress={() => setEditable(true)}
          >
            Cadastrar Automóvel
          </Button>

          <Icon
            style={{ position: 'absolute', top: 10, right: 10 }}
            name="refresh"
            onPress={getAutomovel}
            size={35}
            color={colors.grayDark}
          />
        </Container>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ padding: 15 }}
          >
            <Text
              title
              color={colors.grayDark}
              textAlign="center"
              fontSize="22px"
              style={{ marginBottom: 20 }}
            >
              {editable && automovel
                ? 'Editar Automóvel'
                : 'Cadastrar Automóvel'}
            </Text>

            <RowView>
              <View style={{ marginRight: 8, flex: 1 }}>
                <Text>Marca</Text>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.grayMedium,
                    borderRadius: 5,
                    flexDirection: 'row',
                    paddingRight: 5,
                  }}
                >
                  <Picker
                    {...inputProps}
                    style={{ height: 40, flex: 1 }}
                    selectedValue={selectedItems.marcaId}
                    onValueChange={(marca, index) => {
                      setSelectedItem({ ...selectedItems, marcaId: marca });
                      getModeloList(marca);
                    }}
                  >
                    {marcaList.map(marca => (
                      <Picker.Item
                        key={index}
                        label={marca.nome}
                        value={marca.id}
                      />
                    ))}
                  </Picker>
                  {!marcaLoading ? null : (
                    <ActivityIndicator animating size="small" />
                  )}
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text fontSize="10px">Modelo</Text>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.grayMedium,
                    borderRadius: 5,
                    flexDirection: 'row',
                    paddingRight: 5,
                  }}
                >
                  <Picker
                    {...inputProps}
                    selectedValue={selectedItems.modeloId}
                    style={{ height: 40, flex: 1 }}
                    onValueChange={(modelo, index) =>
                      setSelectedItem({ ...selectedItems, modeloId: modelo })
                    }
                  >
                    {modeloList.map(modelo => (
                      <Picker.Item
                        key={index}
                        label={modelo.nome}
                        value={modelo.id}
                      />
                    ))}
                  </Picker>
                  {!modeloLoading ? null : (
                    <ActivityIndicator animating size="small" />
                  )}
                </View>
              </View>
            </RowView>

            <CustomInput
              {...inputProps}
              height={40}
              label="Matrícula"
              value={automovel?.matricula}
              onChangeText={value =>
                setAutomovel({ ...automovel, matricula: value })
              }
              placeholder="LD-XX-XX-XX"
              style={{}}
            />

            <RowView>
              <CustomInput
                type="number"
                {...inputProps}
                placeholder="peso em kg"
                style={{ flex: 1, marginRight: 8 }}
                height={40}
                label="Peso Suportado (Kg)"
                value={automovel?.pesoSuportado}
                onChangeText={value =>
                  setAutomovel({ ...automovel, pesoSuportado: value })
                }
              />

              <CustomInput
                type="number"
                {...inputProps}
                placeholder="comprimento"
                style={{ flex: 1 }}
                height={40}
                label="Comprimento (m)"
                value={automovel?.comprimento}
                onChangeText={value =>
                  setAutomovel({ ...automovel, comprimento: value })
                }
              />
            </RowView>

            <RowView>
              <CustomInput
                type="number"
                {...inputProps}
                placeholder="altura do automóvel"
                style={{ flex: 1, marginRight: 8 }}
                height={40}
                label="Altura (Kg)"
                value={automovel?.altura}
                onChangeText={value =>
                  setAutomovel({ ...automovel, altura: value })
                }
              />

              <CustomInput
                type="number"
                {...inputProps}
                placeholder="largura em metros"
                style={{ flex: 1 }}
                height={40}
                label="Largura (m)"
                value={automovel?.largura}
                onChangeText={value =>
                  setAutomovel({ ...automovel, largura: value })
                }
              />
            </RowView>

            <RowView style={{ marginVertical: 15 }}>
              {editable ? (
                <>
                  <Button
                    icon="close"
                    style={{ flex: 1, marginRight: 5 }}
                    onPress={() => setEditable(false)}
                  >
                    Cancelar
                  </Button>

                  <Button
                    icon="floppy"
                    style={{ flex: 1 }}
                    mode="contained"
                    loading={saving}
                    onPress={() => {}}
                  >
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <View style={{ flex: 1, marginRight: 5 }} />

                  <Button
                    icon="pencil"
                    mode="contained"
                    style={{ flex: 1 }}
                    onPress={() => setEditable(true)}
                  >
                    Editar
                  </Button>
                </>
              )}
            </RowView>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeArea>
  );
};
