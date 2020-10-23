import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import { mapstyle } from '../../constants';
import { SafeArea } from '../../constants/styles';
import authContext from '../../contexts/auth/auth-context';

export default index = () => {
  const navigation = useNavigation();
  const { role, logout, token } = useContext(authContext);
  const [region, setRegion] = useState({});

  const onRegionChange = region => {
    setRegion({ region });
  };

  useEffect(() => {
    setRegion({
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });
  }, []);

  return (
    <SafeArea>
      <MapView style={styles.mapStyle} customMapStyle={mapstyle} />
      <RectButton style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={35} />
      </RectButton>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    width: 'auto',
    padding: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    borderRadius: 8,
    position: 'absolute',
    top: 15,
    left: 15,
  },
});
