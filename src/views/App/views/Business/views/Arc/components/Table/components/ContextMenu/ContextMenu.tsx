import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { VirtualElement } from '@popperjs/core';
import { Link } from '@tanstack/react-router';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { HiPencilAlt } from 'react-icons/hi';
import BusinessArcDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessArcDetailsResponseDto';
import styles from './ContextMenu.module.scss';

const routePath = '/app/businesses-rma/business/$businessId/arc';

type AppViewBusinessViewArcViewTableComponentContextMenuComponentProps = Readonly<{
  anchorElement: VirtualElement | undefined;
  setAnchorElement: React.Dispatch<React.SetStateAction<VirtualElement | undefined>>;
  item: BusinessArcDetailsResponseDto | undefined;
}>;
export default function AppViewBusinessViewArcViewTableComponentContextMenuComponent({
  anchorElement,
  setAnchorElement,
  item,
}: AppViewBusinessViewArcViewTableComponentContextMenuComponentProps) {
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
              {item && (
                <MenuList>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="update-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="viewport"
                      ignoreBlocker
                    >
                      <HiPencilAlt width={16} height={16} color={'#16204E'} />
                      <span>Modifier le produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      from={routePath}
                      to="delete-detail/$detailId"
                      params={{ detailId: item.id }}
                      search
                      replace
                      resetScroll={false}
                      preload="viewport"
                      ignoreBlocker
                    >
                      <FaTrash width={16} height={16} color={'#16204E'} />
                      <span>Supprimer le produit</span>
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
