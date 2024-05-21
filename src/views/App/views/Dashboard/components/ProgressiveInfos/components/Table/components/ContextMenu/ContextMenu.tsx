import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import { VirtualElement } from '@popperjs/core';
import styles from './ContextMenu.module.scss';
import { Link, getRouteApi } from '@tanstack/react-router';
import ProgressiveInfoResponseDto from '../../../../../../../../../../utils/types/ProgressiveInfoResponseDto';

const Route = getRouteApi('/app/dashboard');

type AppViewDashboardViewProgressiveInfosComponentTableComponentContextMenuComponentProps = Readonly<{
  anchor: VirtualElement | undefined;
  setAnchor: (anchor: VirtualElement | undefined) => void;
  progressiveInfo: ProgressiveInfoResponseDto | undefined;
}>;
export default function AppViewDashboardViewProgressiveInfosComponentTableComponentContextMenuComponent({
  anchor,
  setAnchor,
  progressiveInfo,
}: AppViewDashboardViewProgressiveInfosComponentTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchor);

  const onClose = () => {
    setAnchor(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchor} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              <MenuList>
                <MenuItem className={styles.menu_item}>
                  <Link
                    from={Route.id}
                    to="./update-progressive-info/$progressiveInfoId"
                    params={(old) => ({ ...old, progressiveInfoId: progressiveInfo!.id })}
                    search={(old) => old}
                    replace
                  >
                    <MdModeEdit className={styles.icon} />
                    <span className={styles.text}>Modifier</span>
                  </Link>
                </MenuItem>
                <MenuItem className={styles.menu_item}>
                  <Link
                    from={Route.id}
                    to="./delete-progressive-info/$progressiveInfoId"
                    params={(old) => ({ ...old, progressiveInfoId: progressiveInfo!.id })}
                    search={(old) => old}
                    replace
                  >
                    <FaTrash className={styles.icon} />
                    <span className={styles.text}>Supprimer</span>
                  </Link>
                </MenuItem>
              </MenuList>
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
