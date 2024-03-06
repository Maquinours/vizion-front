import { privateInstance } from '../../../../utils/functions/axios';
import MailRequestDto from '../../../../utils/types/MailRequestDto';

export const sendEmail = async (mail: MailRequestDto) => {
  const formData = new FormData();
  formData.set('content', mail.content);
  formData.set('subject', mail.subject);
  formData.set('ownerId', mail.ownerId);

  if (mail.author) formData.set('author', mail.author);
  if (mail.businessId) formData.set('businessId', mail.businessId);
  if (mail.businessName) formData.set('businessName', mail.businessName);
  if (mail.businessNumber) formData.set('businessNumber', mail.businessNumber);
  if (mail.productId) formData.set('productId', mail.productId);
  if (mail.productReference) formData.set('productName', mail.productReference);
  if (mail.enterpriseId) formData.set('enterpriseId', mail.enterpriseId);
  if (mail.enterpriseName) formData.set('enterpriseName', mail.enterpriseName);
  if (mail.rmaId) formData.set('rmaId', mail.rmaId);
  if (mail.rmaNumber) formData.set('rmaNumber', mail.rmaNumber);
  if (mail.technicalAssistanceId) formData.set('technicalAssistanceId', mail.technicalAssistanceId);
  for (const cc of mail.cc) formData.append('cc', cc);
  for (const bcc of mail.bcc) formData.append('bcc', bcc);
  for (const to of mail.to) formData.append('to', to);
  for (const file of mail.files) formData.append('files', file);
  formData.append('typeText', 'text/html;charset=iso-8859-1');

  return privateInstance({
    method: 'POST',
    url: `/mail/v1/send-mail`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};
