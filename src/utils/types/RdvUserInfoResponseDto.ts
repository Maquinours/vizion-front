import RdvResponseDto from './RdvResponseDto';

type RdvUserInfoResponseDto = {
  id: string;
  attributeToId: string | null;
  attributeToLastName: string | null;
  attributeToFirstName: string | null;
  rdv: Omit<RdvResponseDto, 'infos'> | null;
  createdDate: string;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default RdvUserInfoResponseDto;
