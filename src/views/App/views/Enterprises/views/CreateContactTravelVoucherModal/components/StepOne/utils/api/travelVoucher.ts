import { privateInstance } from '../../../../../../../../../../utils/functions/axios';
import PrintedInfoResponseDto from '../../../../../../../../../../utils/types/PrintedInfoResponseDto';
import ShipmentRequestDto from '../../../../../../../../../../utils/types/ShipmentRequestDto';

export const generateTravelVoucher = (data: ShipmentRequestDto) => {
  return privateInstance<Array<PrintedInfoResponseDto>>({
    method: 'POST',
    url: '/business/v1/business/generate-shipment',
    data,
  }).then((res) => res.data);
};
