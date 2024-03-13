import { privateInstance } from '../../../../../../../../../../utils/functions/axios';
import MailFileToDestinationRequestDto from '../types/MailFileToDestinationRequestDto';

export const copyMailAttachmentToGed = async (data: MailFileToDestinationRequestDto) => {
  return (
    await privateInstance<Array<string>>({
      method: 'POST',
      url: '/ged/v1/s3/copy-mail-file-to-destination',
      data,
    })
  ).data;
};
