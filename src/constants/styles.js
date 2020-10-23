import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from './colors';
import { Platform } from 'react-native';

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${colors.bgColor};
`;

export const Container = styled.View`
  flex: 1;
  padding: ${props => props.padding || '20px'};
  justify-content: ${props => props.justifyContent || 'center'};
`;

export const Text = styled.Text`
  margin-top: ${props => props.marginVertical || '0'};
  margin-bottom: ${props => props.marginVertical || '0'};
  color: ${props => props.color || colors.textDark};
  font-size: ${props => props.fontSize || '14px'};
  text-align: ${props => props.textAlign || 'left'};
  font-family: ${props =>
    props.title
      ? 'RobotoSlab_600SemiBold'
      : props.bold
      ? 'RobotoSlab_500Medium'
      : 'RobotoSlab_400Regular'};
`;

export const Divider = styled.View`
  flex: 1;
  height: 1px;
  margin: 7px 5px;
  background-color: #eee;
`;

export const RowView = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: ${props => props.marginVertical || '10px'};
  margin-bottom: ${props => props.marginVertical || '10px'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  align-items: center;
`;

export const ModalView = styled.View`
  width: 70%;
  height: 70%;
  border-radius: 10px;
  align-self: center;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
