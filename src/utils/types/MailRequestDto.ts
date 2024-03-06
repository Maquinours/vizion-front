type MailRequestDto = {
  subject: string;
  cc: string[];
  bcc: string[];
  sender: string;
  to: string[];
  ownerId: string;
  content: string;
  isVizeo?: boolean | null;
  files: File[];
  businessNumber?: string | null;
  enterpriseName?: string | null;
  rmaNumber?: string | null;
  author?: string | null;
  businessName?: string | null;
  productReference?: string | null;
  businessId?: string | null;
  enterpriseId?: string | null;
  technicalAssistanceId?: string | null;
  rmaId?: string | null;
  productId?: string | null;
};

export default MailRequestDto;
