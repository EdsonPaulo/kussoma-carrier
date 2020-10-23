import Icon from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Button, Dialog, Portal } from 'react-native-paper';
import { CustomInput, HeaderBar } from '../../components';
import { colors } from '../../constants';
import { RowView, SafeArea, Text } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';
import api from '../../services/api';
import { getCameraPermission } from '../../utils';
import FormCarga from './form-carga';
import FormEndereco from './form-endereco';
import styles from './styles';

export default index = () => {
  const navigation = useNavigation();
  const { user, role, token } = useContext(authContext);

  const [solicitacaoData, setSolicitacaoData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [observacaoText, setObservacaoText] = useState(null);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);

  const saveSolicitacao = async data => {
    if (saving) return;
    try {
      setSaving(true);
      console.log(JSON.stringify(data));
      const response = await api(token).post('/cliente/solicitacao', data);
      console.log(response.data);
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const renderStepControl = (stepInfo, isActive) => (
    <View style={{ marginTop: 10 }}>
      <Badge
        size={25}
        style={{
          alignSelf: 'center',
          backgroundColor: isActive ? colors.primaryDark : colors.grayMedium,
        }}
      >
        {stepInfo}
      </Badge>
      <Text fontSize="10px" color={colors.grayDark}>
        {(stepInfo == 1 && 'Detalhes da Carga') ||
          (stepInfo == 2 && 'Origem e Destino') ||
          (stepInfo == 3 && 'Finalizar')}
      </Text>
    </View>
  );

  const handleFormCarga = cargaData => {
    console.log(cargaData);
    if (cargaData) {
      setSolicitacaoData({ ...solicitacaoData, ...cargaData });
      setStep(step + 1);
    }
  };

  const handleFormEndereco = enderecoData => {
    console.log(enderecoData);
    if (enderecoData) {
      setSolicitacaoData({ ...solicitacaoData, ...enderecoData });
      setStep(step + 1);
    }
  };

  const submitSolicitacao = () => {
    saveSolicitacao({ ...solicitacaoData, descricao: observacaoText });
  };

  useEffect(() => {
    setSolicitacaoData({});
    getCameraPermission();
  }, []);

  return (
    <SafeArea>
      <HeaderBar back title={'Criar Novo Frete'} />

      <ScrollView style={{}}>
        <RowView justifyContent="space-around">
          {renderStepControl(1, step == 1)}
          {renderStepControl(2, step == 2)}
          {renderStepControl(3, step == 3)}
        </RowView>

        <View style={styles.section}>
          {step == 3 && (
            <>
              <Text bold marginVertical="10px" textAlign="center">
                Quer fazer alguma observação sobre o frete?
              </Text>
              <CustomInput
                multiline
                height={100}
                onChangeText={value => setObservacaoText(value)}
                placeholder="Qualquer observação sobre o frete"
              />
            </>
          )}

          {(step == 1 && <FormCarga handleFormCarga={handleFormCarga} />) ||
            (step == 2 && (
              <FormEndereco handleFormEndereco={handleFormEndereco} />
            ))}

          {step != 1 && (
            <Button
              mode="outlined"
              icon="arrow-left"
              style={{ marginBottom: 15 }}
              onPress={() => setStep(step - 1)}
            >
              Voltar
            </Button>
          )}

          {step == 3 && (
            <Button
              loading={saving}
              icon="plus"
              mode="contained"
              onPress={submitSolicitacao}
            >
              Criar Frete
            </Button>
          )}
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={modalVisible} dismissable={false}>
          <Dialog.Content>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Icon
                name="ios-checkmark-circle"
                style={{ alignSelf: 'center' }}
                size={50}
                color={colors.success}
              />
              <Text fontSize="15px" bold>
                FRETE CRIADO COM SUCESSO!
              </Text>
            </View>
            <Text
              color={colors.textDark}
              textAlign="justify"
              marginVertical="5px"
              fontSize="14px"
            >
              A sua, a sua conta foi solicitação para frete foi criado com
              sucesso. Avisaremos quando um nova proposta for feita!
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('solicitacoes');
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeArea>
  );
};
