import AssistanceState from '../enums/AssistanceState';
import CategoryClient from '../enums/CategoryClient';
import AssistanceDeliveryResponseDto from './AssistanceDeliveryResponseDto';
import AssistanceReceptionResponseDto from './AssistanceReceptionResponseDto';
import AssistanceSupportResponseDto from './AssistanceSupportResponseDto';

type AssistanceResponseDto = {
  id: string;
  enterpriseId: string | null;
  enterpriseName: string | null;
  number: string;
  state: AssistanceState;
  deliveryDepartmentCode: string | null;
  addressCompanyName: string | null;
  addressName: string | null;
  addressOne: string | null;
  addressTwo: string | null;
  addressZipCode: string | null;
  addressCity: string | null;
  addressPhone: string | null;
  addressEmail: string | null;
  enterpriseCategory: CategoryClient | null;
  installerProfileId: string | null;
  installerProfileName: string | null;
  installerProfileEmail: string | null;
  assistanceSupport: AssistanceSupportResponseDto | null;
  assistanceReception: AssistanceReceptionResponseDto | null;
  assistanceDelivery: AssistanceDeliveryResponseDto | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceResponseDto;
