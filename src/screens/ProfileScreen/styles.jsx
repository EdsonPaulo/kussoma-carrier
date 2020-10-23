import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  userDetails: {
    marginLeft: 15,
    fontFamily: 'RobotoSlab_400Regular',
    color: 'white',
  },
  labelStyle: {
    color: colors.grayDark,
    marginTop: 10,
    marginBottom: 2,
    marginLeft: 10,
    fontFamily: 'RobotoSlab_400Regular',
  },
  title: {
    fontSize: 20,
    fontFamily: 'RobotoSlab_600SemiBold',
  },
});

export default styles;
