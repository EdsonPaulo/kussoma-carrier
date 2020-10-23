import Icon from '@expo/vector-icons/Ionicons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { colors, metrics } from '../constants';

const CustomButton = props => {
  const {
    rounded,
    primary,
    dark,
    title,
    onPress,
    style,
    loading,
    icon,
  } = props;

  return (
    <RectButton
      disabled={loading || false}
      onPress={onPress}
      style={[
        styles.buttonContainer,
        style,
        {
          backgroundColor: primary
            ? colors.primary
            : dark
            ? colors.dark
            : colors.grayLight,
          borderRadius: rounded ? metrics.formInputRadius : 5,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={colors.grayLight}
          style={{ marginLeft: metrics.baseMargin }}
          size="small"
        />
      ) : icon ? (
        <View style={{ width: 50 }} />
      ) : (
        <View />
      )}
      <Text
        style={[
          styles.textStyle,
          { color: primary || dark ? '#fff' : colors.dark },
        ]}
      >
        {title}
      </Text>
      {!icon ? (
        <View />
      ) : (
        <View style={styles.iconStyle}>
          <Icon
            name={icon}
            size={30}
            color={primary || dark ? 'white' : colors.grayDark2}
          />
        </View>
      )}
    </RectButton>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    height: 45,
    marginVertical: metrics.smallMargin,
    borderColor: colors.primaryDark,
  },
  textStyle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'RobotoSlab_600SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  iconStyle: {
    width: 50,
    backgroundColor: colors.primaryDark,
    height: '100%',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomButton;
