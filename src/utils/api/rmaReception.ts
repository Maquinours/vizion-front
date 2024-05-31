import { privateInstance } from '../functions/axios';
import AssistanceReceptionRequestDto from '../types/AssistanceReceptionRequestDto';
import AssistanceReceptionResponseDto from '../types/AssistanceReceptionResponseDto';

export const createRmaReception = (data: AssistanceReceptionRequestDto) => {
  return privateInstance<AssistanceReceptionResponseDto>({
    method: 'POST',
    url: '/rma/v1/assistance-reception/',
    data,
  }).then((res) => res.data);
};
