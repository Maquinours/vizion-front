import RdvUserInfoRequestDto from './RdvUserInfoRequestDto';

type RdvRequestDto = {
  title: string;
  description?: string | null;
  place: string;
  fullTime: boolean;
  startDateTime: Date;
  endDatetime: Date;
  userInfoDtos: RdvUserInfoRequestDto[];
};

export default RdvRequestDto;
