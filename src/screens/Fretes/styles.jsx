import { StyleSheet } from 'react-native';

import { fonts, colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    padding: metrics.baseMargin,
  },
  tabBar: {
    height: 50,
    backgroundColor: colors.primary,
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
  },
});

export default styles;
