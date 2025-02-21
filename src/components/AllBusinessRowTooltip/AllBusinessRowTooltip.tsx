import { Tooltip } from 'react-tooltip';
import AllBusinessState from '../../utils/enums/AllBusinessState';
import AllBusinessResponseDto from '../../utils/types/AllBusinessResponseDto';
import AllBusinessRowTooltipComponentContentComponent from './components/Content/Content';
import 'react-tooltip/dist/react-tooltip.css';

type AllBusinessRowTooltipComponentProps = Readonly<{
  items: Array<AllBusinessResponseDto>;
}>;
export default function AllBusinessRowTooltipComponent({ items }: AllBusinessRowTooltipComponentProps) {
  return (
    <Tooltip
      id="business-number-tooltip"
      delayShow={500}
      float
      render={({ content }) => {
        const item = items.find((item) => item.id === content);
        if (
          !!item &&
          !!item.state &&
          [AllBusinessState.DEVIS, AllBusinessState.ARC, AllBusinessState.BP, AllBusinessState.BL, AllBusinessState.FACTURE].includes(item.state)
        )
          return <AllBusinessRowTooltipComponentContentComponent item={item} />;
      }}
    />
  );
}
