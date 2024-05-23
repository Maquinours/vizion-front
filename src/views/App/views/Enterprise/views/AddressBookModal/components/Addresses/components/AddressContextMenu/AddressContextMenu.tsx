import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import React from 'react';
import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './AddressContextMenu.module.scss';
import { VirtualElement } from '@popperjs/core';
import { MdModeEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import AddressResponseDto from '../../../../../../../../../../utils/types/AddressResponseDto';

const Route = getRouteApi('/app/enterprises/$enterpriseId/address-book');

type AppViewEnterpriseViewAddressBookModalViewAddressesComponentContextComponentMenuProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  address: AddressResponseDto | undefined;
}>;
export default function AppViewEnterpriseViewAddressBookModalViewAddressesComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  address,
}: AppViewEnterpriseViewAddressBookModalViewAddressesComponentContextComponentMenuProps) {
  const onClose = () => {
    setAnchorElement(undefined);
  };

  const isOpen = !!anchorElement;

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {address && (
                <MenuList autoFocusItem={isOpen}>
                  <MenuItem>
                    <Link from={Route.id} to="update/$addressId" params={(old) => ({ ...old, addressId: address.id })} search={(old) => old} replace>
                      <span className={styles.icon}>
                        <MdModeEdit width={13} height={13} color={'#16204E'} />
                      </span>
                      <span className={styles.text}>Modifier</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={Route.id} to="delete/$addressId" params={(old) => ({ ...old, addressId: address.id })} search={(old) => old} replace>
                      <span className={styles.icon}>
                        <FaTrash width={13} height={13} color={'#16204E'} />
                      </span>
                      <span className={styles.text}>Supprimer la ligne</span>
                    </Link>
                  </MenuItem>
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
