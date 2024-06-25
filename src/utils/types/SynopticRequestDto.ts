import BusinessQuotationDetailsRequestDto from './BusinessQuotationDetailsRequestDto';
import BusinessQuotationRequestDto from './BusinessQuotationRequestDto';
import BusinessRequestDto from './BusinessRequestDto';
import BusinessSubQuotationRequestDto from './BusinessSubQuotationRequestDto';

export type SynopticRequestBusinessQuotationRequestSubQuotationRequestQuotationDetailsRequestDto = Omit<
  BusinessQuotationDetailsRequestDto,
  'quoteId' | 'subQuoteId' | 'numDetails'
> & {
  quoteId?: string | null;
  subQuoteId?: string | null;
  numDetails?: string | null;
};

export type SynopticRequestBusinessQuotationRequestSubQuotationRequestDto = Omit<BusinessSubQuotationRequestDto, 'quotationDetails'> & {
  quotationDetails: Array<SynopticRequestBusinessQuotationRequestSubQuotationRequestQuotationDetailsRequestDto>;
};

export type SynopticRequestBusinessQuotationRequestDto = Omit<BusinessQuotationRequestDto, 'subQuotationList'> & {
  subQuotationList: Array<SynopticRequestBusinessQuotationRequestSubQuotationRequestDto>;
};

export type SynopticRequestDto = {
  name: string;
  businessPticId?: string | null;
  businessQuotationNumber?: string | null;
  businessNumber?: string | null;
  vizeo?: boolean | null;
  vizeoptik?: boolean | null;
  synopticList?: Record<string, unknown> | null;
  enterpriseId?: string | null;
  enterpriseName?: string | null;
  profileId?: string | null;
  profileName?: string | null;
  profileEmail?: string | null;
  updateSynoptic: boolean;
  quotationDto?: SynopticRequestBusinessQuotationRequestDto | null;
  businessDto?: BusinessRequestDto | null;
};

export default SynopticRequestDto;
