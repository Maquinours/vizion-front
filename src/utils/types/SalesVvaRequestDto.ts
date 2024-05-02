import SalesType from '../enums/SalesType';

type SalesVvaRequestDto = {
  address: string;
  zipCode: string;
  shippingServicePrice?: number | null;
  departmentCode: string;
  representativeId?: string | null;
  representativeName?: string | null;
  enterpriseName?: string | null;
  amountHT: number;
  year: number;
  month: number;
  type?: SalesType | null;
  billNumber?: string | null;
  businessNumber?: string | null;
  startDate: string;
  endDate: string;
};

export default SalesVvaRequestDto;
