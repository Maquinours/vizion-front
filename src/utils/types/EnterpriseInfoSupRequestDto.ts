import EnterpriseRelationShipsRequestDto from './EnterpriseRelationShipsRequestDto';

type EnterpriseInfoSupRequestDto = {
  representativeId?: string | null;
  enterpriseRelationShips?: EnterpriseRelationShipsRequestDto[] | null;
  webSite?: string | null;
};

export default EnterpriseInfoSupRequestDto;
