type ShipmentRequestDto = {
  businessNumber?: string | null;
  companyName?: string | null;
  addressOne?: string | null;
  addressTwo?: string | null;
  zipCode?: string | null;
  city?: string | null;
  note?: string | null;
  name?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  number?: number | null;
};

export default ShipmentRequestDto;
