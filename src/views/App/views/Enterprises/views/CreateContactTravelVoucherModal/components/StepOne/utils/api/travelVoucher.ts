import { privateInstance } from '../../../../../../../../../../utils/functions/axios';
import BusinessBpShipmentRequestDto from '../../../../../../../../../../utils/types/BusinessBpShipmentRequestDto';
import PrintedInfoResponseDto from '../../../../../../../../../../utils/types/PrintedInfoResponseDto';
import ShipmentRequestDto from '../../../../../../../../../../utils/types/ShipmentRequestDto';

export const generateTravelVoucher = (data: ShipmentRequestDto) => {
  return privateInstance<Array<PrintedInfoResponseDto>>({
    method: 'POST',
    url: '/business/v1/business/generate-shipment',
    data,
  }).then((res) => res.data);
};

export const generateBusinessBpTravelVoucher = (bpId: string, data: BusinessBpShipmentRequestDto) => {
  return privateInstance<Array<PrintedInfoResponseDto>>({
    method: 'POST',
    url: `/business/v1/business/bp/generate-shipment/${encodeURIComponent(bpId)}`,
    data,
  }).then((res) => res.data);
};
