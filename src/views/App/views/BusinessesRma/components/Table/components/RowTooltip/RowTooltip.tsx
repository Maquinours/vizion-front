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
      anchorSelect=".allbusiness-row"
      delayShow={500}
      float
      render={({ activeAnchor }) => {
        const item = items.find((item) => item.id === activeAnchor?.id);
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
