import ProfileAgencyRequestDto from './ProfileAgencyRequestDto';

type ProfileListRequestDto = {
  enterpriseId: string;
  profileAgencyDtoList: ProfileAgencyRequestDto[];
};

export default ProfileListRequestDto;
