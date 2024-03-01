import { authInstance } from '../../../../../../utils/functions/axios';
import { getToken } from '../../../../../../utils/functions/token';

export const logoutUser = async () => {
  const token = getToken();
  return await authInstance({
    url: 'logout',
    method: 'POST',
    data: {
      refresh_token: token.refresh_token,
    },
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });
};
