import { yupResolver } from '@hookform/resolvers';
import { Picker } from '@react-native-community/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';
import { ActivityIndicator, Button, Checkbox } from 'react-native-paper';
import * as yup from 'yup';
import { CustomInput, ImageUpload } from '../../components';
import { colors } from '../../constants';
import { RowView, Text } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import styles from './styles';

export default FormCarga = ({ handleFormCarga }) => {
  const navigation = useNavigation();
  const { token } = useContext(authContext);
  const [cargaValues, setCargaValues] = useState({
    tipoCargaid: null,
    perigosa: 0,
    controlTemp: 0,
    img1: null,
    img2: null,
    img3: null,
    estado: 1,
  });
  const [imageList, setImageList] = useState([]);
  const [tipoCargaList, setTipoCargaList] = useState([]);
  const [tipoCargaLoading, setTipoCargaLoading] = useState(false);

  const cargaSchema = yup.object().shape({
    peso: yup
      .number()
      .required('peso da carga é obrigatório')
      .positive('peso inválido'),
    altura: yup
      .number()
      .required('altura é obrigatória')
      .positive('altura inválida'),
    largura: yup
      .number()
      .required('largura é obrigatório')
      .positive('largura inválida'),
    comprimento: yup
      .number()
      .required('comprimento é obrigatório')
      .positive('valor inválido'),
    quantidade: yup.number(),
  });

  const { control, handleSubmit, errors, setValue, getValues } = useForm({
    resolver: yupResolver(cargaSchema),
  });

  const verifyValue = value => (isNaN(value) || value == '' ? 0 : value);

  const getTipoCargaList = async () => {
    if (tipoCargaLoading) return;
    setTipoCargaLoading(true);
    try {
      const response = await api(token).get('/tipo_carga');
      setTipoCargaList(response.data);
    } catch (error) {
      console.log(error);
      Alert(
        `Ocorreu um erro ao carregar dados. Verifique a sua conexão e tente novamente!`,
      );
      navigation.goBack();
    } finally {
      setTipoCargaLoading(false);
    }
  };

  const handleChoosePhoto = img => {
    console.log('imagem escolhida', img);
    setImageList([...imageList, img]);
  };

  const onSubmit = data => {
    const cargaData = {
      ...data,
      ...cargaValues,
      img1: imageList[0] || null,
      img2: imageList[1] || null,
      img3: imageList[2] || null,
    };
    setCargaValues(cargaData);
    handleFormCarga({
      cargas: [
        {
          ...cargaData,
          perigosa: cargaValues.perigosa || 0,
          controlTemp: cargaValues.controlTemp || 0,
        },
      ],
    });
  };

  useEffect(() => {
    setCargaValues({});
    getTipoCargaList();
  }, []);

  return (
    <>
      <Text
        bold
        fontSize="17px"
        color={colors.grayDark}
        style={{ marginBottom: 20 }}
      >
        Detalhes da Carga
      </Text>
      <View>
        <Text style={styles.label}>Tipo de Carga *</Text>
        <View style={styles.comboBox}>
          <Picker
            style={{ height: 45, flex: 1 }}
            selectedValue={cargaValues.tipoCargaid}
            onValueChange={value =>
              setCargaValues({ ...cargaValues, tipoCargaid: value })
            }
          >
            {tipoCargaList.map(tipoCarga => (
              <Picker.Item
                key={index}
                label={tipoCarga.nome}
                value={tipoCarga.id}
              />
            ))}
          </Picker>
          {!tipoCargaLoading ? null : (
            <ActivityIndicator animating size="small" />
          )}
        </View>
      </View>

      <RowView>
        <Controller
          control={control}
          defaultValue={0}
          name="peso"
          render={({ onChange, onBlur, value }) => (
            <CustomInput
              value={value === 0 ? '' : value.toString()}
              type="number"
              placeholder="0.0"
              onBlur={onBlur}
              label="Peso (Kg) *"
              style={{ flex: 1 }}
              error={errors?.peso?.message}
              onChangeText={value => onChange(verifyValue(value))}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="quantidade"
          render={({ onChange, onBlur, value }) => (
            <CustomInput
              onBlur={onBlur}
              value={value === 0 ? '' : value.toString()}
              label="Quantidade"
              type="number"
              placeholder="0"
              error={errors?.quantidade?.message}
              onChangeText={value => onChange(verifyValue(value))}
              style={{ flex: 1, marginRight: 5, marginLeft: 5 }}
            />
          )}
        />
      </RowView>

      <RowView>
        <Controller
          control={control}
          defaultValue={0}
          name="altura"
          render={({ onChange, onBlur, value }) => (
            <CustomInput
              onBlur={onBlur}
              value={value === 0 ? '' : value.toString()}
              label="Altura (m) *"
              type="number"
              placeholder="0.0"
              error={errors?.altura?.message}
              onChangeText={value => onChange(verifyValue(value))}
              style={{ flex: 1 }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="largura"
          render={({ onChange, onBlur, value }) => (
            <CustomInput
              onBlur={onBlur}
              value={value === 0 ? '' : value.toString()}
              label="Largura (m) *"
              type="number"
              placeholder="0.0"
              error={errors?.largura?.message}
              onChangeText={value => onChange(verifyValue(value))}
              style={{ flex: 1, marginRight: 5, marginLeft: 5 }}
            />
          )}
        />
        <Controller
          control={control}
          defaultValue={0}
          name="comprimento"
          render={({ onChange, onBlur, value }) => (
            <CustomInput
              onBlur={onBlur}
              value={value === 0 ? '' : value.toString()}
              label="Comprimento (m) *"
              type="number"
              placeholder="0.0"
              error={errors?.comprimento?.message}
              onChangeText={value => onChange(verifyValue(value))}
              style={{ flex: 1 }}
            />
          )}
        />
      </RowView>

      <RowView>
        <Checkbox.Item
          label="Perigosa?"
          status={cargaValues.perigosa ? 'checked' : 'unchecked'}
          onPress={() =>
            setCargaValues({
              ...cargaValues,
              perigosa: cargaValues.perigosa ? 0 : 1,
            })
          }
        />
        <Checkbox.Item
          label="Controlar temperatura?"
          status={cargaValues.controlTemp ? 'checked' : 'unchecked'}
          onPress={() =>
            setCargaValues({
              ...cargaValues,
              controlTemp: cargaValues.controlTemp ? 0 : 1,
            })
          }
        />
      </RowView>

      <Text>Imagens da Carga *</Text>
      <RowView justifyContent="space-between">
        <ImageUpload handleChoosePhoto={handleChoosePhoto} />
        <ImageUpload handleChoosePhoto={handleChoosePhoto} />
        <ImageUpload handleChoosePhoto={handleChoosePhoto} />
      </RowView>

      <Button
        mode="contained"
        icon="arrow-right"
        style={{ marginVertical: 5 }}
        onPress={() => handleSubmit(onSubmit)()}
      >
        Continuar
      </Button>
    </>
  );
};
