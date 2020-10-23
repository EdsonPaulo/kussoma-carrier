import API from './api';

const getFretes = async () => {
  try {
    const response = await API.get('/frete');
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log('ERRO: ', e);
  }
};

export { getFretes };
