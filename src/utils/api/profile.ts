import CategoryClient from '../enums/CategoryClient';
import { privateInstance } from '../functions/axios';
import ProfileResponseDto from '../types/ProfileResponseDto';

export const getProfilesByEnterpriseId = async (enterpriseId: string) => {
  return (
    await privateInstance<Array<ProfileResponseDto>>({
      method: 'GET',
      url: `profile/v1/all-by-enterprise`,
      params: {
        enterpriseId,
      },
    })
  ).data;
};

export const getProfileById = async (profileId: string) => {
  return (
    await privateInstance<ProfileResponseDto>({
      method: 'GET',
      url: `profile/v1/find-by-id/${encodeURIComponent(profileId)}`,
    })
  ).data;
};

export const getProfilesByCategory = async (category: CategoryClient) => {
  return (
    await privateInstance<Array<ProfileResponseDto>>({
      method: 'GET',
      url: `profile/v1/find/category`,
      params: {
        category,
      },
    })
  ).data;
};
