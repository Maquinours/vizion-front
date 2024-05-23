import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { Link, getRouteApi } from '@tanstack/react-router';
import { VirtualElement } from '@popperjs/core';
import ExternalLinkResponseDto from '../../../../../../../../../../utils/types/ExternalLinkResponseDto';
import { HiPencilAlt } from 'react-icons/hi';
import { FaFileImport, FaTrash } from 'react-icons/fa';
import styles from './ContextMenu.module.scss';
import React from 'react';

const routeApi = getRouteApi('/app/tools/external-links');

type AppViewToolsViewExternalLinksViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  externalLink: ExternalLinkResponseDto | undefined;
}>;
export default function AppViewToolsViewExternalLinksViewTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  externalLink,
}: AppViewToolsViewExternalLinksViewTableComponentContextMenuComponentProps) {
  const isOpen = Boolean(anchorElement);

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start" className={styles.popper}>
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {externalLink && (
                <MenuList>
                  <MenuItem>
                    <Link from={routeApi.id} to="./update/$externalLinkId" params={{ externalLinkId: externalLink.id }} replace search={(old) => old}>
                      <HiPencilAlt className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="./archive/$externalLinkId" params={{ externalLinkId: externalLink.id }} replace search={(old) => old}>
                      <FaFileImport className={styles.icon} />
                      <span className={styles.text}>{externalLink.archived ? 'Désarchiver' : 'Archiver'}</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="./delete/$externalLinkId" params={{ externalLinkId: externalLink.id }} replace search={(old) => old}>
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
