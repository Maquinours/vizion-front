import EnterpriseRelationShipsResponseDto from './EnterpriseRelationShipsResponseDto';
import RepresentativeResponseDto from './RepresentativeResponseDto';

type EnterpriseInfoSupResponseDto = {
  id: string;
  representative: RepresentativeResponseDto;
  enterpriseRelationShips: EnterpriseRelationShipsResponseDto[];
  webSite: string;
  createdDate: Date;
  modifiedDate?: Date;
  createdBy?: string;
  modifiedBy?: string;
};

export default EnterpriseInfoSupResponseDto;
