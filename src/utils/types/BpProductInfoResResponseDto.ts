import BpProductInfoHistoryQtyResponseDto from './BpProductInfoHistoryQtyResponseDto';
import BpProductInfoHistoryResponseDto from './BpProductInfoHistoryResponseDto';
import Page from './Page';

type BpProductInfoResResponseDto = {
  data: Page<BpProductInfoHistoryResponseDto> | null;
  qtyInfo: BpProductInfoHistoryQtyResponseDto | null;
};

export default BpProductInfoResResponseDto;
