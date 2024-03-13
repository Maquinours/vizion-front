import { privateInstance } from '../functions/axios';
import RdvUserInfoResponseDto from '../types/RdvUserInfoResponseDto';

export const getAllRdvUserInfos = async () => {
  return (
    await privateInstance<Array<RdvUserInfoResponseDto>>({
      method: 'GET',
      url: `rdv/v1/infos/list`,
    })
  ).data;
};

export const getRdvUserInfosByRdvId = async (rdvId: string) => {
  return (
    await privateInstance<Array<RdvUserInfoResponseDto>>({
      method: 'GET',
      url: `rdv/v1/infos/list/rdv`,
      params: {
        rdvId,
      },
    })
  ).data;
};
