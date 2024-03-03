import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import { privateInstance } from '../../../../../../../../utils/functions/axios';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';

export const getExcelTurnoversByRepresentativeMonthAndYear = async (representative: EnterpriseResponseDto, year: number, month: number) => {
  if (representative.category !== CategoryClient.REPRESENTANT) throw new Error('Enterprise is not a representative');
  if (representative.departments === null) throw new Error('Enterprise has no departments');

  return (
    await privateInstance<Blob>({
      method: 'GET',
      url: `/business/v1/business/sales-and-vva/download-representative`,
      params: {
        repCodes: representative.departments.map((department) => department.code),
        year,
        month,
      },
      responseType: 'blob',
    })
  ).data;
};
