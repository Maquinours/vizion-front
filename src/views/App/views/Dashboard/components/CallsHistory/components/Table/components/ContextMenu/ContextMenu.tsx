import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { FaPhoneAlt } from 'react-icons/fa';
import styles from './ContextMenu.module.scss';
import { MdGroups } from 'react-icons/md';
import { Link } from '@tanstack/react-router';
import ProfileResponseDto from '../../../../../../../../../../utils/types/ProfileResponseDto';
import { useContext } from 'react';
import { AircallWorkspaceContext } from '../../../../../../../../components/AircallWorkspace/utils/context';
import AircallContactResponseDto from '../../../../../../../../../../utils/types/AircallContactResponseDto';
import { HiPencilAlt } from 'react-icons/hi';

const routePath = '/app/dashboard';

type AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  data:
    | {
        number: string;
        contact: AircallContactResponseDto | null;
        profile: ProfileResponseDto | undefined;
      }
    | undefined;
}>;
export default function AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  data,
}: AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const { dialNumber } = useContext(AircallWorkspaceContext)!;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  const onCallNumber = () => {
    if (data?.number) {
      dialNumber(data.number).catch(() => {
        window.location.href = `tel:${data.number}`;
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
              {data && (
                <MenuList>
                  <MenuItem>
                    <button onClick={onCallNumber}>
                      <FaPhoneAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Appeler le {data.number}</span>
                    </button>
                  </MenuItem>
                  {data.profile ? (
                    <MenuItem>
                      <Link to="/app/enterprises/$enterpriseId" params={{ enterpriseId: data.profile.enterprise!.id }} onClick={onClose}>
                        <MdGroups width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Accéder à l'entreprise</span>
                      </Link>
                    </MenuItem>
                  ) : data.contact ? (
                    <MenuItem>
                      <Link from={routePath} to="update-aircall-contact/$contactId" params={{ contactId: data.contact.id.toString() }} onClick={onClose}>
                        <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Modifier la note</span>
                      </Link>
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      <Link from={routePath} to="create-aircall-contact/$number" params={{ number: data.number }} onClick={onClose}>
                        <HiPencilAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                        <span className={styles.text}>Ajouter une note</span>
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
