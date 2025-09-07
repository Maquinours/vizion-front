import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import EnterpriseComponentHeaderComponentButtonsComponent from './components/Buttons/Buttons';
import EnterpriseComponentHeaderComponentInformationsComponent from './components/Informations/Informations';

type EnterpriseModalComponentHeaderComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
  onEmailHistoryClick: () => void;
}>;
export default function EnterpriseModalComponentHeaderComponent({ enterprise, onEmailHistoryClick }: EnterpriseModalComponentHeaderComponentProps) {
  return (
    <>
      <EnterpriseComponentHeaderComponentButtonsComponent enterprise={enterprise} onEmailHistoryClick={onEmailHistoryClick} />
      <EnterpriseComponentHeaderComponentInformationsComponent enterprise={enterprise} />
    </>
  );
}
