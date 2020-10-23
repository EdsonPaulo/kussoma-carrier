import { StyleSheet } from 'react-native';

import { fonts, colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  topContainer: {
    height: 'auto',
    backgroundColor: colors.dark,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    marginLeft: 15,
    fontFamily: 'RobotoSlab_400Regular',
    color: 'white',
  },
  labelStyle: {
    color: colors.grayDark,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 2,
    marginLeft: 10,
    fontFamily: 'RobotoSlab_400Regular',
  },
});

export default styles;
