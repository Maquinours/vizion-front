type AddressRequestDto = {
  addressLineOne: string;
  addressLineTwo?: string | null;
  city: string;
  fullName: string;
  zipCode: string;
  email: string;
  phoneNumber?: string | null;
  enterpriseId?: string | null;
  enterpriseName: string;
};

export default AddressRequestDto;
