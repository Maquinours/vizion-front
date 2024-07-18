import { Tooltip } from 'react-tooltip';
import AllBusinessResponseDto from '../../../../../../../../utils/types/AllBusinessResponseDto';

import 'react-tooltip/dist/react-tooltip.css';
import AppViewBusinessesRmaViewTableComponentRowTooltipComponentContentComponent from './components/Content/Content';
import AllBusinessState from '../../../../../../../../utils/enums/AllBusinessState';
type AppViewBusinessesRmaViewTableComponentRowTooltipComponentProps = Readonly<{
  items: Array<AllBusinessResponseDto>;
}>;
export default function AppViewBusinessesRmaViewTableComponentRowTooltipComponent({ items }: AppViewBusinessesRmaViewTableComponentRowTooltipComponentProps) {
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
          return <AppViewBusinessesRmaViewTableComponentRowTooltipComponentContentComponent item={item} />;
      }}
    />
  );
}
