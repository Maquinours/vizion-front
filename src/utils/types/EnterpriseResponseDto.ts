import CategoryClient from '../enums/CategoryClient';
import DepartmentResponseDto from './DepartmentResponseDto';
import EnterpriseAccountabilityResponseDto from './EnterpriseAccountabilityResponseDto';
import EnterpriseInfoSupResponseDto from './EnterpriseInfoSupResponseDto';
import ProfileResponseDto from './ProfileResponseDto';

type EnterpriseResponseDto = {
  id: string;
  name: string;
  sign: string | null;
  category: CategoryClient;
  provider: boolean;
  addressLineOne: string;
  addressLineTwo: string | null;
  zipCode: string;
  city: string | null;
  department: string | null;
  departmentCode: string | null;
  country: string | null;
  email: string | null;
  phoneNumber: string | null;
  infoSup: EnterpriseInfoSupResponseDto | null;
  accountability: EnterpriseAccountabilityResponseDto | null;
  profiles: ProfileResponseDto[];
  departments: DepartmentResponseDto[] | null;
  representativeInfoSupList: EnterpriseInfoSupResponseDto[] | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default EnterpriseResponseDto;
