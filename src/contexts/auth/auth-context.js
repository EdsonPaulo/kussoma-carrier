import React from 'react';

export default React.createContext({
  user: {},
  token: null,
  role: null,
  isLogged: false,
  isLoading: true,

  login: (user, token, role) => {},
  logout: () => {},
  register: (user, token, role) => {},
  retrieveToken: () => {},
});
