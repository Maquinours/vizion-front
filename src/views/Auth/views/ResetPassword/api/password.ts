import { publicInstance } from '../../../../../utils/functions/axios';
import ProfileResponseDto from '../../../../../utils/types/ProfileResponseDto';

export const resetPassword = async (token: string, password: string) => {
  return (
    await publicInstance<ProfileResponseDto>({
      method: 'POST',
      url: 'profile/v1/reset-password',
      data: {
        token,
        password,
        url: `${window.location.hostname}/auth/reset-password/`,
      },
    })
  ).data;
};
