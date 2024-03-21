type ProfileAgencyRequestDto = {
  lastName: string;
  firstName?: string;
  civility: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  standardPhoneNumber?: string;
  landlinePhoneNumber?: string;
  job?: string;
  profileClient: string;
  categoryClient: string;
  siteIdentifier?: string;
  expert: boolean;
};

export default ProfileAgencyRequestDto;
