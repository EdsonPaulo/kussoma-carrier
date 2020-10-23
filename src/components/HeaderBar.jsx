import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Appbar, Badge } from 'react-native-paper';
import { colors } from '../constants';
import authContext from '../contexts/auth/auth-context';

export default HeaderBar = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = useContext(authContext);

  return (
    <Appbar
      style={{
        justifyContent: 'space-between',
        marginBottom: 0,
        height: 60,
        elevation: route.name === 'fretes' || route.name === 'home' ? 0 : 8,
      }}
    >
      {props.back ? (
        <>
          <Appbar.BackAction
            color={colors.textLight}
            onPress={() => navigation.goBack()}
          />
          <Appbar.Content
            title={props.title}
            subtitle={route.params?.subtitle || null}
            subtitleStyle={{ color: colors.textLight }}
            titleStyle={{
              fontSize: 15,
              fontFamily: 'RobotoSlab_600SemiBold',
              color: colors.textLight,
            }}
          />
        </>
      ) : (
        <>
          <Appbar.Action
            icon="text"
            color={colors.textLight}
            onPress={() => navigation.toggleDrawer()}
          />
          <Appbar.Content
            title={props.scene?.descriptor?.options?.title}
            //title={route.name === "home" ? null : props.scene?.descriptor?.options?.title}
            //subtitle={role === 'ROLE_CLIENTE' ? 'Para Cliente' : 'Para Motorista'}
            titleStyle={{
              fontFamily: 'RobotoSlab_600SemiBold',
              color: colors.textLight,
              fontSize: route.name === 'home' ? 22 : 17,
            }}
          />
          <Appbar.Action
            icon="bell"
            children={() => <Badge>3</Badge>}
            color={colors.textLight}
            onPress={() => console.log('Pressed bell')}
          />
        </>
      )}
    </Appbar>
  );
};
