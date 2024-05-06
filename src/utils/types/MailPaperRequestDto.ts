import CategoryClient from '../enums/CategoryClient';

type MailPaperRequestDto = {
    subject?: string | null;
    content: Record<string, unknown>;
    enterpriseName: string;
    enterpriseCategory: CategoryClient;
    addressLineOne?: string | null;
    addressLineTwo?: string | null;
    zipCode?: string | null;
    city?: string | null;
    department?: string | null;
    profileName: string;
    profileEmail?: string | null;
    email?: string | null;
    profilePhone?: string | null;
    sendingDate?: Date | null;
    profileSenderName?: string | null;
    profileSenderEmail?: string | null;
};

export default MailPaperRequestDto;
