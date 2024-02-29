import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.PROD ? 'https://auth-vizion.vizeo.eu' : 'https://auth-vizeo-test.vizeo.eu';
const AUTH_REALM = 'vizion-realm';
const AUTH_CLIENT = 'vizion-auth-client';
const AUTH_SECRET = '6530e11e-090f-44a6-b4f0-55f71329ef44';
const AUTH_URL = `${AUTH_BASE_URL}/auth/realms/${AUTH_REALM}/protocol/openid-connect`;

export const login = async (username: string, password: string) => {
  return await axios(`${AUTH_URL}/token`, {
    method: 'POST',
    data: {
      username,
      password,
      client_id: AUTH_CLIENT,
      client_secret: AUTH_SECRET,
      grant_type: 'password',
    },
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
    },
  });
};
