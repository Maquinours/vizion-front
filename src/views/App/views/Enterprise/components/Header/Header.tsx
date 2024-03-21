import EnterpriseResponseDto from '../../../../../../utils/types/EnterpriseResponseDto';
import EnterpriseHeaderButtons from './components/Buttons/Buttons';
import EnterpriseHeaderInformations from './components/Informations/Informations';

type AppViewEnterpriseViewHeaderComponentProps = Readonly<{
  enterprise: EnterpriseResponseDto;
}>;
export default function AppViewEnterpriseViewHeaderComponent({ enterprise }: AppViewEnterpriseViewHeaderComponentProps) {
  return (
    <>
      <EnterpriseHeaderButtons />
      <EnterpriseHeaderInformations enterprise={enterprise} />
    </>
  );
}
