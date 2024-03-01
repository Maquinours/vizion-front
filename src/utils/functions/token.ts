import secureLocalStorage from 'react-secure-storage';
import AuthenticationToken from '../types/AuthenticationToken';

export const setToken = (token: AuthenticationToken) => {
  secureLocalStorage.setItem('token', token);
};

export const getToken = (): AuthenticationToken => {
  return secureLocalStorage.getItem('token') as AuthenticationToken;
};

export const removeToken = () => {
  secureLocalStorage.removeItem('token');
};
