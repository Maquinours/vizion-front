import ProfileResponseDto from './ProfileResponseDto';

type UserInfoResponseDto = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  id: string;
  roles: string[];
};

type ProfileInfoResponseDto = {
  profile: ProfileResponseDto;
  userInfo: UserInfoResponseDto;
};

export default ProfileInfoResponseDto;
