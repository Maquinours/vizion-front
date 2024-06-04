type AssistanceReceptionDetailRequestDto = {
  productRef?: string | null;
  productSerialNumber?: string | null;
  businessNum?: string | null;
  issue?: string | null;
  warranty?: boolean | null;
  externalComment?: string | null;
  internalComment?: string | null;
  receptionId?: string | null;
  acceptEntry?: boolean | null;
};

export default AssistanceReceptionDetailRequestDto;
