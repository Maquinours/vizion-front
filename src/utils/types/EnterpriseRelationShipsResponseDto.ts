import EnterpriseResponseDto from './EnterpriseResponseDto';

type RelationEnterpriseDto = Omit<
  EnterpriseResponseDto,
  'infoSup' | 'accountability' | 'headquarters' | 'createdDate' | 'modifiedDate' | 'createdBy' | 'modifiedBy'
>;

type EnterpriseRelationShipsResponseDto = {
  id: string;
  fullName?: string;
  relationEnterprise: RelationEnterpriseDto;
  createdDate: Date;
  modifiedDate?: Date;
  createdBy?: string;
  modifiedBy?: string;
};

export default EnterpriseRelationShipsResponseDto;
