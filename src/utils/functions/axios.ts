import { redirect } from '@tanstack/react-router';
import axios from 'axios';
import { format } from 'date-fns';
import * as qs from 'qs';
import { toast } from 'react-toastify';
import { AUTH_BASE_URL, AUTH_CLIENT, AUTH_SECRET, PRIVATE_BASE_URL, PUBLIC_BASE_URL } from '../constants/api';
import { getToken, removeToken } from './token';

export const authInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded',
  },
  auth: {
    username: AUTH_CLIENT,
    password: AUTH_SECRET,
  },
});

export const publicInstance = axios.create({
  baseURL: PUBLIC_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

export const privateInstance = axios.create({
  baseURL: PRIVATE_BASE_URL,
  headers: {
    'Content-type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat', serializeDate: (date: Date) => format(date, 'yyyy-MM-dd HH:mm:ss') }),
});

privateInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `${token.token_type} ${token.access_token}`;
  return config;
});

privateInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      toast.error('Votre session a expiré, veuillez vous reconnecter.');
      removeToken();
      throw redirect({ to: '/auth/login' });
    } else throw error;
  },
);
