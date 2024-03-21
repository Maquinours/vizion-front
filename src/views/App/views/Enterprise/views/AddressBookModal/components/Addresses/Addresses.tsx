import React, { useState } from 'react';
import { PulseLoader } from 'react-spinners';
import styles from './Addresses.module.scss';
import EnterpriseAddressBookModalAddress from './components/Address/Address';
import { VirtualElement } from '@popperjs/core';
import EnterpriseAddressBookModalAddressContextMenu from './components/AddressContextMenu/AddressContextMenu';
import AddressResponseDto from '../../../../../../../../utils/types/AddressResponseDto';

type AppViewEnterpriseViewAddressBookModalViewAddressesComponentProps = Readonly<{
  isLoading: boolean;
  addresses: Array<AddressResponseDto> | undefined;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewAddressesComponent({
  isLoading,
  addresses,
}: AppViewEnterpriseViewAddressBookModalViewAddressesComponentProps) {
  const [contextMenuAnchorElement, setContextMenuAnchorElement] = useState<VirtualElement>();
  const [address, setAddress] = useState<AddressResponseDto>();

  const onAddressContextMenu = (e: React.MouseEvent, address: AddressResponseDto) => {
    e.preventDefault();
    setAddress(address);
    setContextMenuAnchorElement({
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
        top: e.clientY,
        right: e.clientX,
        bottom: e.clientY,
        left: e.clientX,
        toJSON: () => {},
      }),
    });
  };

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
    <>
      <div className={styles.address_container}>
        {addresses.map((address, index) => (
          <EnterpriseAddressBookModalAddress key={address.id} address={address} index={index} onContextMenu={onAddressContextMenu} />
        ))}
      </div>
      <EnterpriseAddressBookModalAddressContextMenu anchorElement={contextMenuAnchorElement} setAnchorElement={setContextMenuAnchorElement} address={address} />
    </>
  );
}
