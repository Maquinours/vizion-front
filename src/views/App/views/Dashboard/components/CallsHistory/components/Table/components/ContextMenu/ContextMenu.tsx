import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { FaPhoneAlt } from 'react-icons/fa';
import styles from './ContextMenu.module.scss';

type AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  number: string | undefined;
}>;
export default function AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  number,
}: AppViewDashboardViewCallsHistoryComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {number && (
                <MenuList>
                  <MenuItem>
                    <a href={`tel:${number}`} onClick={onClose}>
                      <FaPhoneAlt width={16} height={16} color={'#16204E'} className={styles.icon} />
                      <span className={styles.text}>Appeler le {number}</span>
                    </a>
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
