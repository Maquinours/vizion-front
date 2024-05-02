import EnterpriseResponseDto from './EnterpriseResponseDto';

type DepartmentEnterpriseResponseDto = Omit<EnterpriseResponseDto, 'departments' | 'profiles' | 'headquarters' | 'accountability' | 'infoSup'>;

type DepartmentResponseDto = {
  id: string;
  name: string;
  code: string;
  repEnterprise: DepartmentEnterpriseResponseDto | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default DepartmentResponseDto;
