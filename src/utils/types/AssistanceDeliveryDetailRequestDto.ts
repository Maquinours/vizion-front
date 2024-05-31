type AssistanceDeliveryDetailRequestDto = {
  productRef?: string | null;
  productSerialNumber?: string | null;
  businessNum?: string | null;
  issue?: string | null;
  warranty?: boolean | null;
  comment?: string | null;
  found?: boolean | null;
  solution?: string | null;
  internalComment?: string | null;
  deliveryId?: string | null;
  acceptEntry?: boolean | null;
};

export default AssistanceDeliveryDetailRequestDto;
