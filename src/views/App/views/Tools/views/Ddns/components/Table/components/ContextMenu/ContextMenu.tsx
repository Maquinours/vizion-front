import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { Link, getRouteApi } from '@tanstack/react-router';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import DnsEntryResponseDto from '../../../../../../../../../../utils/types/DnsEntryResponseDto';
import { FaTrash } from 'react-icons/fa';
import styles from './ContextMenu.module.scss';

const routeApi = getRouteApi('/app/tools/ddns');

type AppViewToolsViewDdnsViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  ddns: DnsEntryResponseDto | undefined;
}>;
export default function AppViewToolsViewDdnsViewTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  ddns,
}: AppViewToolsViewDdnsViewTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className={styles.popper}>
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {ddns && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routeApi.id}
                      to="delete/$ddnsId"
                      params={{ ddnsId: ddns.id }}
                      search={(old) => old}
                      replace
                      resetScroll={false}
                      preload="render"
                    >
                      <FaTrash className={styles.icon} />
                      <span className={styles.text}>Supprimer</span>
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
