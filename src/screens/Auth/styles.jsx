import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '../../constants/colors';

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff;
`;
const Container = styled.View`
  flex: 1;
  padding: 0 25px;
  justify-content: ${props => props.justifyContent || 'space-around'};
`;

const Button = styled(RectButton)`
  flex: 1;
  height: 50px;
  justify-content: center;
  border-radius: 5px;
  align-items: center;
  background-color: ${props =>
    props.primary ? colors.primary : colors.grayLight};
  elevation: 3;
`;

const Text = styled.Text`
  margin: 5px;
  margin-top: ${props => props.marginTop || props.marginVertical || '2px'};
  margin-bottom: ${props =>
    props.marginBottom || props.marginVertical || '2px'};
  color: ${props => props.color || colors.textLight};
  font-size: ${props => props.fontSize || '15px'};
  text-align: ${props => props.textAlign || 'left'};
  font-family: ${props =>
    props.bold ? 'RobotoSlab_600SemiBold' : 'RobotoSlab_400Regular'};
`;
const Divider = styled.View`
  width: 100%;
  margin: 30px 0;
  height: 1px;
  background-color: ${colors.grayMedium};
`;
const RowView = styled.View`
  flex-direction: row;
  margin: 10px 0;
  justify-content: center;
  align-items: center;
`;
const ColView = styled(RowView)`
  flex-direction: column;
`;
const ModalView = styled.View`
  width: 80%;
  height: 50%;
  border-radius: 5px;
  align-self: center;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
export {
  Container,
  SafeArea,
  Text,
  Button,
  ColView,
  Divider,
  RowView,
  ModalView,
};
