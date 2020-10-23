import { Picker } from '@react-native-community/picker';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActivityIndicator, Button, Divider } from 'react-native-paper';
import { CustomDatePicker, CustomInput } from '../../components';
import { colors } from '../../constants';
import { RowView, Text } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import { convertDateDMY, convertDateYMD } from '../../utils';
import styles from './styles';

export default FormCarga = ({ handleFormEndereco }) => {
  const { token } = useContext(authContext);
  const [enderecoValues, setEnderecoValues] = useState({
    origem: {
      provinciaid: null,
      municipioid: null,
      responsavel: null,
      telefone: null,
      endereco: null,
      paisid: 8,
      estado: 1,
    },
    destino: {
      provinciaid: null,
      municipioid: null,
      responsavel: null,
      telefone: null,
      endereco: null,
      paisid: 8,
      estado: 1,
    },
  });
  // ORIGEM
  const [dataCarregamento, setDataCarregamento] = useState(new Date());
  const [timeCarregamento, setTimeCarregamento] = useState(new Date());

  const [provinciaOrigemSelected, setProvinciaOrigemSelected] = useState({});
  const [provinciaOrigemList, setProvinciaOrigemList] = useState([]);
  const [provinciaOrigemLoading, setProvinciaOrigemLoading] = useState(false);

  const [municipioOrigemSelected, setMunicipioOrigemSelected] = useState({});
  const [municipioOrigemList, setMunicipioOrigemList] = useState([]);
  const [municipioOrigemLoading, setMunicipioOrigemLoading] = useState(false);

  // DESTINO
  const [dataEntrega, setDataEntrega] = useState(new Date());
  const [timeEntrega, setTimeEntrega] = useState(new Date());

  const [provinciaDestinoSelected, setProvinciaDestinoSelected] = useState({});
  const [provinciaDestinoList, setProvinciaDestinoList] = useState([]);
  const [provinciaDestinoLoading, setProvinciaDestinoLoading] = useState(false);

  const [municipioDestinoSelected, setMunicipioDestinoSelected] = useState({});
  const [municipioDestinoList, setMunicipioDestinoList] = useState([]);
  const [municipioDestinoLoading, setMunicipioDestinoLoading] = useState(false);

  const handleAddressOrigem = (data, details) => {
    console.log('Endereço selecionado', data, details);
  };

  const getProvinciaOrigemList = async () => {
    if (provinciaOrigemLoading) return;
    setProvinciaOrigemLoading(true);
    try {
      const response = await api(token).get('/provincia');
      setProvinciaOrigemList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProvinciaOrigemLoading(false);
    }
  };

  const getMunicipioOrigemList = async provincia => {
    if (municipioOrigemLoading) return;
    setMunicipioOrigemLoading(true);
    try {
      const response = await api(token).get(
        `/municipio?provincia=${provincia}`,
      );
      setMunicipioOrigemList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setMunicipioOrigemLoading(false);
    }
  };

  const getProvinciaDestinoList = async () => {
    if (provinciaDestinoLoading) return;
    setProvinciaDestinoLoading(true);
    try {
      const response = await api(token).get('/provincia');
      setProvinciaDestinoList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setProvinciaDestinoLoading(false);
    }
  };

  const getMunicipioDestinoList = async provincia => {
    if (municipioDestinoLoading) return;
    setMunicipioDestinoLoading(true);
    try {
      const response = await api(token).get(
        `/municipio?provincia=${provincia}`,
      );
      setMunicipioDestinoList(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setMunicipioDestinoLoading(false);
    }
  };

  const generateFullDate = (date, time) =>
    `${convertDateYMD(date)} ${time.toLocaleTimeString()}`;

  const getGeolocationPermission = async () => {};

  const submitAddress = () => {
    if (
      !enderecoValues.origem.telefone ||
      !enderecoValues.origem.endereco ||
      !enderecoValues.destino.telefone ||
      !enderecoValues.destino.endereco ||
      !provinciaOrigemSelected ||
      !municipioOrigemSelected ||
      !provinciaDestinoSelected ||
      !municipioDestinoSelected ||
      !dataCarregamento ||
      !dataEntrega
    ) {
      Alert.alert(
        'Preencha os campos importantes',
        'Os campos com (*) são obrigatórios!',
      );
      return;
    }

    console.log(
      'Full date: ' + generateFullDate(dataCarregamento, timeCarregamento),
    );

    const data = {
      origem: {
        ...enderecoValues.origem,
        provinciaid: provinciaOrigemSelected,
        municipioid: municipioOrigemSelected,
        dataCarregamento: generateFullDate(dataCarregamento, timeCarregamento),
      },
      destino: {
        ...enderecoValues.destino,
        provinciaid: provinciaDestinoSelected,
        municipioid: municipioDestinoSelected,
        dataEntrega: generateFullDate(dataEntrega, timeEntrega),
      },
    };
    setEnderecoValues(data);
    handleFormEndereco(data);
  };

  useEffect(() => {
    getGeolocationPermission();
    getProvinciaOrigemList();
    getProvinciaDestinoList();
  }, []);

  const handleSelectedDate = (id, date) => {
    console.log(date);
    console.log(date.toLocaleTimeString());
    console.log(date.toLocaleDateString());

    if (id === 'dataCarregamento') setDataCarregamento(date);
    else if (id == 'timeCarregamento') setTimeCarregamento(date);
    else if (id == 'dataEntrega') setDataEntrega(date);
    else if (id == 'timeEntrega') setTimeEntrega(date);
  };

  return (
    <>
      <Text
        bold
        fontSize="17px"
        color={colors.grayDark}
        style={{ marginBottom: 20 }}
      >
        Endereço de Origem
      </Text>

      <RowView>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Província *</Text>
          <View style={styles.comboBox}>
            <Picker
              style={{ height: 45, flex: 1 }}
              selectedValue={provinciaOrigemSelected}
              onValueChange={provincia => {
                setProvinciaOrigemSelected(provincia);
                setMunicipioOrigemList([]);
                getMunicipioOrigemList(provincia);
              }}
            >
              {provinciaOrigemList.map((provincia, index) => (
                <Picker.Item
                  key={index}
                  label={provincia.nome}
                  value={provincia.id}
                />
              ))}
            </Picker>
            {!provinciaOrigemLoading ? null : (
              <ActivityIndicator animating size="small" />
            )}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Município *</Text>
          <View style={styles.comboBox}>
            <Picker
              style={{ height: 45, flex: 1 }}
              selectedValue={municipioOrigemSelected}
              onValueChange={municipio => setMunicipioOrigemSelected(municipio)}
            >
              {municipioOrigemList.map((municipio, index) => (
                <Picker.Item
                  key={index}
                  label={municipio.nome}
                  value={municipio.id}
                />
              ))}
            </Picker>
            {!municipioOrigemLoading ? null : (
              <ActivityIndicator animating size="small" />
            )}
          </View>
        </View>
      </RowView>

      <Text style={styles.label}>Data e Hora de carregamento *</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <CustomDatePicker
            type="date"
            id="dataCarregamento"
            handleSelectedDate={handleSelectedDate}
          />
        </View>
        <CustomDatePicker
          type="time"
          id="timeCarregamento"
          handleSelectedDate={handleSelectedDate}
        />
      </View>

      <RowView>
        <CustomInput
          type="name"
          placeholder="Nome"
          showIcon
          style={{ flex: 1 }}
          value={enderecoValues.origem.responsavel}
          label="Responsável pela entrega *"
          onChangeText={value =>
            setEnderecoValues({
              ...enderecoValues,
              origem: {
                ...enderecoValues.origem,
                responsavel: value,
              },
            })
          }
        />
        <CustomInput
          type="phone"
          showIcon
          maxLength={9}
          label=" "
          placeholder="Telefone"
          style={{ flex: 1, marginLeft: 5 }}
          value={enderecoValues.origem.telefone}
          onChangeText={value =>
            setEnderecoValues({
              ...enderecoValues,
              origem: {
                ...enderecoValues.origem,
                telefone: value,
              },
            })
          }
        />
      </RowView>

      <CustomInput
        multiline
        label="Endereço de carregamento detalhado *"
        placeholder="ex: Av. João Saldanha, rua a, armazém xy"
        style={{ flex: 1 }}
        height={70}
        multiline
        value={enderecoValues.origem.endereco}
        onChangeText={value =>
          setEnderecoValues({
            ...enderecoValues,
            origem: {
              ...enderecoValues.origem,
              endereco: value,
            },
          })
        }
      />

      <Divider style={{ marginTop: 20 }} />

      <Text
        bold
        fontSize="17px"
        color={colors.grayDark}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        Endereço de Destino
      </Text>

      <RowView>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Província *</Text>
          <View style={styles.comboBox}>
            <Picker
              style={{ height: 45, flex: 1 }}
              selectedValue={provinciaDestinoSelected}
              onValueChange={provincia => {
                setProvinciaDestinoSelected(provincia);
                setMunicipioDestinoList([]);
                getMunicipioDestinoList(provincia);
              }}
            >
              {provinciaDestinoList.map((provincia, index) => (
                <Picker.Item
                  key={index}
                  label={provincia.nome}
                  value={provincia.id}
                />
              ))}
            </Picker>
            {!provinciaDestinoLoading ? null : (
              <ActivityIndicator animating size="small" />
            )}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Município *</Text>
          <View style={styles.comboBox}>
            <Picker
              style={{ height: 45, flex: 1 }}
              selectedValue={municipioDestinoSelected}
              onValueChange={municipio =>
                setMunicipioDestinoSelected(municipio)
              }
            >
              {municipioDestinoList.map((municipio, index) => (
                <Picker.Item
                  key={index}
                  label={municipio.nome}
                  value={municipio.id}
                />
              ))}
            </Picker>
            {!municipioDestinoLoading ? null : (
              <ActivityIndicator animating size="small" />
            )}
          </View>
        </View>
      </RowView>

      <Text style={styles.label}>Data e Hora de entrega *</Text>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <CustomDatePicker
            type="date"
            id="dataEntrega"
            minimumDate={dataCarregamento}
            handleSelectedDate={handleSelectedDate}
          />
        </View>
        <CustomDatePicker
          type="time"
          id="timeEntrega"
          handleSelectedDate={handleSelectedDate}
        />
      </View>

      <RowView>
        <CustomInput
          showIcon
          type="name"
          placeholder="Nome"
          style={{ flex: 1 }}
          value={enderecoValues.destino.responsavel}
          label="Responsável por receber *"
          onChangeText={value =>
            setEnderecoValues({
              ...enderecoValues,
              destino: {
                ...enderecoValues.destino,
                responsavel: value,
              },
            })
          }
        />

        <CustomInput
          showIcon
          label=" "
          type="phone"
          maxLength={9}
          placeholder="Telefone"
          style={{ flex: 1, marginLeft: 5 }}
          value={enderecoValues.destino.telefone}
          onChangeText={value =>
            setEnderecoValues({
              ...enderecoValues,
              destino: {
                ...enderecoValues.destino,
                telefone: value,
              },
            })
          }
        />
      </RowView>

      <CustomInput
        label="Endereço de descarga detalhado *"
        placeholder="ex: Av. João Saldanha, rua a, armazém xy"
        style={{ flex: 1 }}
        height={70}
        multiline
        value={enderecoValues.destino.endereco}
        onChangeText={value =>
          setEnderecoValues({
            ...enderecoValues,
            destino: {
              ...enderecoValues.destino,
              endereco: value,
            },
          })
        }
      />

      {/**
      <View>
        <Text style={styles.label}>Endereço</Text>
        <GooglePlacesInput handleAddress={handleAddressOrigem} />
      </View>
     */}
      <Button
        style={{ marginVertical: 15 }}
        mode="contained"
        icon="arrow-right"
        onPress={submitAddress}
      >
        Continuar
      </Button>
    </>
  );
};
