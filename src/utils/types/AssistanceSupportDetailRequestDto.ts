type AssistanceSupportDetailRequestDto = {
  productRef?: string | null;
  productSerialNumber?: string | null;
  businessNum?: string | null;
  issue?: string | null;
  warranty?: boolean | null;
  comment?: string | null;
  internalComment?: string | null;
  supportId?: string | null;
  acceptEntry?: boolean | null;
};

export default AssistanceSupportDetailRequestDto;
