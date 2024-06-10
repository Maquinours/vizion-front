import CategoryClient from '../enums/CategoryClient';
import ProfileClient from '../enums/ProfileClient';

type ProfileAgencyRequestDto = {
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
  categoryClient: CategoryClient;
  siteIdentifier?: string | null;
  expert: boolean;
};

export default ProfileAgencyRequestDto;
