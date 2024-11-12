import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import ProductVersionResponseDto from '../../../../../../../../../../../../utils/types/ProductVersionResponseDto';
import styles from './ContextMenu.module.scss';

const routePath = '/app/products/$productId/manage';

type AppViewProductViewManageViewVersionsComponentTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  version: ProductVersionResponseDto | undefined;
}>;
export default function AppViewProductViewManageViewVersionsComponentTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  version,
}: AppViewProductViewManageViewVersionsComponentTableComponentContextMenuComponentProps) {
  const isOpen = !!anchorElement;

  const onClose = () => {
    setAnchorElement(undefined);
  };

  return (
    <Popper open={isOpen} anchorEl={anchorElement} transition placement="bottom-start">
      {({ TransitionProps }) => (
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {version && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="update-version/$versionId"
                      params={{ versionId: version.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <HiPencilAlt className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Modifier la version</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="delete-version/$versionId"
                      params={{ versionId: version.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="render"
                      onClick={onClose}
                    >
                      <FaTrash className={styles.icon} width={16} height={16} color="#16204E" />
                      <span className={styles.text}>Supprimer la version</span>
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
