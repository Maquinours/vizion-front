import EnterpriseResponseDto from '../../../../utils/types/EnterpriseResponseDto';
import EnterpriseComponentHeaderComponentButtonsComponent from './components/Buttons/Buttons';
import EnterpriseComponentHeaderComponentInformationsComponent from './components/Informations/Informations';

type EnterpriseModalComponentHeaderComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
}>;
export default function EnterpriseModalComponentHeaderComponent({ enterprise }: EnterpriseModalComponentHeaderComponentProps) {
  return (
    <>
      <EnterpriseComponentHeaderComponentButtonsComponent />
      <EnterpriseComponentHeaderComponentInformationsComponent enterprise={enterprise} />
    </>
  );
}
