import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { colors } from '../constants';

export default CustomInput = props => {
  const { type, ...rest } = props;
  const [secureText, setSecureText] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (props.type === 'password') setSecureText(true);
  }, []);

  let inputType = null,
    iconName = null;
  switch (type) {
    case 'password':
      {
        (inputType = 'default'), (iconName = 'lock');
      }
      break;
    case 'name':
      {
        (inputType = 'default'), (iconName = 'user');
      }
      break;
    case 'email':
      {
        (inputType = 'email-address'), (iconName = 'mail');
      }
      break;
    case 'phone':
      {
        (inputType = 'phone-pad'), (iconName = 'smartphone');
      }
      break;
    case 'code':
      {
        (inputType = 'numeric'), (iconName = 'hash');
      }
      break;
    case 'number':
      {
        (inputType = 'numeric'), (iconName = 'smartphone');
      }
      break;
    case 'search':
      {
        (inputType = 'web-search'), (iconName = 'search');
      }
      break;
    default:
      inputType = iconName = 'default';
  }

  const help =
    props.help && props.error ? (
      <Text color={props.light ? colors.grayLight : colors.grayDark}>
        {props.help || null}
      </Text>
    ) : null;
  const error = props.error ? (
    <Text color="red" textAlign="right">
      {props.error || 'erro'}
    </Text>
  ) : null;
  const label =
    !props.inline && props.label ? (
      <Text color={props.light ? colors.textLight : colors.textDark}>
        {props.label}
      </Text>
    ) : props.inline &&
      focused &&
      props.value?.length > 0 &&
      props.floatLabel ? (
      <Text color={props.light ? colors.textLight : colors.textDark}>
        {props.placeholder}
      </Text>
    ) : null;

  return (
    <Container style={props.style}>
      {label}
      <InputContainer
        style={{ height: props.height || 50 }}
        inline={props.inline}
        light={props.light}
        borderColor={
          props.error
            ? 'red'
            : props.light
            ? 'transparent'
            : focused
            ? colors.grayDark
            : colors.grayMedium
        }
      >
        {!props.showIcon ? null : iconName === 'search' ? (
          <MaterialIcons size={23} name={iconName} />
        ) : (
          <Feather
            size={23}
            name={iconName}
            color={props.light ? colors.grayLight : colors.grayDark}
          />
        )}
        <TextInput
          {...rest}
          color={props.light ? colors.textLight : colors.textDark}
          placeholderTextColor={
            props.light ? colors.grayDark : colors.grayMedium
          }
          keyboardType={inputType}
          secureTextEntry={secureText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          AuthibilityLabel={label}
        />
        {type === 'password' ? (
          <TouchableOpacity
            style={{
              width: 25,
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setSecureText(!secureText)}
          >
            {secureText ? (
              <Feather
                color={props.light ? '#eee' : '#111'}
                size={18}
                name="eye"
              />
            ) : (
              <Feather
                color={props.light ? '#eee' : '#111'}
                size={18}
                name="eye-off"
              />
            )}
          </TouchableOpacity>
        ) : null}
      </InputContainer>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          padding: 2,
        }}
      >
        {help}
        {error}
      </View>
    </Container>
  );
};

const Container = styled.View`
  width: 100%;
  background-color: transparent;
  height: auto;
  justify-content: center;
  margin: 5px 0;
`;
const InputContainer = styled.View`
  height: 50px;
  margin-top: 3px;
  border-radius: ${props => (props.inline ? '2px' : '5px')};
  background-color: ${props => (!props.light ? 'white' : '#ffffff11')};
  align-items: center;
  flex-direction: row;
  border-width: ${props => (props.inline ? 0 : '1px')};
  padding: ${props => (props.inline ? 0 : '0 10px')};
  padding: 0 5px;
  border-bottom-width: ${props => (props.inline ? '2px' : '1px')};
  border-color: ${props => props.borderColor || colors.grayMedium};
`;
const TextInput = styled.TextInput`
  flex: 1;
  height: 100%;
  color: ${props => props.color || colors.textLight};
  font-size: 15px;
  font-family: 'RobotoSlab_400Regular';
  margin: 0 8px;
  padding: 2px 0;
`;
const Text = styled.Text`
  font-size: 12px;
  font-family: 'RobotoSlab_400Regular';
  font-size: ${props => props.fontSize || '12px'};
  text-align: ${props => props.textAlign || 'left'};
  color: ${props => props.color || colors.textLight};
`;
