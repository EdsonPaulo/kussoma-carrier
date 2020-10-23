import { StyleSheet } from 'react-native';
import { colors, metrics } from '../../constants';

const styles = StyleSheet.create({
  topContainer: {
    height: 100,
    elevation: 3,
    backgroundColor: colors.primary,
  },
  topInfoContainer: {
    paddingLeft: 45,
    //backgroundColor: "red",
    justifyContent: 'flex-start',
  },
  optionsContainer: {},
  option: {
    width: 150,
    padding: 15,
    height: 100,
    elevation: 5,
    borderRadius: 8,
    margin: 7,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  oprionTopContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  optionIcon: {
    color: colors.dark,
    //marginBottom: 10
  },
  optionText: {
    color: colors.dark,
  },
  optionBadge: {
    color: colors.dark,

    top: 10,
    right: 10,
    fontSize: 17,
    position: 'absolute',
  },
  solicitacao: {
    padding: 15,
    elevation: 2,
    height: 'auto',
    borderRadius: 5,
    marginVertical: 5,
    backgroundColor: 'white',
  },
  seeMore: {
    padding: 5,
    elevation: 2,
    marginTop: 20,
    borderRadius: 8,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
});

export default styles;
