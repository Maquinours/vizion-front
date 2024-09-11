import ProfileResponseDto from './ProfileResponseDto';

export type UserRole =
  | 'ROLE_MEMBRE_VIZEO'
  | 'ROLE_DIRECTION_VIZEO'
  | 'ROLE_STAGIAIRE_VIZEO'
  | 'ROLE_REPRESENTANT'
  | 'ROLE_DISTRIBUTEUR'
  | 'ROLE_CLIENT'
  | 'ROLE_ADMIN_VIZION';

type UserInfoResponseDto = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  id: string;
  roles: Array<UserRole>;
};

type ProfileInfoResponseDto = {
  profile: ProfileResponseDto;
  userInfo: UserInfoResponseDto;
};

export default ProfileInfoResponseDto;
