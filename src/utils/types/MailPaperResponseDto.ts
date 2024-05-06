import CategoryClient from '../enums/CategoryClient';

type MailPaperResponseDto = {
  id: string;
  reference: string;
  subject: string | null;
  content: Record<string, unknown>;
  enterpriseName: string;
  enterpriseCategory: CategoryClient;
  addressLineOne: string;
  addressLineTwo: string | null;
  zipCode: string;
  city: string | null;
  department: string | null;
  profileName: string | null;
  profileEmail: string | null;
  email: string;
  profilePhone: string | null;
  sendingDate: Date | null;
  profileSenderName: string | null;
  profileSenderEmail: string | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default MailPaperResponseDto;
