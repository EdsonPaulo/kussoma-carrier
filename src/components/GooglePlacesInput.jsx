import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { constants } from '../constants';

const GooglePlacesInput = ({ handleAddress, placeholder }) => {
  return (
    <GooglePlacesAutocomplete
      styles={{ backgroundColor: 'red', flex: 1 }}
      enablePoweredByContainer
      currentLocation
      placeholder={placeholder || 'Pesquisar endereço'}
      currentLocationLabel="Endereço Actual"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        handleAddress(data, details);
        console.log(data, details);
      }}
      debounce={200}
      query={{
        key: constants.GOOGLE_API_KEY,
        language: 'pt',
        components: 'country:ao',
      }}
    />
  );
};

export default GooglePlacesInput;
