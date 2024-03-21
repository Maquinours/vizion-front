import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { MdMailOutline, MdPassword, MdWork } from 'react-icons/md';
import { useAuthentifiedUserQuery } from '../../../../../../../../utils/functions/getAuthentifiedUser';
import { VirtualElement } from '@popperjs/core';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import CategoryClient from '../../../../../../../../../../utils/enums/CategoryClient';
import { Link, getRouteApi } from '@tanstack/react-router';
import styles from './ContextMenu.module.scss';
import React from 'react';

const Route = getRouteApi('/app/enterprises/$enterpriseId');

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

  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {profile && (
                <MenuList>
                  <MenuItem>
                    <Link from={Route.id} to="./create-contact-business/$contactId" params={(old) => ({ ...old, contactId: profile.id })} search={(old) => old}>
                      <MdWork width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Créer une affaire</span>
                    </Link>
                  </MenuItem>
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                    <MenuItem>
                      <Link from={Route.id} to="./send-email-to-contact/$contactId" params={(old) => ({ ...old, contactId: profile.id })} search={(old) => old}>
                        <MdMailOutline width={13} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Envoyer un mail</span>
                      </Link>
                    </MenuItem>
                  )}
                  {user.profile.id !== profile.id && user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                    <MenuItem>
                      <Link from={Route.id} to="./delete-contact/$contactId" params={(old) => ({ ...old, contactId: profile.id })} search={(old) => old}>
                        <FaTrash width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Supprimer ce contact</span>
                      </Link>
                    </MenuItem>
                  )}
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (
                    <MenuItem>
                      <Link from={Route.id} to="./update-contact/$contactId" params={(old) => ({ ...old, contactId: profile.id })} search={(old) => old}>
                        <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Modifier ce contact</span>
                      </Link>
                    </MenuItem>
                  )}
                  {(user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') ||
                    (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && profile.categoryClient !== CategoryClient.VIZEO)) && (
                    <MenuItem>
                      <Link
                        from={Route.id}
                        to="./update-contact-password/$contactId"
                        params={(old) => ({ ...old, contactId: profile.id })}
                        search={(old) => old}
                      >
                        <MdPassword width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Modifier mot de passe</span>
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
