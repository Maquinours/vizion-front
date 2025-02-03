import EnterpriseAccountabilityRequestDto from './EnterpriseAccountabilityRequestDto';
import EnterpriseInfoSupRequestDto from './EnterpriseInfoSupRequestDto';
import ProfileListRequestDto from './ProfileListRequestDto';

type EnterpriseRequestDto = {
  name: string;
  sign?: string | null;
  category?: string | null;
  addressLineOne?: string | null;
  addressLineTwo?: string | null;
  zipCode?: string | null;
  city?: string | null;
  department?: string | null;
  departmentCode?: string | null;
  country?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  infoSup?: EnterpriseInfoSupRequestDto | null;
  accountability?: EnterpriseAccountabilityRequestDto | null;
  headId?: string | null;
  profileListDto?: ProfileListRequestDto | null;
};

export default EnterpriseRequestDto;
