import { StyleSheet } from 'react-native';

import { fonts, colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    padding: metrics.baseMargin,
  },
  freteCard: {
    width: '100%',
    height: 150,
    borderLeftWidth: 5,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 5,
    padding: 10,
  },
});

export default styles;
