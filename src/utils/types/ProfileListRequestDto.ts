import ProfileAgencyRequestDto from './ProfileAgencyRequestDto';

type ProfileListRequestDto = {
  enterpriseId?: string | null;
  profileAgencyDtoList?: ProfileAgencyRequestDto[] | null;
};

export default ProfileListRequestDto;
