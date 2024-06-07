import ShipmentRequestDto from "./ShipmentRequestDto";

type BusinessBpShipmentRequestDto = Omit<ShipmentRequestDto, 'businessNumber' | 'note'>

export default BusinessBpShipmentRequestDto;