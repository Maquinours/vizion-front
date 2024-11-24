import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { FaFileImport, FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import ExternalLinkResponseDto from '../../../../../../../../../../utils/types/ExternalLinkResponseDto';
import styles from './ContextMenu.module.scss';

const routePath = '/app/tools/external-links';

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
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {externalLink && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="./update/$externalLinkId"
                      params={{ externalLinkId: externalLink.id }}
                      replace
                      resetScroll={false}
                      search
                      preload="render"
                      onClick={onClose}
                    >
                      <HiPencilAlt className={styles.icon} />
                      <span className={styles.text}>Modifier</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="./archive/$externalLinkId"
                      params={{ externalLinkId: externalLink.id }}
                      replace
                      resetScroll={false}
                      search
                      preload="render"
                      onClick={onClose}
                    >
                      <FaFileImport className={styles.icon} />
                      <span className={styles.text}>{externalLink.archived ? 'Désarchiver' : 'Archiver'}</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="./delete/$externalLinkId"
                      params={{ externalLinkId: externalLink.id }}
                      replace
                      resetScroll={false}
                      search
                      preload="render"
                      onClick={onClose}
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
