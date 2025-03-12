import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { Link, getRouteApi } from '@tanstack/react-router';
import { isValidPhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js';
import { FaCopy, FaFile, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdMailOutline, MdPassword, MdWork } from 'react-icons/md';
import { toast } from 'react-toastify';
import CategoryClient from '../../../../../../../../utils/enums/CategoryClient';
import ProfileResponseDto from '../../../../../../../../utils/types/ProfileResponseDto';
import { useAuthentifiedUserQuery } from '../../../../../../utils/functions/getAuthentifiedUser';
import styles from './ContactContextMenu.module.scss';

const routeApi = getRouteApi('/app/enterprises');

type AppViewEnterprisesViewTableComponentContactContextMenuProps = Readonly<{
  contact: ProfileResponseDto | undefined;
  anchorElement: HTMLElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
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
    <Popper
      open={isOpen}
      anchorEl={anchorElement}
      transition
      placement="bottom-start"
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
      disablePortal={false}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {contact && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="create-contact-business/$contactId"
                      params={{ contactId: contact.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
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
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
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
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
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
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
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
                          search
                          replace
                          resetScroll={false}
                          preload="render"
                          onClick={onClose}
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
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
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
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
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
                        search
                        replace
                        resetScroll={false}
                        preload="render"
                        onClick={onClose}
                      >
                        <FaTrash className={styles.icon} />
                        <span className={styles.text}>Supprimer ce contact</span>
                      </Link>
                    </MenuItem>
                  )}
                  {[contact.phoneNumber, contact.standardPhoneNumber]
                    .filter((phoneNumber): phoneNumber is string => !!phoneNumber && isValidPhoneNumber(phoneNumber, 'FR'))
                    .map((phoneNumber, index) => {
                      const number = parsePhoneNumberWithError(phoneNumber, 'FR');
                      return (
                        <MenuItem key={index}>
                          <a href={`tel:${number.number}`} onClick={onClose}>
                            <FaPhoneAlt className={styles.icon} />
                            <span className={styles.text}>Appeler le {number.formatNational()}</span>
                          </a>
                        </MenuItem>
                      );
                    })}
                </MenuList>
              )}
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
