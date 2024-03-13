import AllBusinessState from '../enums/AllBusinessState';
import BusinessType from '../enums/BusinessType';
import CategoryBusiness from '../enums/CategoryBusiness';
import CategoryClient from '../enums/CategoryClient';
import BusinessBillCreditNotesResponseDto from './BusinessBillCreditNotesResponseDto';
import TechnicalSupportResponseDto from './TechnicalSupportResponseDto';

type AllBusinessAssociatedBusinessRmaResponseDto = Omit<
  AllBusinessResponseDto,
  | 'id'
  | 'associatedBusinessRMA'
  | 'businessBillNumber'
  | 'billingAddressOne'
  | 'billingAddressTwo'
  | 'billingZipCode'
  | 'reduction'
  | 'billingDepartmentCode'
  | 'billingCity'
  | 'billingName'
  | 'billingPhoneNumber'
  | 'billingEmail'
  | 'addressCompanyName'
  | 'deliveryDepartmentCode'
  | 'deliverAddressOne'
  | 'deliverAddressTwo'
  | 'deliverAddressZipCode'
  | 'deliverAddressCity'
  | 'deliverAddressCompany'
  | 'deliverAddressName'
  | 'deliverPhoneNumber'
  | 'deliverEmail'
  | 'enterpriseId'
  | 'enterpriseName'
  | 'enterpriseCategory'
  | 'numOrder'
  | 'representativeId'
  | 'representativeName'
  | 'profileId'
  | 'profileName'
  | 'profileEmail'
  | 'profilePhone'
  | 'state'
  | 'representativeZipCode'
  | 'zipCode'
  | 'deliveryMode'
  | 'type'
  | 'installerProfileId'
  | 'installerProfileName'
  | 'installerProfileEmail'
  | 'exportTva'
  | 'billAndLock'
  | 'billingDisabled'
  | 'totalHt'
  | 'total'
  | 'archived'
  | 'billDate'
  | 'billModifyDate'
  | 'supports'
  | 'creditNotes'
  | 'createdDate'
  | 'modifiedDate'
  | 'createdBy'
  | 'modifiedBy'
>;

type AllBusinessResponseDto = {
  id: string;
  businessId: string;
  associatedBusinessRMA: AllBusinessAssociatedBusinessRmaResponseDto[] | null;
  title: string | null;
  number: string;
  businessBillNumber: string | null;
  billingAddressOne: string | null;
  billingAddressTwo: string | null;
  billingZipCode: string | null;
  reduction: number | null;
  billingDepartmentCode: string | null;
  billingCity: string | null;
  billingCompany: string | null;
  billingName: string | null;
  billingPhoneNumber: string | null;
  billingEmail: string | null;
  addressCompanyName: string | null;
  deliveryDepartmentCode: string | null;
  deliverAddressOne: string | null;
  deliverAddressTwo: string | null;
  deliverAddressZipCode: string | null;
  deliverAddressCity: string | null;
  deliverAddressCompany: string | null;
  deliverAddressName: string | null;
  deliverPhoneNumber: string | null;
  deliverEmail: string | null;
  enterpriseId: string;
  enterpriseName: string;
  enterpriseCategory: CategoryClient | null;
  category: CategoryBusiness;
  numOrder: string | null;
  representativeId: string | null;
  representativeName: string | null;
  profileId: string | null;
  profileName: string | null;
  profileEmail: string | null;
  profilePhone: string | null;
  state: AllBusinessState | null;
  representativeZipCode: string | null;
  zipCode: string | null;
  deliveryMode: string | null;
  type: BusinessType;
  installerProfileId: string | null;
  installerProfileName: string | null;
  installerProfileEmail: string | null;
  exportTva: boolean | null;
  billAndLock: boolean | null;
  billingDisabled: boolean | null;
  totalHt: number | null;
  total: number | null;
  archived: boolean | null;
  billDate: string | null;
  billModifyDate: string | null;
  supports: TechnicalSupportResponseDto[] | null;
  creditNotes: BusinessBillCreditNotesResponseDto[] | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AllBusinessResponseDto;
