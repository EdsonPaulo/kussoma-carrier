import { StyleSheet } from 'react-native';

import { fonts, colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    //padding: metrics.baseMargin,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 6,
    elevation: 1,
    marginBottom: 15,
  },
  bottomBar: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 4,
    padding: 5,
  },
  estadoFrete: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    letterSpacing: 1,
    borderRadius: 5,
    fontFamily: 'RobotoSlab_600SemiBold',
    textTransform: 'uppercase',
    color: '#ffffff',
  },
});

export default styles;
