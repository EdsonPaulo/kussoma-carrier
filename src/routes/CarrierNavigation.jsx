import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { HeaderBar, HomeTabBar, SideBar } from '../components';
import authContext from '../contexts/auth/auth-context';
import {
  CarDetails,
  FreteDetails,
  Fretes,
  HomeCarrier,
  ProfileScreen,
  Propostas,
  SolicitacaoDetails,
  Solicitacoes,
  TrackingScreen,
} from '../screens';

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ header: props => <HeaderBar {...props} /> }}
    >
      <Stack.Screen
        name="home"
        options={{ title: 'KUSSOMA', subtitle: 'DSADA' }}
        component={HomeCarrier}
      />
    </Stack.Navigator>
  );
};
const FreteStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ header: props => <HeaderBar {...props} /> }}
    >
      <Stack.Screen
        name="fretes"
        options={{ title: 'Meus Fretes' }}
        component={Fretes}
      />
    </Stack.Navigator>
  );
};
const SolicitacaoStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{ header: props => <HeaderBar {...props} /> }}
    >
      <Stack.Screen
        name="solicitacoes"
        options={{ title: 'Solicitações de Frete' }}
        component={Solicitacoes}
      />
    </Stack.Navigator>
  );
};
const HomeTab = () => {
  const { role } = useContext(authContext);
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator tabBar={props => <HomeTabBar {...props} />}>
      <Tabs.Screen
        name="home"
        component={HomeStack}
        options={{ tabBarLabel: 'Página Inicial' }}
      />
      <Tabs.Screen
        name="fretes"
        component={FreteStack}
        options={{ tabBarLabel: 'Meus Fretes', tabBarVisible: false }}
      />
      {role === 'ROLE_MOTORISTA' ? null : (
        <Tabs.Screen
          name="solicitacoes"
          component={SolicitacaoStack}
          options={{ tabBarLabel: 'Fretes Disponíveis' }}
        />
      )}
    </Tabs.Navigator>
  );
};

const DrawerNavigation = () => {
  const { role } = useContext(authContext);
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerType="slide"
      drawerContent={props => <SideBar {...props} />}
    >
      <Drawer.Screen name="homeTab" component={HomeTab} />
      <Drawer.Screen
        name="freteDetails"
        options={{ title: 'Detalhes do Frete' }}
        component={FreteDetails}
      />
      <Drawer.Screen
        name="profile"
        options={{ title: 'Meu Perfil' }}
        component={ProfileScreen}
      />
      {role === 'ROLE_MOTORISTA' ? null : (
        <>
          <Drawer.Screen
            name="tracking"
            options={{ title: 'Tracking' }}
            component={TrackingScreen}
          />
          <Drawer.Screen
            name="solicitacaoDetails"
            options={{ title: 'Detalhes da Solicitação' }}
            component={SolicitacaoDetails}
          />
          <Drawer.Screen
            name="carDetails"
            options={{ title: 'Meu Automóvel' }}
            component={CarDetails}
          />
          <Drawer.Screen
            name="propostas"
            options={{ title: 'Propostas Feitas' }}
            component={Propostas}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
