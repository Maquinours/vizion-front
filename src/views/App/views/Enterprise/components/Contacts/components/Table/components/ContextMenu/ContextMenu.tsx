import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import { isValidPhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js';
import React, { useContext } from 'react';
import { FaHistory, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { MdMailOutline, MdPassword, MdWork } from 'react-icons/md';
import CategoryClient from '../../../../../../../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import styles from './ContextMenu.module.scss';
import { AircallWorkspaceContext } from '../../../../../../../../components/AircallWorkspace/utils/context';

const routePath = '/app/enterprises/$enterpriseId';

type AppViewEnterpriseViewContactsComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  profile: ProfileResponseDto | undefined;
}>;
export default function AppViewEnterpriseViewContactsComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  profile,
}: AppViewEnterpriseViewContactsComponentTableComponentContextMenuComponentProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const { dialNumber } = useContext(AircallWorkspaceContext)!;

  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const onCallNumber = (number: string) => {
    if (number) {
      dialNumber(number).catch(() => {
        window.location.href = `tel:${number}`;
      });
    }
    onClose();
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {profile && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="./create-contact-business/$contactId"
                      params={{ contactId: profile.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <MdWork width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Créer une affaire</span>
                    </Link>
                  </MenuItem>
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="./send-email-to-contact/$contactId"
                        params={{ contactId: profile.id }}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <MdMailOutline width={13} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Envoyer un mail</span>
                      </Link>
                    </MenuItem>
                  )}
                  {user.profile.id !== profile.id && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="./delete-contact/$contactId"
                        params={{ contactId: profile.id }}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Supprimer ce contact</span>
                      </Link>
                    </MenuItem>
                  )}
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="./update-contact/$contactId"
                        params={{ contactId: profile.id }}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Modifier ce contact</span>
                      </Link>
                    </MenuItem>
                  )}
                  {(user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') ||
                    (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && profile.categoryClient !== CategoryClient.VIZEO)) && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="./update-contact-password/$contactId"
                        params={{ contactId: profile.id }}
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <MdPassword width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Modifier mot de passe</span>
                      </Link>
                    </MenuItem>
                  )}
                  {[profile.phoneNumber, profile.standardPhoneNumber]
                    .filter((phoneNumber): phoneNumber is string => !!phoneNumber && isValidPhoneNumber(phoneNumber, 'FR'))
                    .map((phoneNumber, index) => {
                      const number = parsePhoneNumberWithError(phoneNumber, 'FR');
                      return (
                        <MenuItem key={index}>
                          <button onClick={() => onCallNumber(number.number)}>
                            <FaPhoneAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                            <span className={styles.text}>Appeler le {number.formatNational()}</span>
                          </button>
                        </MenuItem>
                      );
                    })}
                  {profile.email && (
                    <MenuItem>
                      <Link
                        from={routePath}
                        to="email-history"
                        search={(old) => ({ ...old, addresses: [profile.email!.toLowerCase()] })}
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <FaHistory width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Historique des mails</span>
                      </Link>
                    </MenuItem>
                  )}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
