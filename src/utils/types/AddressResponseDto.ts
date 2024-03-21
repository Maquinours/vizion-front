type AddressResponseDto = {
  id: string;
  addressLineOne: string;
  addressLineTwo: string | null;
  fullName: string | null;
  zipCode: string;
  city: string;
  email: string | null;
  phoneNumber: string | null;
  enterpriseId: string | null;
  enterpriseName: string;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AddressResponseDto;
