import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import styles from './styles';
import authContext from '../../contexts/auth/auth-context';
import { SafeArea, Container, Text } from '../../constants/styles';
import { FreteList, HeaderBar } from '../../components';
import { colors } from '../../constants';
import { RectButton } from 'react-native-gesture-handler';
import { TouchableRipple } from 'react-native-paper';

export default index = () => {
  const { user, logout, token } = useContext(authContext);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [routes] = useState([
    { key: 'all', title: 'Todos Fretes' },
    { key: 'active', title: 'Fretes Activos' },
  ]);

  const initialLayout = { width: Dimensions.get('window').width };

  const renderTabView = () => {
    const AllFretes = () => (
      <View style={{ flex: 1 }}>
        <FreteList />
      </View>
    );

    const ActiveFretes = () => (
      <View style={{ flex: 1 }}>
        <FreteList estado="Activo" />
      </View>
    );

    const renderScene = SceneMap({
      all: AllFretes,
      active: ActiveFretes,
    });

    const renderTabBar = props => {
      return (
        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => (
            <TouchableRipple
              key={i}
              onPress={() => setIndex(i)}
              style={[
                styles.tabItem,
                { borderColor: index == i ? '#fff' : 'transparent' },
              ]}
            >
              <Text color={colors.textLight} bold={index == i ? true : false}>
                {route.title}
              </Text>
            </TouchableRipple>
          ))}
        </View>
      );
    };

    return (
      <TabView
        lazy
        renderTabBar={renderTabBar}
        style={{}}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    );
  };

  return <SafeArea>{renderTabView()}</SafeArea>;
};
