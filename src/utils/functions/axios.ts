import axios from 'axios';
import { AUTH_BASE_URL, AUTH_CLIENT, AUTH_SECRET, PRIVATE_BASE_URL, PUBLIC_BASE_URL } from '../constants/api';
import * as qs from 'qs';
import { getToken, removeToken, setToken } from './token';
import { format } from 'date-fns';
import AuthenticationToken from '../types/AuthenticationToken';
import { redirect } from '@tanstack/react-router';

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
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      authInstance<AuthenticationToken>({
        method: 'POST',
        url: 'token',
        data: {
          grant_type: 'refresh_token',
          refresh_token: getToken().refresh_token,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setToken(res.data);
            return privateInstance(originalRequest);
          }
        })
        .catch(() => {
          removeToken();
          redirect({ to: '/auth/login' });
        });
    }
  },
);
