import SalesType from '../enums/SalesType';

type SalesVvaResponseDto = {
    id: string;
    address: string | null;
    zipCode: string;
    departmentCode: string;
    amountHt: number;
    representativeId: string | null;
    representativeName: string | null;
    enterpriseName: string | null;
    shippingServicePrice: number | null;
    year: number;
    month: number;
    type: SalesType;
    billNumber: string | null;
    businessNumber: string | null;
    startDate: string;
    endDate: string;
    createdDate: string | null;
    modifiedDate: string | null;
    createdBy: string | null;
    modifiedBy: string | null;
};

export default SalesVvaResponseDto;
