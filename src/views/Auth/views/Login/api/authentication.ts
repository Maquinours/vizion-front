import AuthenticationToken from '../../../../../utils/types/AuthenticationToken';
import { authInstance } from '../../../../../utils/functions/axios';

export const login = async (username: string, password: string) => {
  return (
    await authInstance<AuthenticationToken>({
      method: 'POST',
      url: 'token',
      data: {
        username,
        password,
        grant_type: 'password',
      },
    })
  ).data;
};
