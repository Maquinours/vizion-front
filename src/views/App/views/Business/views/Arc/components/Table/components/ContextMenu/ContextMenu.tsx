import { ClickAwayListener, Fade, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import styles from './ContextMenu.module.scss';
import { VirtualElement } from '@popperjs/core';
import React from 'react';
import BusinessArcDetailsResponseDto from '../../../../../../../../../../utils/types/BusinessArcDetailsResponseDto';
import { Link, getRouteApi } from '@tanstack/react-router';
import { HiPencilAlt } from 'react-icons/hi';
import { FaTrash } from 'react-icons/fa';

const routeApi = getRouteApi('/app/businesses-rma/business/$businessId/arc');

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
        <ClickAwayListener onClickAway={onClose}>
          <Fade {...TransitionProps}>
            <Paper className={styles.menu_container}>
              {item && (
                <MenuList>
                  <MenuItem>
                    <Link from={routeApi.id} to="update-detail/$detailId" params={{ detailId: item.id }} search={(old) => old} replace resetScroll={false}>
                      <HiPencilAlt width={16} height={16} color={'#16204E'} />
                      <span>Modifier le produit</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link from={routeApi.id} to="delete-detail/$detailId" params={{ detailId: item.id }} search={(old) => old} replace resetScroll={false}>
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
