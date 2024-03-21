import React from 'react';
import styles from './Address.module.scss';
import AddressResponseDto from '../../../../../../../../../../utils/types/AddressResponseDto';
import { MdLocalPhone, MdLocationPin } from 'react-icons/md';
import { AiOutlineMail } from 'react-icons/ai';

type AppViewEnterpriseViewAddressBookModalViewAddressesComponentPropsAddressComponentProps = Readonly<{
  address: AddressResponseDto;
  index: number;
  onContextMenu: (e: React.MouseEvent, address: AddressResponseDto) => void;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewAddressesComponentAddressComponent({
  address,
  index,
  onContextMenu,
}: AppViewEnterpriseViewAddressBookModalViewAddressesComponentPropsAddressComponentProps) {
  return (
    <button className={styles.address_card} onContextMenu={(e) => onContextMenu(e, address)}>
      <div className={styles.header}>
        <div className={styles.header_title}>Adresse {index + 1}</div>
      </div>
      <div className={styles.divider} />
      <div className={styles.content}>
        <div className={styles.details}>
          <div className={styles.icon}>
            <MdLocationPin width="12" height="12" color="#16204E" />
          </div>
          <div className={styles.info}>
            <p>{address.enterpriseName}</p>
            <p>{address.fullName}</p>
            <p>{address.addressLineOne}</p>
            <p>
              {address.zipCode} {address.city}
            </p>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.icon}>
            <MdLocalPhone width="12" height="12" color="#16204E" />
          </div>
          <div className={styles.info}>
            <p>{address.phoneNumber ?? 'Aucune donnée'}</p>
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.icon}>
            <AiOutlineMail width="12" height="12" color="#16204E" />
          </div>
          <div className={styles.info}>
            <p>{address.email}</p>
          </div>
        </div>
      </div>
    </button>
  );
}
