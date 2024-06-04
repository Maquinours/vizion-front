import AssistanceReceptionDetailRequestDto from './AssistanceReceptionDetailRequestDto';

type AssistanceReceptionRequestDto = {
  assistanceId?: string | null;
  detailDtoList?: Array<AssistanceReceptionDetailRequestDto> | null;
};

export default AssistanceReceptionRequestDto;
