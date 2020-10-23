import { StyleSheet } from 'react-native';

import { fonts, colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  mapView: {
    elevation: 3,
    height: '100%',
    width: '100%',
  },
  bottomBar: {
    height: 'auto',
    //  position: "absolute",
    bottom: 0,
    elevation: 10,
    borderTopWidth: 1,
    borderColor: colors.grayLight,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    elevation: 1,
    marginTop: 20,
    //borderRadius: 6,
    //marginHorizontal: 15,
  },
});

export default styles;
