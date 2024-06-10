import { PulseLoader } from 'react-spinners';
import AddressResponseDto from '../../../../../../../../utils/types/AddressResponseDto';
import styles from './Addresses.module.scss';
import EnterpriseAddressBookModalAddress from './components/Address/Address';

type AppViewEnterpriseViewAddressBookModalViewAddressesComponentProps = Readonly<{
  isLoading: boolean;
  addresses: Array<AddressResponseDto> | undefined;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewAddressesComponent({
  isLoading,
  addresses,
}: AppViewEnterpriseViewAddressBookModalViewAddressesComponentProps) {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <PulseLoader color="#31385A" loading={isLoading} className="" size={10} speedMultiplier={0.5} />
      </div>
    );
  } else if (!addresses || addresses.length === 0) {
    return <div className={styles.no_content}>Aucune adresse enregistrée</div>;
  }
  return (
    <div className={styles.address_container}>
      {addresses.map((address, index) => (
        <EnterpriseAddressBookModalAddress key={address.id} address={address} index={index} />
      ))}
    </div>
  );
}
