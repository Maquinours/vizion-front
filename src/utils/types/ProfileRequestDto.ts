import ProfileClient from '../enums/ProfileClient';

type ProfileRequestDto = {
  lastName: string;
  firstName?: string | null;
  civility: string;
  email?: string | null;
  password?: string | null;
  phoneNumber?: string | null;
  standardPhoneNumber?: string | null;
  landlinePhoneNumber?: string | null;
  job?: string | null;
  profileClient: ProfileClient;
  siteIdentifier?: string | null;
  enterpriseId: string;
  expert: boolean;
};

export default ProfileRequestDto;
