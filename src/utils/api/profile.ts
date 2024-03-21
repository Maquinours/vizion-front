import CategoryClient from '../enums/CategoryClient';
import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProfileRequestDto from '../types/ProfileRequestDto';
import ProfileResponseDto from '../types/ProfileResponseDto';
import UpdateSiteIdentifierOrPasswordRequestDto from '../types/UpdateSiteIdentifierOrPasswordRequestDto';

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

export const createProfile = async (data: ProfileRequestDto) => {
  return (
    await privateInstance<ProfileResponseDto>({
      method: 'POST',
      url: 'profile/v1/store',
      data,
    })
  ).data;
};

export const updateProfile = async (old: ProfileResponseDto, data: ProfileRequestDto) => {
  return (
    await privateInstance<ProfileResponseDto>({
      method: 'PUT',
      url: `profile/v1/update/${encodeURIComponent(old.id)}`,
      data,
    })
  ).data;
};

export const deleteProfile = async (profile: ProfileResponseDto) => {
  return (
    await privateInstance<void>({
      method: 'DELETE',
      url: `profile/v1/delete`,
      params: { id: profile.id },
    })
  ).data;
};

export const getEmailExists = async (email: string) => {
  return (
    await privateInstance<boolean>({
      method: 'GET',
      url: 'profile/v1/verify-email',
      params: {
        email,
      },
    })
  ).data;
};

export const getIdentifierExists = async (identifier: string) => {
  return (
    await privateInstance<boolean>({
      method: 'GET',
      url: 'users/v1/user/verify-username',
      params: {
        username: identifier,
      },
    })
  ).data;
};

export const getProfilesPageByEnterpriseId = async (enterpriseId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<ProfileResponseDto>>({
      method: 'GET',
      url: `profile/v1/all-by-enterprise-paged`,
      params: {
        enterpriseId,
        page,
        size,
      },
    })
  ).data;
};

export const getProfilesPageByEnterpriseIdAndSearch = async (enterpriseId: string, search: string, page: number, size: number) => {
  return (
    await privateInstance<Page<ProfileResponseDto>>({
      method: 'GET',
      url: `profile/v1/search`,
      params: {
        enterpriseId,
        contact: search,
        city: '',
        phoneNumber: '',
        page,
        size,
      },
    })
  ).data;
};

export const createProfiles = async (data: Array<ProfileRequestDto>) => {
  return (
    await privateInstance<Array<ProfileResponseDto>>({
      method: 'POST',
      url: 'profile/v1/create-all-profile',
      data,
    })
  ).data;
};

export const updateUserCredentials = async (data: UpdateSiteIdentifierOrPasswordRequestDto) => {
  return (await privateInstance<ProfileResponseDto>({ method: 'PUT', url: `profile/v1/update-identifier-or-password`, data })).data;
};
