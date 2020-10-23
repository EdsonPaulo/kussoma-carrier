import { StyleSheet } from 'react-native';

import { fonts, colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
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
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  comboBox: {
    borderWidth: 1,
    borderColor: colors.grayMedium,
    borderRadius: 5,
    flexDirection: 'row',
    paddingRight: 5,
    marginRight: 5,
    marginBottom: 10,
    height: 50,
    flex: 1,
    // minWidth: 220,
  },
});

export default styles;
