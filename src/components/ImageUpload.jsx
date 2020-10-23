import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@expo/vector-icons/Entypo';
import { colors } from '../constants';
import api from '../services/api';
import authContext from '../contexts/auth/auth-context';
import { ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import { RowView, Text } from '../constants/styles';

export default ImageUpload = ({ handleChoosePhoto }) => {
  const { token } = useContext(authContext);
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectTypeVisible, setSelectTypeVisible] = useState(false);

  const pickImage = async takePhoto => {
    if (uploading) return;
    let result;
    if (takePhoto)
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    else
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    if (!result.cancelled) uploadImage(result);
    setSelectTypeVisible(false);
  };

  const uploadImage = async img => {
    if (uploading) return;
    try {
      setUploading(true);
      const formData = new FormData();
      const imgSplits = img?.uri?.split('/');
      const fileName = imgSplits[imgSplits.length - 1];
      const fileExtension = img?.uri?.split('.')[1];
      // console.log(JSON.stringify(img));
      formData.append('file', {
        name: fileName,
        type: fileExtension === 'png' ? 'image/png' : 'image/jpeg',
        uri: img?.uri,
      });
      console.log(formData);
      const response = await api(token).post('/files', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log('response', response.data);
      setPhoto(img.uri);
      handleChoosePhoto(response.data);
    } catch (error) {
      Alert.alert('Ocorreu um erro ao carregar imagem. Tente novamente!');
      setPhoto(null);
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  // useEffect(() => {}, []);

  return (
    <RectButton
      onPress={() => setSelectTypeVisible(true)}
      style={{
        backgroundColor: colors.grayLight,
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderRadius: 8,
      }}
    >
      {uploading ? (
        <ActivityIndicator size="small" color={colors.primaryDark} />
      ) : photo ? (
        <Image
          resizeMode="stretch"
          source={{ uri: photo }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
        />
      ) : (
        <Icon name="plus" color={colors.primaryDark} size={50} />
      )}
      <Portal>
        <Dialog
          visible={selectTypeVisible}
          onDismiss={() => setSelectTypeVisible(false)}
        >
          <Dialog.Content>
            <RowView justifyContent="space-around">
              <RectButton style={{ padding: 20, alignItems: 'center' }}>
                <Icon
                  name="camera"
                  size={50}
                  color={colors.primaryDark}
                  onPress={() => pickImage(true)}
                />
                <Text color={colors.primaryDark}>Tirar nova foto</Text>
              </RectButton>
              <RectButton style={{ padding: 20, alignItems: 'center' }}>
                <Icon
                  name="image"
                  color={colors.primaryDark}
                  size={50}
                  onPress={() => pickImage(false)}
                />
                <Text color={colors.primaryDark}>Escolher da galeria</Text>
              </RectButton>
            </RowView>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </RectButton>
  );
};
