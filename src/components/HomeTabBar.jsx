import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { colors, fonts } from '../constants';

const HomeTabBar = ({ state, descriptors, navigation }) => (
  <View style={{ backgroundColor: colors.bgColor, height: 60 }}>
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        elevation: 5,
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderTopColor: colors.borderColor,
        borderTopWidth: 2,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.tabBarLabel;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () =>
          navigation.emit({ type: 'tabLongPress', target: route.key });

        let iconName;
        if (route.name === 'home') iconName = 'home';
        else if (route.name === 'fretes') iconName = 'truck-fast';
        else if (route.name === 'solicitacoes') iconName = 'bullhorn';
        else if (route.name === 'profile') iconName = 'user';

        return (
          <RectButton
            key={route.key}
            style={{ flex: 1 }}
            activeOpacity={0.7}
            rippleColor={colors.primaryDark}
            accessibilityStates={isFocused ? ['selected'] : []}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFocused ? colors.primaryDark : 'transparent',
              }}
            >
              <MaterialCommunityIcons
                name={iconName}
                style={{ color: '#fff', marginBottom: 2 }}
                size={23}
              />
              <Text style={{ fontSize: fonts.small, color: '#fff' }}>
                {label}
              </Text>
            </View>
          </RectButton>
        );
      })}
    </View>
  </View>
);
export default HomeTabBar;
