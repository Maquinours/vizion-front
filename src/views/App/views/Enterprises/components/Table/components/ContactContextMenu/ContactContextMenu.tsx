import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { VirtualElement } from '@popperjs/core';
import { Link, getRouteApi } from '@tanstack/react-router';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import { MdMailOutline, MdPassword, MdWork } from 'react-icons/md';
import styles from './ContactContextMenu.module.scss';
import { FaCopy, FaFile, FaTrash } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { HiPencilAlt } from 'react-icons/hi';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import { toast } from 'react-toastify';

const routeApi = getRouteApi('/app/enterprises');

type AppViewEnterprisesViewTableComponentContactContextMenuProps = Readonly<{
  contact: ProfileResponseDto | undefined;
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
}>;
export default function AppViewEnterprisesViewTableComponentContactContextMenu({
  contact,
  anchorElement,
  setAnchorElement,
}: AppViewEnterprisesViewTableComponentContactContextMenuProps) {
  const { data: user } = useAuthentifiedUserQuery();

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const copyEmail = (contact: ProfileResponseDto) => {
    const copyText = contact.email;
    if (copyText) {
      navigator.clipboard
        .writeText(copyText)
        .then(() => {
          toast.success(copyText + ' copié avec succès');
        })
        .catch(() => {
          toast.error('Une erreur est survenue lors de la copie du texte');
        });
    }
  };

  const copyAddress = (contact: ProfileResponseDto) => {
    const copyText = `${contact.lastName ?? ''} ${contact.firstName ?? ''}
      ${contact.enterprise?.name ?? ''}
      ${contact.enterprise?.addressLineOne ?? ''}
      ${contact.enterprise?.addressLineTwo ?? ''}
      ${contact.enterprise?.zipCode ?? ''} ${contact.enterprise?.city ?? ''}
      ${contact.email ?? ''}
      ${contact.phoneNumber ?? ''}
      `.trim();

    if (copyText) {
      navigator.clipboard.writeText(copyText);
      toast.success('Adresse copiée avec succès');
    }
  };

  const isOpen = !!anchorElement;

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {contact && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="create-contact-business/$contactId"
                      params={{ contactId: contact.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                    >
                      <MdWork className={styles.icon} />
                      <span className={styles.text}>Créer une affaire</span>
                    </Link>
                  </MenuItem>
                  {user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)) && (
                    <MenuItem>
                      <Link
                        from={routeApi.id}
                        to="create-enterprise-rma/$enterpriseId"
                        params={{ enterpriseId: contact.enterprise!.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <MdWork className={styles.icon} />
                        <span className={styles.text}>Créer un RMA</span>
                      </Link>
                    </MenuItem>
                  )}
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && [
                    <MenuItem key={0}>
                      <Link
                        from={routeApi.id}
                        to="create-contact-travel-voucher/$contactId"
                        params={{ contactId: contact.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <FaFile className={styles.icon} />
                        <span className={styles.text}>Créer un bon de transport</span>
                      </Link>
                    </MenuItem>,
                    <MenuItem key={1}>
                      <Link
                        from={routeApi.id}
                        to="create-contact/$enterpriseId"
                        params={{ enterpriseId: contact.enterprise!.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <IoMdAddCircleOutline className={styles.icon} />
                        <span className={styles.text}>Ajouter un nouveau contact</span>
                      </Link>
                    </MenuItem>,
                    contact.email && (
                      <MenuItem key={2}>
                        <Link
                          from={routeApi.id}
                          to="send-email-to-contact/$contactId"
                          params={{ contactId: contact.id }}
                          search={(old) => old}
                          replace
                          resetScroll={false}
                        >
                          <MdMailOutline className={styles.icon} />
                          <span className={styles.text}>Envoyer un mail</span>
                        </Link>
                      </MenuItem>
                    ),
                  ]}
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="update-contact/$contactId"
                      params={{ contactId: contact.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                    >
                      <HiPencilAlt className={styles.icon} />
                      <span className={styles.text}>Modifier ce contact</span>
                    </Link>
                  </MenuItem>
                  {(user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') ||
                    (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') &&
                      (contact.categoryClient !== CategoryClient.VIZEO || user.profile.id === contact.id))) && (
                    <MenuItem>
                      <Link
                        from={routeApi.id}
                        to="update-contact-password/$contactId"
                        params={{ contactId: contact.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <MdPassword className={styles.icon} />
                        <span className={styles.text}>Modifier le mot de passe</span>
                      </Link>
                    </MenuItem>
                  )}
                  {user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && [
                    contact.email && (
                      <MenuItem key={0}>
                        <button onClick={() => copyEmail(contact)}>
                          <FaCopy className={styles.icon} />
                          <span className={styles.text}>Copier Email</span>
                        </button>
                      </MenuItem>
                    ),
                    <MenuItem key={1}>
                      <button onClick={() => copyAddress(contact)}>
                        <FaCopy className={styles.icon} />
                        <span className={styles.text}>Copier adresse</span>
                      </button>
                    </MenuItem>,
                  ]}
                  {user.profile.id !== contact.id && (
                    <MenuItem>
                      <Link
                        from={routeApi.id}
                        to="delete-contact/$contactId"
                        params={{ contactId: contact.id }}
                        search={(old) => old}
                        replace
                        resetScroll={false}
                      >
                        <FaTrash className={styles.icon} />
                        <span className={styles.text}>Supprimer ce contact</span>
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
