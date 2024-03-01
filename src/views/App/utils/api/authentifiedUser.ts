import { privateInstance } from '../../../../utils/functions/axios';
import ProfileInfoResponseDto from '../../../../utils/types/ProfileInfoResponseDto';

export const getAuthentifiedUser = async () => {
  return (
    await privateInstance<ProfileInfoResponseDto>({
      method: 'GET',
      url: 'profile/v1/get-user-info',
    })
  ).data;
};
