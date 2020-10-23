import api from './api';

const Auth_Login = async (telefone, senha) => {
  try {
    const response = await api.get('/login');
    console.log(response.data);
    return response;
  } catch (e) {
    console.log('ERRO: ', e);
  }
};
export { Auth_Login };
