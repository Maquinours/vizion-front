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

export const isAddressRequestDto = (data: unknown): data is AddressRequestDto => {
  return (
    !!data &&
    typeof data === 'object' &&
    'addressLineOne' in data &&
    typeof data.addressLineOne === 'string' &&
    data.addressLineOne.trim().length > 0 &&
    (!('addressLineTwo' in data) || data.addressLineTwo === undefined || data.addressLineTwo === null || typeof data.addressLineTwo === 'string') &&
    'city' in data &&
    typeof data.city === 'string' &&
    'fullName' in data &&
    typeof data.fullName === 'string' &&
    data.fullName.trim().length > 0 &&
    'zipCode' in data &&
    typeof data.zipCode === 'string' &&
    data.zipCode.trim().length > 0 &&
    'email' in data &&
    typeof data.email === 'string' &&
    data.email.trim().length > 0 &&
    (!('phoneNumber' in data) || data.phoneNumber === undefined || data.phoneNumber === null || typeof data.phoneNumber === 'string') &&
    (!('enterpriseId' in data) || data.enterpriseId === undefined || data.enterpriseId === null || typeof data.enterpriseId === 'string') &&
    'enterpriseName' in data &&
    typeof data.enterpriseName === 'string' &&
    data.enterpriseName.trim().length > 0
  );
};

export default AddressRequestDto;
