import EnterpriseResponseDto from './EnterpriseResponseDto';

type DepartmentEnterpriseResponseDto = Omit<EnterpriseResponseDto, 'departments' | 'profiles' | 'headquarters' | 'accountability' | 'infoSup'>;

type DepartmentResponseDto = {
  id: string;
  name: string;
  code: string;
  repEnterprise?: DepartmentEnterpriseResponseDto;
  createdDate: Date;
  modifiedDate?: Date;
  createdBy?: string;
  modifiedBy?: string;
};

export default DepartmentResponseDto;
