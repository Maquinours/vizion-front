import { publicInstance } from '../../../../utils/functions/axios';

export const initializeResetPassword = async (email: string) => {
  return (
    await publicInstance<string>({
      method: 'POST',
      url: 'profile/v1/reset-password',
      data: {
        email,
        url: `${window.location.hostname}/auth/reset-password/`,
      },
    })
  ).data;
};
