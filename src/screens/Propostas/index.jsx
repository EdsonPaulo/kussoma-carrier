import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import {
  CustomInput,
  CustomButton,
  HeaderBar,
  PropostaList,
} from '../../components';
import authContext from '../../contexts/auth/auth-context';

import api from '../../services/api';

import styles from './styles';
import { SafeArea, Text } from '../../constants/styles';

export default index = () => {
  let isMounted = true;
  const navigation = useNavigation();
  const { user, role, logout, token } = useContext(authContext);

  const getPropostas = () => {};

  useEffect(() => {
    getPropostas();

    return () => (isMounted = false);
  }, []);

  const renderForMotorista = () => {
    return <View />;
  };

  return (
    <SafeArea>
      <HeaderBar
        back
        title={
          role === 'ROLE_CLIENTE'
            ? 'Propostas de Solicitações'
            : 'Minhas Propostas'
        }
      />
      <PropostaList />
    </SafeArea>
  );
};
