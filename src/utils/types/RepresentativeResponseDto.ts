import EnterpriseResponseDto from './EnterpriseResponseDto';

type RepresentativeResponseDto = Omit<
  EnterpriseResponseDto,
  'infoSup' | 'accountability' | 'profiles' | 'departments' | 'headQuarters' | 'createdDate' | 'modifiedDate' | 'createdBy' | 'modifiedBy'
>;

export default RepresentativeResponseDto;
