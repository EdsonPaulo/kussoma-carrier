import React, { useContext, useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import authContext from '../../contexts/auth/auth-context';
import { SafeArea, Container } from '../../constants/styles';

import styles from './styles';

import api from '../../services/api';
import SolicitacaoList from '../../components/SolicitacaoList';

export default index = () => {
  const navigation = useNavigation();
  const { user, role, logout, token } = useContext(authContext);

  return (
    <SafeArea>
      <SolicitacaoList />
    </SafeArea>
  );
};
