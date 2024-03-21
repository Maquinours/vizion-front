import CategoryClient from '../enums/CategoryClient';

type AssistanceRequestDto = {
  number?: string | null;
  enterpriseCategory?: CategoryClient | null;
  enterpriseId?: string | null;
  enterpriseName?: string | null;
  addressCompanyName?: string | null;
  addressName?: string | null;
  addressOne?: string | null;
  addressTwo?: string | null;
  addressZipCode?: string | null;
  addressCity?: string | null;
  addressPhone?: string | null;
  addressEmail?: string | null;
  deliveryDepartmentCode?: string | null;
  installerProfileId?: string | null;
  installerProfileName?: string | null;
  installerProfileEmail?: string | null;
};

export default AssistanceRequestDto;
