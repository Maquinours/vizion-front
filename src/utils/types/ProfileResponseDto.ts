import CategoryClient from '../enums/CategoryClient';
import ProfileClient from '../enums/ProfileClient';
import ProfileType from '../enums/ProfileType';
import EnterpriseResponseDto from './EnterpriseResponseDto';

type ProfileEnterpriseResponseDto = Omit<
    EnterpriseResponseDto,
    'infoSup' | 'accountability' | 'profiles' | 'departments' | 'headquarters' | 'createdDate' | 'modifiedDate' | 'createdBy' | 'modifiedBy'
>;

type ProfileResponseDto = {
    id: string;
    lastName: string | null;
    firstName: string | null;
    civility: string | null;
    email: string | null;
    userId: string | null;
    password: string | null;
    phoneNumber: string | null;
    standardPhoneNumber: string | null;
    landlinePhoneNumber: string | null;
    job: string | null;
    categoryClient: CategoryClient | null;
    profileType: ProfileType | null;
    profileClient: ProfileClient | null;
    siteIdentifier: string | null;
    enterprise: ProfileEnterpriseResponseDto | null;
    expert: boolean | null;
    createdDate: Date;
    modifiedDate: Date | null;
    createdBy: string | null;
    modifiedBy: string | null;
};

export default ProfileResponseDto;
